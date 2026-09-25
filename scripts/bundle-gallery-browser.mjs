import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const base = 'http://127.0.0.1:3108';
const api = 'http://127.0.0.1:5108';
const output = process.env.GALLERY_QA_OUTPUT || path.resolve('qa-gallery');
mkdirSync(output, { recursive: true });
const { token } = await fetch(`${api}/fixture-token`).then(r => r.json());
const browser = await puppeteer.launch({ headless: true, ...(process.env.GALLERY_BROWSER_PATH ? { executablePath: process.env.GALLERY_BROWSER_PATH } : {}) });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.setViewport({ width: 1440, height: 1000 });
await page.evaluateOnNewDocument(token => {
  localStorage.setItem('pb_admin_token', token);
  localStorage.setItem('alvora_admin_user', JSON.stringify({ role: 'admin', name: 'Gallery QA' }));
}, token);
await page.setRequestInterception(true);
page.on('request', request => /facebook|tiktok|googletagmanager/.test(request.url()) ? request.abort() : request.continue());
const bundle = async slug => fetch(`${api}/api/bundles/${slug}`).then(r => r.json());
const edit = async () => {
  await page.goto(`${base}/admin/bundles/edit/glow`, { waitUntil: 'networkidle2', timeout: 120000 });
  await page.waitForSelector('input[aria-label="Add bundle gallery images"]');
};
const save = async () => {
  const response = page.waitForResponse(response => response.url().endsWith('/api/bundles/glow') && response.request().method() === 'PUT');
  await page.$$eval('button', buttons => {
    const button = buttons.find(b => /Save Changes|Update Bundle|Save Bundle/.test(b.textContent));
    if (!button) throw new Error('Save bundle button not found');
    button.click();
  });
  assert.equal((await response).status(), 200);
};
const checkGallery = async (slug, expected) => {
  await page.goto(`${base}/bundles/${slug}`, { waitUntil: 'networkidle2', timeout: 120000 });
  await page.waitForSelector('[data-testid="bundle-gallery"]');
  const images = await page.$$eval('[aria-label="Bundle gallery thumbnails"] img', nodes => nodes.map(img => new URL(img.src).searchParams.get('url') || img.getAttribute('src')));
  assert.deepEqual(images, expected);
  for (let index = 0; index < expected.length; index++) {
    await page.$$eval('[aria-label="Bundle gallery thumbnails"] button', (buttons, i) => buttons[i].click(), index);
    await page.waitForFunction(expected => {
      const img = document.querySelector('[data-testid="bundle-gallery"] img[alt="The Glow Bundle"]');
      return img && (new URL(img.src).searchParams.get('url') || img.getAttribute('src')) === expected && img.complete && img.naturalWidth > 0;
    }, { timeout: 30000 }, expected[index]);
  }
};
try {
  console.log('Opening bundle admin…');
  await edit();
  const files = ['public/images/bundle-glow.jpg', 'public/images/animation/prod-1.png', 'public/images/animation/prod-2.png'].map(file => path.resolve(file));
  await (await page.$('input[aria-label="Add bundle gallery images"]')).uploadFile(...files);
  await page.waitForFunction(() => document.querySelectorAll('[data-gallery-index]').length === 3 && !document.body.textContent.includes('Uploading gallery images…'), { timeout: 30000 });
  const uploaded = await page.$$eval('[data-gallery-index] img', nodes => nodes.map(img => img.src));
  for (let i = 0; i < files.length; i++) {
    const actual = Buffer.from(await (await fetch(uploaded[i])).arrayBuffer());
    assert.equal(createHash('sha256').update(actual).digest('hex'), createHash('sha256').update(readFileSync(files[i])).digest('hex'));
  }
  await page.click('button[aria-label="Move gallery image 3 left"]');
  const ordered = [uploaded[0], uploaded[2], uploaded[1]];
  await page.screenshot({ path: path.join(output, 'bundle-gallery-admin.png'), fullPage: true });
  await save();
  assert.deepEqual((await bundle('the-glow-bundle')).galleryImages, ordered);
  assert.deepEqual((await bundle('the-hydration-bundle')).galleryImages, []);
  console.log('PASS: three actual multipart uploads, exact file bytes, reorder, save, and bundle independence');
  await edit();
  assert.deepEqual(await page.$$eval('[data-gallery-index] img', nodes => nodes.map(img => img.src)), ordered);
  await checkGallery('the-glow-bundle', ['/images/bundle-glow.jpg', ...ordered]);
  await page.screenshot({ path: path.join(output, 'bundle-gallery-desktop.png'), fullPage: true });
  await page.setViewport({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(output, 'bundle-gallery-mobile.png'), fullPage: true });
  await page.setViewport({ width: 1440, height: 1000 });
  console.log('PASS: admin reload and storefront show only thumbnail + saved gallery, every thumbnail swaps the main image');
  await checkGallery('the-hydration-bundle', []);
  assert.equal(await page.$eval('[data-testid="bundle-gallery"] img', img => new URL(img.src).searchParams.get('url')), '/images/bundle-hydration.jpg');
  await edit();
  await (await page.$('input[aria-label="Replace gallery image 2"]')).uploadFile(path.resolve('public/images/bundle-complete.jpg'));
  await page.waitForFunction(previous => document.querySelector('[data-gallery-index="1"] img')?.src !== previous && !document.body.textContent.includes('Uploading gallery images…'), {}, ordered[1]);
  await page.click('button[aria-label="Remove gallery image 1"]');
  const remaining = await page.$$eval('[data-gallery-index] img', nodes => nodes.map(img => img.src));
  await save();
  await checkGallery('the-glow-bundle', ['/images/bundle-glow.jpg', ...remaining]);
  await edit();
  while (await page.$('button[aria-label="Remove gallery image 1"]')) await page.click('button[aria-label="Remove gallery image 1"]');
  await save();
  await checkGallery('the-glow-bundle', []);
  console.log('PASS: replace, delete and clear persist; empty gallery shows only the bundle thumbnail');
  assert.deepEqual(errors, []);
  console.log(`PASS: no browser runtime errors. Screenshots: ${output}`);
} catch (error) {
  console.error('Browser diagnostics:', error.message, errors, await page.evaluate(() => document.body?.innerText.slice(0, 1400)).catch(() => 'page unavailable'));
  await page.screenshot({ path: path.join(output, 'bundle-gallery-failure.png'), fullPage: true }).catch(() => {});
  throw error;
} finally { await browser.close(); }
