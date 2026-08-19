import { Review } from '../../types';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-001',
    productId: 'prod-radiance-serum',
    reviewerName: 'Ayesha K.',
    title: 'Skin is literally glowing!',
    content:
      'I have been using the Radiance Serum for three weeks now and the difference is incredible. My dark spots have faded and my skin feels so hydrated. Will never go back to my old serum.',
    rating: 5,
    verifiedPurchase: true,
    source: 'customer',
    status: 'approved',
    createdAt: '2026-07-10T10:00:00.000Z',
  },
  {
    id: 'review-002',
    productId: 'prod-hydra-gel-cream',
    reviewerName: 'Saba M.',
    title: 'Perfect for sensitive skin',
    content:
      'My skin is extremely sensitive and this gel cream is the only one that has never caused a breakout. It feels lightweight but keeps me moisturized all day long. Absolutely love it.',
    rating: 5,
    verifiedPurchase: true,
    source: 'customer',
    status: 'approved',
    createdAt: '2026-07-22T14:30:00.000Z',
  },
  {
    id: 'review-003',
    productId: 'prod-daily-spf50',
    reviewerName: 'Hina R.',
    title: 'Finally, no white cast!',
    content:
      'I have tried so many sunscreens and they always leave that awful white cast. Daily Defense SPF 50 goes on clear, feels lightweight and keeps my skin protected. This is my holy grail.',
    rating: 5,
    verifiedPurchase: true,
    source: 'customer',
    status: 'approved',
    createdAt: '2026-08-01T09:15:00.000Z',
  },
];
