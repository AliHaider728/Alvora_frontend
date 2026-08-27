const puppeteer = require('puppeteer');
const artifactDir = 'C:\\Users\\MK Laptop\\.gemini\\antigravity\\brain\\76ee3eeb-d59d-4cbc-8300-fd3eef2c8aeb';

(async () => {
  try {
    console.log('Launching puppeteer...');
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 1440, height: 2160 } });
    const page = await browser.newPage();
    
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for hydration and animation
    await new Promise(r => setTimeout(r, 2000)); 
    // Scroll down to trigger framer motion if needed
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => window.scrollTo(0, 0));

    console.log('Taking full page screenshot...');
    await page.screenshot({ path: artifactDir + '\\homepage_fully_fixed.png', fullPage: true });
    
    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error('Puppeteer error:', err);
  }
})();
