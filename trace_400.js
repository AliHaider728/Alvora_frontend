const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        page.on('response', async response => {
            if (response.status() === 400) {
                console.log('400 Error on URL:', response.url());
                console.log('Method:', response.request().method());
                console.log('Headers:', response.request().headers());
                if (response.request().postData()) {
                    console.log('Post Data:', response.request().postData());
                }
                try {
                    const text = await response.text();
                    console.log('Response Body:', text);
                } catch(e) {}
            }
        });

        const urls = [
            'http://localhost:3000/',
            'http://localhost:3000/category/all',
            'http://localhost:3000/product/gentle-glow-face-wash',
            'http://localhost:3000/about',
            'http://localhost:3000/bundles/build',
            'http://localhost:3000/cart',
            'http://localhost:3000/contact',
            'http://localhost:3000/admin/login'
        ];

        for (const url of urls) {
            console.log('Visiting:', url);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
        }
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
