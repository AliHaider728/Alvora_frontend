const fs = require('fs');
const filePath = 'D:/Alvora/Alvora/src/app/layout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/<head>.*?<\/head>/s, 
  `{GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="lazyOnload"
              src={\`https://www.googletagmanager.com/gtag/js?id=\${GA_MEASUREMENT_ID}\`}
            />
            <Script
              id="google-analytics-config"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: \`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '\${GA_MEASUREMENT_ID}', { send_page_view: true });
                \`,
              }}
            />
          </>
        )}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Removed <head> tag and moved Scripts");
