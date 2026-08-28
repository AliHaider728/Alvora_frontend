const puppeteer = require('puppeteer');
const artifactDir = 'C:\\Users\\MK Laptop\\.gemini\\antigravity\\brain\\76ee3eeb-d59d-4cbc-8300-fd3eef2c8aeb';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        await page.goto('http://localhost:3000/bundles/build', { waitUntil: 'networkidle2', timeout: 30000 });
        
        // 375px viewport (Mobile)
        await page.setViewport({ width: 375, height: 812 });
        await new Promise(r => setTimeout(r, 2000)); // wait for layout adjustments
        await page.screenshot({ path: artifactDir + '\\bundles_mobile_375.png' });

        await browser.close();
        console.log('Mobile screenshot taken successfully.');
    } catch (err) {
        console.error('Puppeteer error:', err);
    }
})();
