// Local browser regression checks. API writes are intercepted; never submits a live order.
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const base = process.env.ROUTINE_PREVIEW_URL || 'http://localhost:3000';
const output = process.env.ROUTINE_QA_OUTPUT || path.resolve('qa-routine');
mkdirSync(output, { recursive: true });
const publicApi = 'https://alvora-backend.vercel.app/api';
const [catalog, store] = await Promise.all([
  fetch(`${publicApi}/products?isVisible=true`).then(r => r.json()),
  fetch(`${publicApi}/settings`).then(r => r.json()),
]);
assert.ok(Array.isArray(catalog) && catalog.length >= 3, 'Need at least three public products');
let config = { minimumDistinctProducts: 2, tiers: [{ minProducts: 2, discountPercent: 10 }, { minProducts: 3, discountPercent: 15 }], quantityBonusEnabled: true, quantityBonusPercent: 5 };
let products = catalog.map(p => ({ ...p, price: 1000, pricingOffers: null, trackInventory: false, inStock: true }));
const browser = await puppeteer.launch({ headless: true });
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
  await page.click(`${card(2)} button[aria-label^="Decrease"]`);
  await page.click(`${card(0)} button[aria-label^="Increase"]`);
  await checkTotals(15, 3000, 450, 2550);
  console.log('PASS: 2 distinct, qty 2 + 1, 15%, total Rs. 2,550');
  await clickText(`${card(2)} button`, 'Add to Routine');
  await page.click(`${card(0)} button[aria-label^="Increase"]`);
  await checkTotals(20, 5000, 1000, 4000);
  console.log('PASS: 3 distinct, qty 3 + 1 + 1, 20%, total Rs. 4,000');
  await clickText('aside[aria-label="Your Routine"] button', 'Add routine to cart');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('alvora_cart') || '[]').length === 3);
  assert.ok(await page.evaluate(() => JSON.parse(localStorage.getItem('alvora_cart')).every(item => item.isRoutine === true)));
  assert.ok(await page.evaluate(() => document.body.textContent.includes('Routine Savings (20%)')));
  await page.goto(`${base}/checkout`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForFunction(() => document.body.textContent.includes('Routine Savings (20%)'));
  console.log('PASS: routine flag, quantities and 20% savings persist through cart and checkout reload');

  await page.evaluate(() => { localStorage.setItem('pb_admin_token', 'qa-intercepted-token'); localStorage.setItem('alvora_admin_user', JSON.stringify({ name: 'QA Admin', role: 'admin' })); });
  await page.goto(`${base}/admin/routine-discounts`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('#routine-bonus');
  await page.$eval('#routine-bonus', node => { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(node, '7'); node.dispatchEvent(new Event('input', { bubbles: true })); });
  await clickText('button', 'Add tier');
  await page.$eval('input[aria-label="Tier 3 discount"]', node => { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(node, '22'); node.dispatchEvent(new Event('input', { bubbles: true })); });
  await clickText('button', 'Save routine discounts');
  await page.waitForFunction(() => document.body.textContent.includes('Routine discounts saved.'));
  assert.equal(config.quantityBonusPercent, 7);
  assert.equal(config.tiers[2].discountPercent, 22);
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('#routine-bonus');
  assert.equal(await page.$eval('#routine-bonus', node => node.value), '7');
  assert.equal(await page.$eval('input[aria-label="Tier 3 discount"]', node => node.value), '22');
  console.log('PASS: admin saves custom bonus and added tier, reload restores persisted API values');
  await page.screenshot({ path: path.join(output, 'routine-admin.png'), fullPage: true });

  await page.goto(`${base}/bundles/build`, { waitUntil: 'networkidle2' });
  await page.waitForSelector(card(0));
  for (const index of [0, 1, 2, 3]) await clickText(`${card(index)} button`, 'Add to Routine');
  await page.click(`${card(0)} button[aria-label^="Increase"]`);
  await checkTotals(29, 5000, 1450, 3550);
  console.log('PASS: storefront reads admin-saved 4-product tier (22%) plus custom quantity bonus (7%)');

  config = { ...config, quantityBonusPercent: 5, tiers: config.tiers.slice(0, 2) };
  products = catalog;
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${base}/bundles/build`, { waitUntil: 'networkidle2' });
  await page.waitForSelector(card(0));
  for (const index of [1, 2, 3]) await clickText(`${card(index)} button`, 'Add to Routine');
  await page.click(`${card(1)} button[aria-label^="Increase"]`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(output, 'routine-desktop.png'), fullPage: true });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.screenshot({ path: path.join(output, 'routine-mobile.png'), fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'No mobile horizontal overflow');
  assert.deepEqual(errors, [], 'No browser runtime errors');
  console.log(`PASS: desktop/mobile rendering, no overflow or runtime errors. Screenshots: ${output}`);
} catch (error) {
  console.error('Browser diagnostics:', errors, await page.evaluate(() => document.body.innerText.slice(0, 1800)));
  await page.screenshot({ path: path.join(output, 'routine-failure.png'), fullPage: true });
  throw error;
} finally { await browser.close(); }
