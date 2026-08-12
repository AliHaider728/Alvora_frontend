"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="lazyOnload">
        {`
          fbq('init', '${PIXEL_ID}');
        `}
      </Script>
      <Script 
        strategy="lazyOnload" 
        src="https://connect.facebook.net/en_US/fbevents.js" 
      />
    </>
  );
}