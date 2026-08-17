export interface QuantityBreakTier {
  minQty: number;
  pricePerUnit: number;
  label: string;
  badge: string;
}

export interface QuantityBreaks {
  enabled: boolean;
  tiers: QuantityBreakTier[];
}

export interface Bogo {
  enabled: boolean;
  buyQty: number;
  getQty: number;
  label: string;
}

export interface FlatDiscount {
  enabled: boolean;
  minQty: number;
  discountType: "fixed" | "percentage";
  discountValue: number;
  label: string;
}

export interface PricingOffers {
  quantityBreaks?: QuantityBreaks;
  bogo?: Bogo;
  flatDiscount?: FlatDiscount;
}

export interface CartLineResult {
  unitPrice: number;
  freeUnits: number;
  totalPrice: number;
  appliedLabel: string;
}

export const resolveCartLine = (
  pricingOffers: PricingOffers | undefined | null,
  baseUnitPrice: number,
  quantity: number
): CartLineResult => {
  let unitPrice = baseUnitPrice;
  let freeUnits = 0;
  const labels: string[] = [];

  const qb = pricingOffers?.quantityBreaks;
  let qbMatched = false;

  if (qb?.enabled && Array.isArray(qb.tiers) && qb.tiers.length > 0) {
    const sortedTiers = [...qb.tiers].sort((a, b) => b.minQty - a.minQty);
    const lowestTier = sortedTiers[sortedTiers.length - 1];
    const tier1Price = (lowestTier && lowestTier.minQty === 1) ? lowestTier.pricePerUnit : baseUnitPrice;
    
    const matchedTier = sortedTiers.find(tier => quantity >= tier.minQty);
    if (matchedTier) {
      qbMatched = true;
      unitPrice = matchedTier.pricePerUnit;
      
      const savePct = matchedTier.pricePerUnit < tier1Price ? 1 : 0;
      const savedAmount = (tier1Price - matchedTier.pricePerUnit) * matchedTier.minQty;
      
      const autoLabel = savePct > 0 
        ? `Buy ${matchedTier.minQty}, Save Rs. ${savedAmount}` 
        : `Buy ${matchedTier.minQty}`;
        
      labels.push(matchedTier.label || autoLabel);
    }
  }
  
  if (!qbMatched) {
    // 2. Flat Discount logic (only applies if Quantity Breaks didn't match a tier)
    const flat = pricingOffers?.flatDiscount;
    if (flat?.enabled && quantity >= flat.minQty) {
      if (flat.discountType === 'percentage') {
        const discountAmount = baseUnitPrice * (flat.discountValue / 100);
        unitPrice = Math.max(0, baseUnitPrice - discountAmount);
      } else {
        unitPrice = Math.max(0, baseUnitPrice - flat.discountValue);
      }

      const flatSavedAmount = baseUnitPrice - unitPrice;
      const flatAutoLabel = flat.discountType === 'percentage'
        ? `Buy ${flat.minQty}+, Save ${flat.discountValue}%/unit`
        : `Buy ${flat.minQty}+, Save Rs. ${flatSavedAmount}/unit`;

      if (flatSavedAmount > 0) {
        labels.push(flat.label || flatAutoLabel);
      }
    }
  }

  // 3. BOGO logic (applies independently on top)
  const bogo = pricingOffers?.bogo;
  if (bogo?.enabled && bogo.buyQty >= 1 && bogo.getQty >= 1) {
    freeUnits = Math.floor(quantity / bogo.buyQty) * bogo.getQty;
    if (freeUnits > 0) {
      const bogoLabel = bogo.label || `Buy ${bogo.buyQty} Get ${bogo.getQty} Free`;
      labels.push(
        freeUnits === 1
          ? `${bogoLabel} (1 free unit applied)`
          : `${bogoLabel} (${freeUnits} free units applied)`
      );
    }
  }

  return {
    unitPrice,
    freeUnits,
    totalPrice: unitPrice * quantity,
    appliedLabel: labels.join(' | ')
  };
};
