"use client";

// Generates a UUID for event_id deduplication (fallback to random if crypto not available)
const generateEventId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return 'ttq-' + Date.now() + '-' + Math.floor(Math.random() * 1000000000);
};

export const trackTikTokEvent = (eventName: string, data?: Record<string, unknown>, providedEventId?: string) => {
  if (typeof window === "undefined") {
    return false;
  }
  
  const eventId = providedEventId || generateEventId();

  const payload = {
    ...data,
    event_id: eventId
  };

  if (window.ttq) {
    try {
      window.ttq.track(eventName, payload);
    } catch (e) {
      console.error("[TikTokPixel] Error calling ttq.track:", e);
    }
  } else {
    console.warn("[TikTokPixel] window.ttq is not defined, skipping client tracking for", eventName);
  }

  // Forward to internal API for server-side TikTok Events API
  fetch('/api/tiktok-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_data: payload
    })
  }).catch(() => {
    // silently fail tracking errors
  });

  return true;
};

export const trackTikTokViewContent = ({
  id,
  name,
  price,
  currency = "PKR",
}: {
  id: string;
  name: string;
  price: number;
  currency?: string;
}) => {
  trackTikTokEvent("ViewContent", {
    content_id: id,
    content_name: name,
    content_type: "product",
    value: price,
    currency,
  });
};

export const trackTikTokSearch = ({ query }: { query: string }) => {
  trackTikTokEvent("Search", {
    query,
  });
};

export const trackTikTokAddToWishlist = ({
  id,
  name,
  price,
  currency = "PKR",
}: {
  id: string;
  name: string;
  price: number;
  currency?: string;
}) => {
  trackTikTokEvent("AddToWishlist", {
    content_id: id,
    content_name: name,
    content_type: "product",
    value: price,
    currency,
  });
};

export const trackTikTokAddToCart = ({
  id,
  name,
  price,
  quantity = 1,
  currency = "PKR",
}: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  currency?: string;
}) => {
  trackTikTokEvent("AddToCart", {
    content_id: id,
    content_name: name,
    content_type: "product",
    value: price * quantity,
    quantity,
    currency,
  });
};

export const trackTikTokInitiateCheckout = ({
  items,
  value,
  currency = "PKR",
}: {
  items: Array<{ id: string; quantity: number }>;
  value: number;
  currency?: string;
}) => {
  if (typeof window === "undefined") return;
  
  // Dedup logic (similar to Meta pixel) to avoid firing multiple times on same checkout session
  const cartSignature = items.map((item) => `${item.id}:${item.quantity}`).sort().join("|");
  const signature = `${cartSignature}:${value}:${currency}`;
  const storageKey = "tiktok_last_initiate_checkout";
  
  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) {
      const parsed = JSON.parse(existing);
      const isSameCheckout = parsed.signature === signature;
      const isRecent = Date.now() - parsed.timestamp < 10000;
      if (isSameCheckout && isRecent) {
        return;
      }
    }
  } catch {
    // Ignore
  }

  const tracked = trackTikTokEvent("InitiateCheckout", {
    content_id: items.map((item) => item.id).join(","), // TikTok sometimes expects a single string or array, passing comma-separated is safe
    content_type: "product",
    quantity: items.reduce((total, item) => total + item.quantity, 0),
    value,
    currency,
  });

  if (tracked) {
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          signature,
          timestamp: Date.now(),
        })
      );
    } catch {
      // Ignore
    }
  }
};

export const trackTikTokAddPaymentInfo = () => {
  trackTikTokEvent("AddPaymentInfo", {});
};

export const trackTikTokPlaceAnOrder = ({
  items,
  value,
  currency = "PKR",
  eventId
}: {
  items: Array<{ id: string; quantity: number }>;
  value: number;
  currency?: string;
  eventId: string;
}) => {
  trackTikTokEvent("PlaceAnOrder", {
    content_id: items.map((item) => item.id).join(","),
    content_type: "product",
    quantity: items.reduce((total, item) => total + item.quantity, 0),
    value,
    currency,
  }, eventId);
};

export const trackTikTokPurchase = ({
  items,
  value,
  currency = "PKR",
  eventId
}: {
  items: Array<{ id: string; quantity: number }>;
  value: number;
  currency?: string;
  eventId: string;
}) => {
  trackTikTokEvent("Purchase", {
    content_id: items.map((item) => item.id).join(","),
    content_type: "product",
    quantity: items.reduce((total, item) => total + item.quantity, 0),
    value,
    currency,
  }, eventId);
};

export const trackTikTokCompleteRegistration = () => {
  trackTikTokEvent("CompleteRegistration", {});
};
