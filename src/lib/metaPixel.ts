import { event as trackGAEvent } from "./gtag";

export const trackMetaEvent = (
  eventName: string,
  data?: Record<string, unknown>,
  options?: { eventID?: string }
) => {
  if (
    typeof window === "undefined" ||
    typeof window.fbq !== "function"
  ) {
    return false;
  }
  if (options?.eventID) {
    window.fbq("track", eventName, data, { eventID: options.eventID });
  } else {
    window.fbq("track", eventName, data);
  }
  return true;
};

export const trackAddToCart = ({
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
  // Meta Pixel
  trackMetaEvent("AddToCart", {
    content_ids: [id],
    content_name: name,
    content_type: "product",
    value: price * quantity,
    currency,
    num_items: quantity,
  });

  // GA4
  trackGAEvent({
    action: "add_to_cart",
    currency: currency,
    value: price * quantity,
    items: [
      {
        item_id: id,
        item_name: name,
        price: price,
        quantity: quantity,
      }
    ]
  });
};

export const trackInitiateCheckout = ({
  items,
  value,
  currency = "PKR",
}: {
  items: Array<{
    id: string;
    quantity: number;
  }>;
  value: number;
  currency?: string;
}) => {
  if (typeof window === "undefined") return;
  const cartSignature = items
    .map((item) => `${item.id}:${item.quantity}`)
    .sort()
    .join("|");
  const signature = `${cartSignature}:${value}:${currency}`;
  const storageKey = "meta_last_initiate_checkout";
  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) {
      const parsed = JSON.parse(existing) as {
        signature: string;
        timestamp: number;
      };
      const isSameCheckout = parsed.signature === signature;
      const isRecent = Date.now() - parsed.timestamp < 10000;
      if (isSameCheckout && isRecent) {
        return;
      }
    }
  } catch {
    // Tracking should never break checkout.
  }
  const tracked = trackMetaEvent("InitiateCheckout", {
    content_ids: items.map((item) => item.id),
    contents: items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
    content_type: "product",
    num_items: items.reduce(
      (total, item) => total + item.quantity,
      0
    ),
    value,
    currency,
  });

  trackGAEvent({
    action: "begin_checkout",
    currency: currency,
    value: value,
    items: items.map(item => ({
      item_id: item.id,
      quantity: item.quantity
    }))
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
      // Ignore storage errors.
    }
  }
};

export interface MetaPurchaseItem {
  productId: string;
  name?: string;
  quantity?: number;
  price?: number;
}

export interface TrackPurchaseParams {
  orderId: string;
  value: number;
  currency?: string;
  items?: MetaPurchaseItem[];
  eventId?: string;
}

/**
 * Tracks a validated Meta Pixel Purchase event with deduplication & data sanitization.
 *
 * Rules enforced:
 * - value must be a valid finite number > 0 (never NaN, null, undefined, 0, or negative)
 * - value is rounded to 2 decimal places
 * - currency defaults to PKR
 * - deduplication per orderId prevents duplicate fires on page refresh/revisit
 * - eventID is sent for exact deduplication with Meta Conversions API (CAPI)
 */
export const trackPurchase = ({
  orderId,
  value,
  currency = "PKR",
  items = [],
  eventId,
}: TrackPurchaseParams): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  // 1. Strict numeric validation
  const numericValue = typeof value === "number" ? value : parseFloat(String(value));
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    console.error("[Meta Pixel] Purchase tracking aborted: invalid numeric value:", value);
    return false;
  }

  const roundedValue = Math.round(numericValue * 100) / 100;
  const canonicalOrderId = String(orderId || "").trim();
  const finalEventId = eventId || (canonicalOrderId ? `purchase_${canonicalOrderId}` : undefined);

  // 2. Browser deduplication guard: never fire twice for the same order in the browser session
  if (canonicalOrderId) {
    const storageKey = `meta_tracked_purchase_${canonicalOrderId}`;
    try {
      if (sessionStorage.getItem(storageKey)) {
        console.warn(`[Meta Pixel] Purchase for order "${canonicalOrderId}" was already tracked. Skipping duplicate.`);
        return false;
      }
    } catch {
      // Storage access could be restricted in private mode; proceed safely
    }
  }

  if (typeof window.fbq !== "function") {
    console.warn("[Meta Pixel] window.fbq function is not available.");
    return false;
  }

  // 3. Prepare item contents
  const validItems = Array.isArray(items) ? items : [];
  const contentIds = validItems.map((item) => String(item.productId)).filter(Boolean);
  const contents = validItems.map((item) => ({
    id: String(item.productId),
    quantity: Math.max(1, Number(item.quantity) || 1),
    item_price: Math.max(0, Math.round((Number(item.price) || 0) * 100) / 100),
  }));
  const numItems = validItems.reduce(
    (total, item) => total + Math.max(1, Number(item.quantity) || 1),
    0
  );

  const payload: Record<string, unknown> = {
    content_type: "product",
    value: roundedValue,
    currency: (currency || "PKR").toUpperCase(),
    num_items: numItems > 0 ? numItems : 1,
  };

  if (contentIds.length > 0) {
    payload.content_ids = contentIds;
  }
  if (contents.length > 0) {
    payload.contents = contents;
  }

  try {
    if (finalEventId) {
      window.fbq("track", "Purchase", payload, { eventID: finalEventId });
    } else {
      window.fbq("track", "Purchase", payload);
    }

    if (canonicalOrderId) {
      try {
        sessionStorage.setItem(`meta_tracked_purchase_${canonicalOrderId}`, String(Date.now()));
      } catch {}
    }
    return true;
  } catch (err) {
    console.error("[Meta Pixel] Purchase tracking error:", err);
    return false;
  }
};
