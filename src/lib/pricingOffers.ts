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

export interface PricingOffers {
  quantityBreaks?: QuantityBreaks;
  bogo?: Bogo;
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
  if (qb?.enabled && Array.isArray(qb.tiers) && qb.tiers.length > 0) {
    const sortedTiers = [...qb.tiers].sort((a, b) => b.minQty - a.minQty);
    const matchedTier = sortedTiers.find(tier => quantity >= tier.minQty);
    if (matchedTier) {
      unitPrice = matchedTier.pricePerUnit;
      labels.push(matchedTier.label);
    }
  }

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
