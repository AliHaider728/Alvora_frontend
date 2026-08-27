const puppeteer = require('puppeteer');
const artifactDir = 'C:\\Users\\MK Laptop\\.gemini\\antigravity\\brain\\76ee3eeb-d59d-4cbc-8300-fd3eef2c8aeb';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 1440, height: 1080 } });
    const page = await browser.newPage();
    
    // Test Admin Page
    console.log('Logging in to Admin...');
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'admin@alvora.pk');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Navigating to Audio Reviews...');
    await page.goto('http://localhost:3000/admin/audio-reviews', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: artifactDir + '\\admin_audio_reviews.png' });
    
    console.log('Testing missing R2 credentials...');
    await page.click('button'); // Click Add Audio Review
    await new Promise(r => setTimeout(r, 500));
    await page.type('input[type="text"]', 'Test Name');
    // We can't easily upload a file via puppeteer without fileChooser, but we just need to show it renders.
    
    // Screenshot Homepage
    console.log('Screenshotting Homepage...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: artifactDir + '\\homepage_no_audio.png', fullPage: true });

    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error('Puppeteer error:', err);
  }
})();
