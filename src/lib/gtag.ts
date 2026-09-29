export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_ALVORA_GA_MEASUREMENT_ID || "G-6RSTKDWVQD";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value, ...rest }: { action: string; category?: string; label?: string; value?: number; [key: string]: any }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest
    });
  }
};


declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
