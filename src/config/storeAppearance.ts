import type {
  HomepageSectionSetting,
  StoreSettings,
  StorefrontNavigationItem
} from '../types';

export const DEFAULT_STOREFRONT_NAVIGATION: StorefrontNavigationItem[] = [
  { key: 'home', label: 'Home', path: '/', visible: true, enabled: true, showOnDesktop: true, showOnMobile: true, order: 0 },
  { key: 'shop', label: 'Shop', path: '/category/all', visible: true, enabled: true, showOnDesktop: true, showOnMobile: false, order: 1 },
  { key: 'categories', label: 'Shop Categories', path: '/category/all', visible: true, enabled: true, showOnDesktop: true, showOnMobile: true, order: 2 },
  { key: 'about', label: 'About', path: '/about', visible: true, enabled: true, showOnDesktop: true, showOnMobile: false, order: 3 },
  { key: 'contact', label: 'Contact', path: '/contact', visible: true, enabled: true, showOnDesktop: true, showOnMobile: false, order: 4 },
  { key: 'wishlist', label: 'Wishlist', path: '/wishlist', visible: true, enabled: true, showOnDesktop: false, showOnMobile: true, order: 5 },
  { key: 'account', label: 'Account', path: '/account', visible: true, enabled: true, showOnDesktop: false, showOnMobile: true, order: 6 }
];

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionSetting[] = [
  { key: 'hero', name: 'Hero', enabled: true, order: 0, heading: 'Where Imagination Comes to Play!', subheading: 'Discover award-winning toys, STEM sets, plushies, action figures, and more that spark curiosity, inspire learning, and bring families closer together through the power of play.', ctaLabel: 'Explore All Toys', ctaLink: '/category/all' },
  { key: 'categories', name: 'Shop by Category', enabled: true, order: 1, heading: 'Shop by Category', subheading: 'Browse Collections', ctaLabel: 'View All Categories', ctaLink: '/category/all' },
  { key: 'ageGroups', name: 'Shop by Age Group', enabled: true, order: 2, heading: 'Shop by Age Group', subheading: 'Find perfectly developmental and age-appropriate toys designed for your child’s growth.' },
  { key: 'featuredProducts', name: 'Featured Products', enabled: true, order: 3, heading: 'Featured Toys & Bestsellers', subheading: 'Hot Picks', ctaLabel: 'Shop All Bestsellers', ctaLink: '/category/all' },
  { key: 'brandCampaign', name: 'Play, Learn, Grow', enabled: true, order: 4, heading: 'Discover Toys That Make Learning Magical', subheading: 'From STEM kits and building sets to creative play essentials, PlayBimboo brings fun, skill-building toys that spark curiosity and joyful learning at every age.', ctaLabel: 'Explore PlayBimboo Favorites', ctaLink: '/category/all' },
  { key: 'newArrivals', name: 'New Arrivals', enabled: true, order: 5, heading: 'New Arrivals & Restocks', subheading: 'Fresh In Store', ctaLabel: 'Browse New Additions', ctaLink: '/category/all' }
];

const mergeByKey = <T extends { key: string }>(defaults: T[], incoming?: Partial<T>[]): T[] =>
  defaults.map(defaultItem => ({
    ...defaultItem,
    ...(incoming?.find(item => item.key === defaultItem.key) || {})
  }));

export const normalizeStoreSettings = (settings: Partial<StoreSettings>): StoreSettings => ({
  storeName: settings.storeName || 'PlayBimboo',
  tagline: settings.tagline || 'Where Imagination Comes to Life',
  email: settings.email || 'support@playbimboo.com',
  phone: settings.phone || '',
  address: settings.address || '',
  currency: settings.currency || 'Rs.',
  logoUrl: settings.logoUrl,
  metaTitle: settings.metaTitle || 'PlayBimboo - Premium Toys for Kids',
  metaDescription: settings.metaDescription || '',
  freeShippingThreshold: Number(settings.freeShippingThreshold ?? 5000),
  standardShippingFee: Number(settings.standardShippingFee ?? settings.flatDeliveryRate ?? 200),
  flatDeliveryRate: settings.flatDeliveryRate,
  taxRate: Number(settings.taxRate ?? 0),
  storefrontNavigation: mergeByKey(DEFAULT_STOREFRONT_NAVIGATION, settings.storefrontNavigation),
  homepageSections: mergeByKey(DEFAULT_HOMEPAGE_SECTIONS, settings.homepageSections)
});

export const orderedVisibleNavigation = (
  settings: StoreSettings,
  surface: 'desktop' | 'mobile'
) => settings.storefrontNavigation
  .filter(item => item.visible && (surface === 'desktop' ? item.showOnDesktop : item.showOnMobile))
  .sort((a, b) => a.order - b.order);

export const orderedHomepageSections = (settings: StoreSettings) =>
  settings.homepageSections.filter(section => section.enabled).sort((a, b) => a.order - b.order);
