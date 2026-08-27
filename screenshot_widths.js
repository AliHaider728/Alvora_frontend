const puppeteer = require('puppeteer');
const artifactDir = 'C:\\Users\\MK Laptop\\.gemini\\antigravity\\brain\\76ee3eeb-d59d-4cbc-8300-fd3eef2c8aeb';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    
    // 1280px
    await page.setViewport({ width: 1280, height: 800 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: artifactDir + '\\hero_1280.png' });
    
    // 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: artifactDir + '\\hero_1440.png' });

    // 1920px
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: artifactDir + '\\hero_1920.png' });

    await browser.close();
    console.log('Screenshots taken successfully.');
  } catch (err) {
    console.error('Puppeteer error:', err);
  }
})();
