import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createServer } from 'node:http';
import puppeteer from 'puppeteer';

// Uses the real component and current public reviews without changing production data.
const reviews = await (await fetch('https://alvora-backend.vercel.app/api/audio-reviews')).json();
assert.ok(reviews.length >= 2, 'At least two published reviews are required');
const { outputFiles } = await build({
  stdin: { contents: `import React from 'react';import{createRoot}from'react-dom/client';import{AudioReviews}from'./src/components/home/AudioReviews';import Admin from './src/app/admin/(authenticated)/audio-reviews/AdminAudioReviewsPageClient';createRoot(document.getElementById('root')).render(location.pathname==='/admin'?<Admin/>:<AudioReviews/>);`, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, define: { 'process.env.NODE_ENV': '"production"', 'process.env.NEXT_PUBLIC_ALVORA_USE_MOCK_DATA': '"false"' },
});
const server = createServer((req, res) => {
  if (req.url === '/missing.ogg') { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', req.url === '/app.js' ? 'application/javascript' : 'text/html');
  res.end(req.url === '/app.js' ? outputFiles[0].text : '<div id="root"></div><script src="/app.js"></script>');
});
await new Promise(resolve => server.listen(3111, '127.0.0.1', resolve));
const browser = await puppeteer.launch({ executablePath: process.env.AUDIO_BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, ignoreDefaultArgs: ['--mute-audio'] });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => { if (msg.type() === 'error') { errors.push(msg.text()); console.log('browser error',msg.text()); } });
  let data = reviews;
  await page.setRequestInterception(true);
  page.on('request', req => (req.url().endsWith('/audio-reviews') || req.url().endsWith('/audio-reviews/admin')) ? req.respond({ headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization', 'Access-Control-Allow-Methods': 'GET, OPTIONS' }, contentType: 'application/json', body: JSON.stringify(data) }) : req.continue());
  const load = async () => {
    await page.goto('http://127.0.0.1:3111');
    await page.waitForSelector('.player-pill');
    await page.addStyleTag({ content: '* {animation:none!important} button {width:40px;height:40px} svg {width:20px;height:20px}' });
  };
  const click = async (index = 0) => {
    const point = await page.evaluate(i => {
      const el = document.querySelectorAll('.player-pill')[i].querySelector('button');
      el.scrollIntoView(); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, index);
    await page.mouse.click(point.x, point.y);
  };
  await load();
  for (let i = 0; i < reviews.length; i++) {
    const response = await fetch(reviews[i].audioUrl);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status, 200);
    const signal = await page.evaluate(async encoded => {
      const context = new AudioContext();
      const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
      const decoded = await context.decodeAudioData(bytes.buffer);
      let peak = 0, sum = 0;
      for (let c = 0; c < decoded.numberOfChannels; c++) for (const sample of decoded.getChannelData(c)) { peak = Math.max(peak, Math.abs(sample)); sum += sample * sample; }
      await context.close();
      return { peak, rms: Math.sqrt(sum / (decoded.length * decoded.numberOfChannels)) };
    }, bytes.toString('base64'));
    assert.ok(signal.rms > 0.001, 'Recording must contain non-silent decoded audio');
    await click(i);
    await page.waitForFunction(url => {
      const audio = document.querySelector('audio');
      return audio.currentSrc === url && audio.currentTime > 1 && document.querySelector('[aria-pressed="true"]');
    }, { timeout: 30000 }, reviews[i].audioUrl);
    const state = await page.evaluate(() => {
      const a = document.querySelector('audio'); return { muted: a.muted, volume: a.volume, duration: a.duration, error: a.error };
    });
    assert.equal(state.muted, false); assert.equal(state.volume, 1); assert.equal(state.error, null);
    console.log('PASS real review', JSON.stringify({ url: reviews[i].audioUrl, mime: response.headers.get('content-type'), codec: bytes.includes(Buffer.from('OpusHead')) ? 'Opus' : 'other', ...state, ...signal }));
  }
  assert.deepEqual(errors, [], 'No console or runtime errors during real playback');
  await click(reviews.length - 1);
  assert.equal(await page.$('[aria-pressed="true"]'), null);
  const pausedTime = await page.$eval('audio', a => a.currentTime);
  await click(reviews.length - 1);
  await page.waitForFunction(t => document.querySelector('audio').currentTime > t + 0.2, {}, pausedTime);
  console.log('PASS pause/resume preserves position');
  await load();
  await page.evaluate(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Test policy denial', 'NotAllowedError')); });
  await click(); await page.waitForSelector('[role="alert"]');
  assert.match(await page.$eval('[role="alert"]', e => e.textContent), /blocked audio/);
  assert.equal(await page.$('[aria-pressed="true"]'), null);
  console.log('PASS autoplay denial shows error without playing state');
  data = [{ ...reviews[0], audioUrl: 'http://127.0.0.1:3111/missing.ogg' }];
  await load(); await click(); await page.waitForSelector('[role="alert"]');
  assert.equal(await page.$('.animate-audio-bar'), null);
  console.log('PASS 404 stops waveform and shows error');
  data = reviews; await load(); await click();
  await page.waitForSelector('[aria-pressed="true"]');
  await page.evaluate(() => { const a = document.querySelector('audio'); Object.defineProperty(a, 'error', { configurable: true, value: { code: 2, message: 'Test late network failure' } }); a.dispatchEvent(new Event('error')); });
  await page.waitForSelector('[role="alert"]');
  assert.equal(await page.$('[aria-pressed="true"]'), null);
  assert.equal(await page.$eval('audio', a => a.paused), true);
  console.log('PASS media error after playback resets state');
  const errorCount = errors.length;
  await page.goto('http://127.0.0.1:3111/admin');
  await page.waitForSelector('button[aria-pressed]');
  for (let i = 0; i < 2; i++) {
    const buttons = await page.$$('button[aria-pressed]'); await buttons[i].click();
    await page.waitForFunction(url => document.querySelector('audio').currentSrc === url && document.querySelector('audio').currentTime > 0.5 && document.querySelector('[aria-pressed="true"]'), {}, reviews[i].audioUrl);
  }
  assert.equal(errors.length, errorCount);
  console.log('PASS two real reviews in admin preview without playback errors');
  console.log('Expected failure-case console messages:', JSON.stringify(errors));
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }


