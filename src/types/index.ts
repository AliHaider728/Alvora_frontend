export type AgeGroupCategory = '0-2' | '3-5' | '6-8' | '8+';
export type ProductDetailBlockType = 'richText' | 'image' | 'html' | 'divider';

export interface ProductDetailBlock {
  id: string;
  type: ProductDetailBlockType;
  enabled: boolean;
  order: number;
  heading?: string;
  content?: string;
  image?: {
    secureUrl: string;
    publicId: string;
    alt: string;
    caption?: string;
    newlyUploaded?: boolean;
  };
  settings?: {
    width?: 'full' | 'large' | 'medium';
    alignment?: 'left' | 'center' | 'right';
  };
}

export interface ProductVariantOption {
  id: string;
  name: string;
  priceOffset?: number;
  inStock?: boolean;
  stockQuantity?: number;
  sku?: string;
}

export interface ProductVariantGroup {
  id: string;
  name: string;
  options: ProductVariantOption[];
}

export type DeliveryChargeType = 'store_threshold' | 'category' | 'fixed' | 'free' | 'none';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  category: string;
  categorySlug: string;
  ageGroup?: AgeGroupCategory;
  ageGroups: AgeGroupCategory[];
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold?: number;
  images: string[];
  imagePublicIds?: string[];
  shortDescription?: string;
  description: string;
  features: string[];
  safetyInfo: string;
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isVisible?: boolean; // Show/Hide toggle on storefront
  status?: 'draft' | 'published';
  weight?: number;
  tags: string[];
  variants?: ProductVariantGroup[];
  deliveryType?: DeliveryChargeType;
  deliveryChargeType?: DeliveryChargeType;
  deliveryFee?: number;
  deliveryCharge?: number;
  customDeliveryFee?: number;
  metaTitle?: string;
  metaDescription?: string;
  productDetailBlocks?: ProductDetailBlock[];
  productDetailCustomCss?: string;
  productDetailScopedCss?: string;
}

export type ProductInput = Omit<
  Product,
  'id' | 'originalPrice' | 'sku' | 'lowStockThreshold' | 'weight' | 'customDeliveryFee'
> & {
  originalPrice?: number | null;
  sku?: string | null;
  lowStockThreshold?: number | null;
  weight?: number | null;
  customDeliveryFee?: number | null;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  description: string;
  itemCount: number;
  deliveryType?: DeliveryChargeType;
  deliveryChargeType?: DeliveryChargeType;
  deliveryFee?: number;
  deliveryCharge?: number;
  customDeliveryFee?: number;
}

export interface AgeGroupOption {
  id: AgeGroupCategory;
  name: string;
  label: string;
  range: string;
  color: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  date: string;
  createdAt?: string; // ISO timestamp for 24h cancellation limit
  customerName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    fullName: string;
    phone?: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'Cash on Delivery (COD)';
  trackingNumber?: string;
  checkoutRequestId?: string;
}

export interface Address {
  id: string;
  name: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  addresses: Address[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  amount: number;
  minSpend: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  logoUrl?: string;
  metaTitle: string;
  metaDescription: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  flatDeliveryRate?: number;
  taxRate: number;
  storefrontNavigation: StorefrontNavigationItem[];
  homepageSections: HomepageSectionSetting[];
}

export type StorefrontNavigationKey =
  | 'home' | 'shop' | 'categories' | 'about' | 'contact' | 'wishlist' | 'account';

export interface StorefrontNavigationItem {
  key: StorefrontNavigationKey;
  label: string;
  path: string;
  visible: boolean;
  enabled: boolean;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  order: number;
}

export type HomepageSectionKey =
  | 'hero' | 'categories' | 'ageGroups' | 'featuredProducts' | 'brandCampaign' | 'newArrivals';

export interface HomepageSectionSetting {
  key: HomepageSectionKey;
  name: string;
  enabled: boolean;
  order: number;
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaLink?: string;
}
