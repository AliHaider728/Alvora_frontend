export type AgeGroupCategory = '0-2' | '3-5' | '6-8' | '8+';

export interface ProductVariantOption {
  id: string;
  name: string;
  priceOffset?: number;
  inStock?: boolean;
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
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  category: string;
  categorySlug: string;
  ageGroup: AgeGroupCategory;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  description: string;
  features: string[];
  safetyInfo: string;
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isVisible?: boolean; // Show/Hide toggle on storefront
  tags: string[];
  variants?: ProductVariantGroup[];
  deliveryType?: DeliveryChargeType;
  deliveryChargeType?: DeliveryChargeType;
  deliveryFee?: number;
  deliveryCharge?: number;
  customDeliveryFee?: number;
  metaTitle?: string;
  metaDescription?: string;
}

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
}
