// Local browser regression checks. API writes are intercepted; never submits a live order.
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const base = process.env.ROUTINE_PREVIEW_URL || 'http://127.0.0.1:3109';
const output = process.env.ROUTINE_QA_OUTPUT || path.resolve('.next/qa-routine-cart');
mkdirSync(output, { recursive: true });
const publicApi = 'https://alvora-backend.vercel.app/api';
const [catalog, store] = await Promise.all([
  fetch(`${publicApi}/products?isVisible=true`).then(r => r.json()),
  fetch(`${publicApi}/settings`).then(r => r.json()),
]);
assert.ok(Array.isArray(catalog) && catalog.length >= 3, 'Need at least three public products');
let submitted;
let config = { minimumDistinctProducts: 2, tiers: [{ minProducts: 2, discountPercent: 10 }, { minProducts: 3, discountPercent: 15 }], quantityBonusEnabled: true, quantityBonusPercent: 5 };
let products = catalog.map(p => ({ ...p, price: 1000, pricingOffers: null, trackInventory: false, inStock: true }));
const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.setRequestInterception(true);
page.on('request', async request => {
  const url = new URL(request.url());
  if (/facebook|tiktok|googletagmanager|google-analytics/.test(url.hostname)) return request.abort();
  if (url.pathname.startsWith('/api/')) {
    const endpoint = url.pathname.slice(4);
    let body = [];
    if (endpoint === '/products') body = products;
    else if (endpoint === '/settings') body = { ...store, routineDiscount: config };
    else if (endpoint === '/settings/routine') {
      if (request.method() === 'PUT') config = JSON.parse(request.postData());
      body = config;
    } else if (endpoint === '/auth/me') body = { id: 'qa-admin', role: 'admin', email: 'qa@example.test', name: 'QA Admin' };
    else if (endpoint === '/orders' && request.method() === 'POST') { submitted = JSON.parse(request.postData()); body = { ...submitted, id: 'QA-ROUTINE-ORDER', date: '2026-09-26', confirmationEmailAccepted: false }; }
    else if (endpoint === '/bundles') body = { bundles: [] };
    return request.respond({ status: request.method() === 'OPTIONS' ? 204 : 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': base, 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS' }, body: request.method() === 'OPTIONS' ? '' : JSON.stringify(body) });
  }
  return request.continue();
});
const card = index => `[data-routine-product="${products[index].id}"]`;
const clickText = async (selector, text) => page.$$eval(selector, (nodes, label) => {
  const node = nodes.find(node => node.textContent.trim() === label);
  if (!node) throw new Error(`Button missing: ${label}`);
  node.click();
}, text);
const checkTotals = async (percent, subtotal, savings, total) => {
  await page.waitForFunction((percent, total) => {
    const section = document.querySelector('[data-testid="routine-totals"]');
    return section?.textContent.includes(`Routine Savings (${percent}%)`) && document.querySelector('[data-testid="routine-total"]')?.textContent === `Rs. ${total.toLocaleString('en-PK')}`;
  }, { timeout: 10000 }, percent, total);
  for (const [field, value] of Object.entries({ subtotal, savings, total })) {
    const text = await page.$eval(`[data-testid="routine-${field}"]`, node => node.textContent);
    assert.ok(text.includes(`Rs. ${value.toLocaleString('en-PK')}`), `${field}: ${text}`);
  }
};
try {
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
  await page.goto(`${base}/bundles/build`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector(card(0));
  await page.$$eval('[data-routine-product]', nodes => nodes.forEach(node => node.scrollIntoView()));
  await page.waitForFunction(() => [...document.querySelectorAll('[data-routine-product] img')].every(img => img.complete && img.naturalWidth > 0 && img.getBoundingClientRect().height > 100), { timeout: 30000 });
  const imageResults = await page.$$eval('[data-routine-product] img', nodes => nodes.map(img => ({ alt: img.alt, src: img.currentSrc, width: img.naturalWidth, height: img.getBoundingClientRect().height })));
  assert.equal(imageResults.length, products.length);
  assert.ok(imageResults.every(img => !img.src.includes('placeholder')), 'Every live catalog card should load its actual photo');
  console.log(`PASS: ${imageResults.length} real catalog photos loaded in visible, sized image containers`);

  await clickText(`${card(0)} button`, 'Add to Routine');
  await checkTotals(0, 1000, 0, 1000);
  assert.ok(await page.$eval('aside[aria-label="Your Routine"]', node => node.textContent.includes('at least 2 distinct products')));
  console.log('PASS: 1 product, 0%, clear minimum messaging');
  await clickText(`${card(1)} button`, 'Add to Routine');
  await checkTotals(10, 2000, 200, 1800);
  console.log('PASS: 2 distinct x 1, 10%, total Rs. 1,800');
  await clickText(`${card(2)} button`, 'Add to Routine');
  await checkTotals(15, 3000, 450, 2550);
  console.log('PASS: 3 distinct x 1, 15%, total Rs. 2,550');
  await page.$eval(`${card(2)} button[aria-label^="Decrease"]`, b=>b.click());
  await page.$eval(`${card(0)} button[aria-label^="Increase"]`, b=>b.click());
  await checkTotals(15, 3000, 450, 2550);
  console.log('PASS: 2 distinct, qty 2 + 1, 15%, total Rs. 2,550');
  await clickText(`${card(2)} button`, 'Add to Routine');
  await page.$eval(`${card(0)} button[aria-label^="Increase"]`, b=>b.click());
  await checkTotals(20, 5000, 1000, 4000);
  console.log('PASS: 3 distinct, qty 3 + 1 + 1, 20%, total Rs. 4,000');
  await clickText('aside[aria-label="Your Routine"] button', 'Add routine to cart');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('alvora_cart') || '[]').length === 1);

  let cart = await page.evaluate(() => JSON.parse(localStorage.getItem('alvora_cart')));
  assert.equal(cart[0].quantity, 1); assert.equal(cart[0].routineComponents.length, 3);
  assert.deepEqual(cart[0].routineComponents.map(c => c.quantity).sort(), [1, 1, 3]);
  assert.equal(cart[0].resolvedUnitPrice, 4000);
  await page.waitForSelector('[aria-label="Close shopping bag"]');
  await page.click('[aria-label="Increase quantity of Custom Routine (5 items)"]');
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('alvora_cart'))[0].quantity===2);
  assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('alvora_cart'))))[0].resolvedUnitPrice,4000);
  await page.click('[aria-label="Decrease quantity of Custom Routine (5 items)"]');
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('alvora_cart'))[0].quantity===1);
  assert.ok(await page.evaluate(() => document.body.textContent.includes('Custom Routine (5 items)')));
  await page.click('[aria-label="Close shopping bag"]');
  await page.waitForFunction(() => ![...document.querySelectorAll('aside[aria-label="Your Routine"] button')].find(b => b.textContent.includes('Add routine again'))?.disabled);
  await clickText('aside[aria-label="Your Routine"] button', 'Add routine again');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('alvora_cart')).length === 2);
  console.log('PASS one combined routine, exact quantities and Rs.4,000; close and add again works');
  await page.click('[aria-label="Close shopping bag"]');
  await page.$eval(card(0)+' button[aria-label$="from selection"]',b=>b.click());
  assert.equal(await page.$eval(card(0), el => el.dataset.selected), 'false');
  await page.$eval('aside button[aria-label="Remove '+products[1].name+'"]',b=>b.click());
  assert.equal(await page.$eval(card(1), el => el.dataset.selected), 'false');
  console.log('PASS one-click removal from grid and summary');
  await page.evaluate(() => { const cart = JSON.parse(localStorage.getItem('alvora_cart')); localStorage.setItem('alvora_cart',JSON.stringify([cart[0]])); });
  await page.goto(base+'/checkout', { waitUntil:'networkidle2' });
  await page.waitForSelector('[aria-label="Included routine products"]');
  await page.type('input[placeholder="e.g. Ali Raza"]','Routine QA');
  await page.type('input[type="tel"]','03001234567');
  await page.type('input[placeholder="House #, Street name, Sector / Area"]','123 Test Street');
  await page.type('input[placeholder="e.g. Gujranwala, Karachi, Islamabad"]','Karachi');
  await page.$eval('form', form => form.requestSubmit());
  await page.waitForFunction(() => document.body.textContent.includes('Order Placed Successfully!'));
  assert.equal(submitted.items.length,1);assert.equal(submitted.items[0].routineComponents.length,3);
  assert.equal(submitted.items[0].price,4000);assert.equal(submitted.items[0].quantity,1);
  assert.equal(submitted.subtotal,4000);assert.equal(submitted.discountAmount,0);
  assert.ok(await page.evaluate(() => document.querySelector('[aria-label="Included routine products"]')?.textContent.includes('3 ×')));
  console.log('PASS checkout submits one parent with components and net price; confirmation displays contents');
  await page.goto(base+'/product/'+(products.find(p => p.name.includes('Clear Acne Serum')) || products[0]).slug,{waitUntil:'networkidle2'});
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some(b => /add to (cart|bag)/i.test(b.textContent)));
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some(b => /add to (cart|bag)/i.test(b.textContent) && Object.keys(b).some(k => k.startsWith('__reactProps') && typeof b[k]?.onClick === 'function')));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const addProduct = async () => page.$$eval('button', nodes => { const b=nodes.find(b => /add to (cart|bag)/i.test(b.textContent) && !b.disabled); if(!b)throw new Error('No enabled add button');b.click(); });
  await addProduct();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('alvora_cart')).length===1);
  assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('alvora_cart'))))[0].quantity,1);
  await page.click('[aria-label="Close shopping bag"]');
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some(b => /add to (cart|bag)/i.test(b.textContent) && !b.disabled));
  await addProduct();
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('alvora_cart'))[0]?.quantity===2);
  console.log('PASS fresh product quantity 1, then exactly 2 after adding one more');
  await page.click('[aria-label="Close shopping bag"]');
  await page.goto(base+'/bundles/build',{waitUntil:'networkidle2'});
  await page.waitForSelector(card(0));
  await clickText(card(0)+' button','Add to Routine');await clickText(card(1)+' button','Add to Routine');
  await clickText('aside button','Add routine to cart');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('alvora_cart')).length===2);
  cart=await page.evaluate(()=>JSON.parse(localStorage.getItem('alvora_cart')));
  assert.equal(cart.find(i=>!i.isRoutine).quantity,2);assert.equal(cart.find(i=>i.isRoutine).quantity,1);
  assert.equal(cart.find(i=>i.isRoutine).routineComponents[0].quantity,1);
  console.log('PASS routine components never merge into standalone product quantity');
  await page.screenshot({path:path.join(output,'routine-cart-desktop.png'),fullPage:true});
  await page.click('[aria-label="Close shopping bag"]');
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:path.join(output,'routine-removal-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);
} catch(error) {console.error('Diagnostics',errors,await page.evaluate(()=>document.body.innerText.slice(-2000)));throw error;}
finally {await browser.close();}
