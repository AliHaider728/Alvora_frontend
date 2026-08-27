import { MOCK_PRODUCTS } from './products';

export const MOCK_BUNDLES = [
  {
    id: 'bundle-glow',
    name: 'Glow Starter Kit',
    slug: 'glow-starter-kit',
    description: 'Everything you need for a radiant, glowing complexion. A perfect introduction to our brightening essentials.',
    image: '/images/products/radiance-serum.jpg',
    discountPercent: 15,
    isActive: true,
    displayOrder: 0,
    originalTotalPrice: 110,
    currentPrice: 93.5,
    products: MOCK_PRODUCTS.filter(p => ['prod-radiance-serum', 'prod-gentle-face-wash'].includes(p.id)).map(p => ({...p, bundle_quantity: 1}))
  },
  {
    id: 'bundle-hydration',
    name: 'Deep Hydration Duo',
    slug: 'deep-hydration-duo',
    description: 'Quench thirsty skin with our most powerful hydrating formulas designed to lock in moisture for 24 hours.',
    image: '/images/products/restore-moisture-cream.jpg',
    discountPercent: 20,
    isActive: true,
    displayOrder: 1,
    originalTotalPrice: 130,
    currentPrice: 104,
    products: MOCK_PRODUCTS.filter(p => ['prod-hydra-gel-cream', 'prod-nourishing-essence'].includes(p.id)).map(p => ({...p, bundle_quantity: 1}))
  }
];
