export const trackMetaEvent = (
  eventName: string,
  data?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, data);
  }
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
