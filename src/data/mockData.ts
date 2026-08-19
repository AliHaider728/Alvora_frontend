import { Category, AgeGroupOption, Product, Review, Order, Customer, Coupon, StoreSettings } from '../types';
import { DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_STOREFRONT_NAVIGATION } from '../config/storeAppearance';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "Alvora Skincare",
  tagline: "Premium Skincare",
  email: "sales@alvora.pk",
  phone: "",
  address: "",
  currency: "Rs.",
  metaTitle: "Alvora Skincare",
  metaDescription: "Discover premium skincare and beauty products.",
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  taxRate: 0,
  storefrontNavigation: DEFAULT_STOREFRONT_NAVIGATION.map(item => ({ ...item })),
  homepageSections: DEFAULT_HOMEPAGE_SECTIONS.map(item => ({ ...item })),
  socialLinks: {}
};

// AgeGroups are preserved technically to avoid breaking old TypeScript definitions.
// However, the actual usage for Alvora may vary and shouldn't display toys.
export const AGE_GROUPS: AgeGroupOption[] = [
  { id: '0-2', name: '0-2', label: '0-2', range: '0-2', color: '', icon: '' },
  { id: '3-5', name: '3-5', label: '3-5', range: '3-5', color: '', icon: '' },
  { id: '6-8', name: '6-8', label: '6-8', range: '6-8', color: '', icon: '' },
  { id: '9-12', name: '9-12', label: '9-12', range: '9-12', color: '', icon: '' },
  { id: '13+', name: '13+', label: '13+', range: '13+', color: '', icon: '' },
];

export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_REVIEWS: Review[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_COUPONS: Coupon[] = [];
