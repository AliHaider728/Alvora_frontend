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
// However, the actual usage for Alvora may vary and shouldn't display products.
export const AGE_GROUPS: AgeGroupOption[] = [
  { id: '0-2', name: 'Sensitive Skin', label: 'Sensitive', range: '0-2', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'Shield' },
  { id: '3-5', name: 'Dry Skin', label: 'Dry', range: '3-5', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'Droplet' },
  { id: '6-8', name: 'Oily Skin', label: 'Oily', range: '6-8', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: 'Droplets' },
  { id: '9-12', name: 'Combination', label: 'Combo', range: '9-12', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: 'Blend' },
  { id: '13+', name: 'Normal Skin', label: 'Normal', range: '13+', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'Leaf' },
];

export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_REVIEWS: Review[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_COUPONS: Coupon[] = [];
