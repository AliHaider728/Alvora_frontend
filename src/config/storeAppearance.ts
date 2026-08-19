import type { HomepageSectionSetting, StoreSettings, StorefrontNavigationItem } from '../types';

export const INTERNAL_PAGE_OPTIONS = [
  { value: '/', label: 'Home' },
  { value: '/category/all', label: 'Shop All' },
  { value: '/about', label: 'About' },
  { value: '/contact', label: 'Contact' },
  { value: '/wishlist', label: 'Wishlist' },
  { value: '/account', label: 'Account' }
];

const systemItem = (key: string, label: string, path: string, displayOrder: number, overrides: Partial<StorefrontNavigationItem> = {}): StorefrontNavigationItem => ({
  id: `nav-${key}`, key, label, linkType: 'internal_page', menuType: 'link', path,
  parentId: null, visible: true, enabled: true, showOnDesktop: true, showOnMobile: true,
  displayOrder, order: displayOrder, isSystemItem: true, ...overrides
});

export const DEFAULT_STOREFRONT_NAVIGATION: StorefrontNavigationItem[] = [
  systemItem('home', 'Home', '/', 0),
  systemItem('shop', 'Shop', '/category/all', 1, { showOnMobile: false }),
  systemItem('categories', 'Shop Categories', '/category/all', 2, { menuType: 'dropdown', path: undefined }),
  systemItem('about', 'About', '/about', 3, { showOnMobile: false }),
  systemItem('contact', 'Contact', '/contact', 4, { showOnMobile: false }),
  systemItem('wishlist', 'Wishlist', '/wishlist', 5, { showOnDesktop: false }),
  systemItem('account', 'Account', '/account', 6, { showOnDesktop: false })
];

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionSetting[] = [
  { key: 'hero', name: 'Hero', enabled: true, order: 0, heading: 'Skincare, Made Simple.', subheading: 'Thoughtfully formulated skincare that nourishes, protects and brings out your most radiant skin.', ctaLabel: 'Shop Best Sellers', ctaLink: '/category/all' },
  { key: 'categories', name: 'Shop by Category', enabled: true, order: 1, heading: 'Shop by Category', subheading: 'Explore our skincare range', ctaLabel: 'View All Categories', ctaLink: '/category/all' },
  { key: 'ageGroups', name: 'Shop by Skin Type', enabled: true, order: 2, heading: 'Shop by Skin Type', subheading: 'Find products formulated for your specific skin needs.' },
  { key: 'featuredProducts', name: 'Featured Products', enabled: true, order: 3, heading: 'Best Sellers', subheading: 'Loved by Thousands', ctaLabel: 'View All', ctaLink: '/category/all' },
  { key: 'brandCampaign', name: 'Nature + Science', enabled: true, order: 4, heading: 'Nature + Science For Your Skin', subheading: 'We combine clean, potent ingredients with advanced skincare science to deliver visible, lasting results.', ctaLabel: 'Learn More', ctaLink: '/about' },
  { key: 'newArrivals', name: 'New Arrivals', enabled: true, order: 5, heading: 'New Arrivals', subheading: 'Fresh formulations', ctaLabel: 'Browse New', ctaLink: '/category/all' }
];

const normalizeNavigation = (incoming?: Partial<StorefrontNavigationItem>[]) => {
  const source = incoming?.length ? incoming : DEFAULT_STOREFRONT_NAVIGATION;
  const normalized = source.map((item, index): StorefrontNavigationItem => {
    const fallback = DEFAULT_STOREFRONT_NAVIGATION.find(value => value.key === item.key);
    const displayOrder = Number(item.displayOrder ?? item.order ?? index);
    return {
      ...(fallback || {}),
      id: String(item.id || fallback?.id || `nav-${item.key || index}`),
      key: String(item.key || fallback?.key || `custom-${index}`),
      label: String(item.label || fallback?.label || 'Navigation Item'),
      linkType: item.linkType || fallback?.linkType || 'custom_internal_url',
      menuType: item.menuType || fallback?.menuType || 'link',
      path: item.path ?? fallback?.path,
      externalUrl: item.externalUrl,
      categoryId: item.categoryId,
      parentId: item.parentId || null,
      visible: item.visible !== false,
      enabled: item.enabled !== false,
      showOnDesktop: item.showOnDesktop !== false,
      showOnMobile: item.showOnMobile !== false,
      displayOrder,
      order: displayOrder,
      badgeText: item.badgeText,
      openInNewTab: item.openInNewTab === true,
      isSystemItem: item.isSystemItem ?? Boolean(fallback)
    };
  });
  DEFAULT_STOREFRONT_NAVIGATION.forEach(item => {
    if (!normalized.some(candidate => candidate.key === item.key)) normalized.push({ ...item });
  });
  return normalized;
};

const mergeSections = (incoming?: Partial<HomepageSectionSetting>[]) => DEFAULT_HOMEPAGE_SECTIONS.map(defaultItem => ({
  ...defaultItem,
  ...(incoming?.find(item => item.key === defaultItem.key) || {})
}));

export const normalizeStoreSettings = (settings: Partial<StoreSettings>): StoreSettings => ({
  storeName: settings.storeName || 'Alvora Skincare',
  tagline: settings.tagline || 'Where Imagination Comes to Life',
  email: settings.email || 'Sales@alvora.pk',
  phone: settings.phone || '0310-7172222',
  address: settings.address || 'Mumtaz Market, Gujranwala',
  currency: settings.currency || 'Rs.',
  logoUrl: settings.logoUrl,
  metaTitle: settings.metaTitle || 'Alvora Skincare - Premium Skincare Products',
  metaDescription: settings.metaDescription || '',
  freeShippingThreshold: Number(settings.freeShippingThreshold ?? 5000),
  standardShippingFee: Number(settings.standardShippingFee ?? settings.flatDeliveryRate ?? 200),
  flatDeliveryRate: settings.flatDeliveryRate,
  taxRate: Number(settings.taxRate ?? 0),
  storefrontNavigation: normalizeNavigation(settings.storefrontNavigation),
  homepageSections: mergeSections(settings.homepageSections),
  socialLinks: {
    instagram: settings.socialLinks?.instagram || 'https://www.instagram.com/alvora.pk',
    facebook: settings.socialLinks?.facebook || 'https://facebook.com/alvora.pk',
    youtube: settings.socialLinks?.youtube || 'https://youtube.com/@alvora.pk',
    tiktok: settings.socialLinks?.tiktok || 'https://tiktok.com/@alvora.pk'
  }
});

export const orderedVisibleNavigation = (settings: StoreSettings, surface: 'desktop' | 'mobile') =>
  settings.storefrontNavigation
    .filter(item => item.visible && (surface === 'desktop' ? item.showOnDesktop : item.showOnMobile))
    .sort((a, b) => a.displayOrder - b.displayOrder);

export const orderedHomepageSections = (settings: StoreSettings) =>
  settings.homepageSections.filter(section => section.enabled).sort((a, b) => a.order - b.order);
