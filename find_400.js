const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        page.on('response', response => {
            if (response.status() === 400) {
                console.log('400 Bad Request URL:', response.url());
            }
        });

        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
