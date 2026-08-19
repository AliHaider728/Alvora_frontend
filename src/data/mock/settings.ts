import { StoreSettings } from '../../types';
import { DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_STOREFRONT_NAVIGATION } from '../../config/storeAppearance';

export const MOCK_SETTINGS: StoreSettings = {
  storeName: 'Alvora Skincare',
  tagline: 'Pure Ingredients. Visible Results.',
  email: 'sales@alvora.pk',
  phone: '0310-7172222',
  address: 'Mumtaz Market, Gujranwala',
  currency: 'Rs.',
  metaTitle: 'Alvora Skincare — Pure Ingredients. Visible Results.',
  metaDescription: 'Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin.',
  freeShippingThreshold: 5000,
  standardShippingFee: 0,
  taxRate: 0,
  storefrontNavigation: DEFAULT_STOREFRONT_NAVIGATION.map(i => ({ ...i })),
  homepageSections: DEFAULT_HOMEPAGE_SECTIONS.map(i => ({ ...i })),
  socialLinks: {
    instagram: 'https://instagram.com/alvoraskincare',
    facebook: 'https://facebook.com/alvoraskincare',
    tiktok: 'https://tiktok.com/@alvoraskincare',
  },
};
