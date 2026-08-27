const puppeteer = require('puppeteer');
const artifactDir = 'C:\\Users\\MK Laptop\\.gemini\\antigravity\\brain\\76ee3eeb-d59d-4cbc-8300-fd3eef2c8aeb';

(async () => {
  try {
    console.log('Launching puppeteer...');
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 1440, height: 1080 } });
    const page = await browser.newPage();
    
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    await new Promise(r => setTimeout(r, 4000)); 

    console.log('Taking screenshot...');
    await page.screenshot({ path: artifactDir + '\\homepage_hero_arch.png' });
    
    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error('Puppeteer error:', err);
  }
})();
