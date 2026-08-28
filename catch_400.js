const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        page.on('response', async response => {
            if (response.status() === 400) {
                console.log('400 Error on URL:', response.url());
                console.log('Method:', response.request().method());
                try {
                    const text = await response.text();
                    console.log('Response Body:', text);
                } catch(e) {
                    console.log('Could not get response body');
                }
            }
        });

        await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
