"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { pageview, GA_TRACKING_ID } from "../../lib/gtag";

function AnalyticsEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && GA_TRACKING_ID) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalyticsEvents() {
  if (!GA_TRACKING_ID) return null;

  return (
    <Suspense fallback={null}>
      <AnalyticsEvents />
    </Suspense>
  );
}
