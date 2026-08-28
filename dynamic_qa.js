const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        const errors = [];
        const brokenImages = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        page.on('response', response => {
            if (response.request().resourceType() === 'image' && !response.ok()) {
                brokenImages.push(response.url());
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

        console.log('Starting dynamic crawl...');

        for (const url of urls) {
            console.log(`Visiting: ${url}`);
            try {
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
                // Check if any error strings exist on page text
                const text = await page.evaluate(() => document.body.innerText);
                if (text.includes('Application error') || text.includes('React error')) {
                    errors.push(`React Error on ${url}`);
                }
            } catch (err) {
                console.log(`Skipped ${url} - timeout or error`);
            }
        }

        console.log('\n--- CONSOLE ERRORS ---');
        console.log(errors.length ? errors.join('\n') : 'None');

        console.log('\n--- BROKEN IMAGES ---');
        console.log(brokenImages.length ? brokenImages.join('\n') : 'None');

        await browser.close();
    } catch (e) {
        console.error('Puppeteer crash', e);
    }
})();
