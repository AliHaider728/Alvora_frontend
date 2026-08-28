const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        // 1. Check title
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
        const title = await page.title();
        console.log('Homepage Title:', title);

        // 2. Check bundles images
        let brokenImages = 0;
        page.on('response', response => {
            if (response.request().resourceType() === 'image' && !response.ok()) {
                console.log('Broken image:', response.url());
                brokenImages++;
            }
        });
        await page.goto('http://localhost:3000/bundles/build', { waitUntil: 'networkidle2' });
        console.log('Broken images on Bundles page:', brokenImages);

        // 3. /account text (needs login, but we can check if it redirects or has text, actually account is protected but maybe we can grep the compiled output instead? We already grepped earlier, let's just use evaluate if possible. Actually, to access /account we need to be logged in. It's easier to verify via code.)
        
        // 4. /product/invalid
        await page.goto('http://localhost:3000/product/invalid-product-slug-test', { waitUntil: 'networkidle2' });
        const notFoundText = await page.evaluate(() => document.body.innerText);
        console.log('/product/[slug] has "Product Not Found":', notFoundText.includes('Product Not Found'));
        console.log('/product/[slug] has "Toy Not Found":', notFoundText.includes('Toy Not Found'));

        // 5. /contact
        await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2' });
        const contactText = await page.evaluate(() => document.body.innerText);
        const contactHtml = await page.evaluate(() => document.body.innerHTML);
        console.log('/contact has "Product Question":', contactHtml.includes('Product Question'));
        console.log('/contact has "Toy Suggestion":', contactHtml.includes('Toy Suggestion'));

        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
