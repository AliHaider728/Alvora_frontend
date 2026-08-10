export const trackMetaEvent = (
  eventName: string,
  data?: Record<string, unknown>
) => {
  if (
    typeof window === "undefined" ||
    typeof window.fbq !== "function"
  ) {
    return false;
  }
  window.fbq("track", eventName, data);
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
  trackMetaEvent("AddToCart", {
    content_ids: [id],
    content_name: name,
    content_type: "product",
    value: price * quantity,
    currency,
    num_items: quantity,
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
