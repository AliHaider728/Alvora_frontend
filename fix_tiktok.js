const fs = require('fs');
let code = fs.readFileSync('src/components/analytics/TikTokPixel.tsx', 'utf8');

const oldStr = `  if (!TIKTOK_PIXEL_ID) {
    console.error("[TikTokPixel] NEXT_PUBLIC_TIKTOK_PIXEL_ID is undefined!");
    return null;
  }

  console.log("[TikTokPixel] Initializing with ID:", TIKTOK_PIXEL_ID);`;

const newStr = `  if (!TIKTOK_PIXEL_ID) {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      if (!(window as any).__tiktok_warned) {
        console.warn("[TikTokPixel] NEXT_PUBLIC_ALVORA_TIKTOK_PIXEL_ID is undefined. Pixel loading disabled.");
        (window as any).__tiktok_warned = true;
      }
    }
    return null;
  }`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('src/components/analytics/TikTokPixel.tsx', code);
