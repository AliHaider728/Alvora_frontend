/**
 * Formats numeric price into PKR currency string format: "Rs. 2,500"
 */
export const formatPrice = (amount: number, _currency?: string): string => {
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return `Rs. ${numericAmount.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
};

/**
 * Calculates delivery fee for a item or order based on category/product overrides
 */
export const calculateDeliveryFee = (
  baseShippingThreshold: number,
  baseFee: number,
  subtotal: number,
  overrideType?: 'fixed' | 'free' | 'none',
  overrideFee?: number
): { fee: number; label: string; isAvailable: boolean } => {
  if (overrideType === 'none') {
    return { fee: 0, label: 'Delivery not available for this item', isAvailable: false };
  }
  if (overrideType === 'free') {
    return { fee: 0, label: 'Free Delivery', isAvailable: true };
  }
  if (overrideType === 'fixed' && overrideFee !== undefined) {
    return { fee: overrideFee, label: formatPrice(overrideFee), isAvailable: true };
  }
  if (subtotal >= baseShippingThreshold) {
    return { fee: 0, label: 'Free Delivery (Order > Rs. 5000)', isAvailable: true };
  }
  return { fee: baseFee, label: formatPrice(baseFee), isAvailable: true };
};
