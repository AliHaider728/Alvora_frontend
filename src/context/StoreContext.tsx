import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductInput,
  Category,
  Order,
  Customer,
  Coupon,
  StoreSettings,
  CartItem,
  Review
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS
} from '../data/mockData';
import { api, getAuthToken } from '../services/api';
import { formatPrice } from '../utils/formatters';
import { normalizeStoreSettings } from '../config/storeAppearance';
import { normalizeInventory, normalizeProductAgeGroups } from '../utils/products';

type MongoRecord = {
  _id?: unknown;
};

type BackendOrder = Partial<Order> &
  MongoRecord & {
    orderId?: unknown;
    deliveryCharge?: number;
    discountAmount?: number;
  };

const normalizeProduct = (product: Partial<Product> & MongoRecord): Product => {
  const inventory = normalizeInventory(product);
  return ({
  ...(product as Product),
  id: String(product.id || product._id || product.slug || ''),
  ageGroups: normalizeProductAgeGroups(product.ageGroups, product.ageGroup),
  images: Array.isArray(product.images)
    ? product.images.filter(
        (image): image is string => typeof image === 'string' && image.trim().length > 0
      )
    : [],
  imagePublicIds: Array.isArray(product.imagePublicIds)
    ? product.imagePublicIds.map(publicId => typeof publicId === 'string' ? publicId : '')
    : [],
  shortDescription: product.shortDescription || '',
  status: product.status || 'published',
  ...inventory,
  category: product.category || '',
  categorySlug: product.categorySlug || '',
  rating: Number(product.reviewCount || 0) > 0 ? Number(product.rating || 0) : 0,
  reviewCount: Math.max(0, Number(product.reviewCount || 0)),
  features: Array.isArray(product.features) ? product.features : [],
  tags: Array.isArray(product.tags) ? product.tags : [],
  specifications: product.specifications || {},
  safetyInfo: product.safetyInfo || '',
  variants: Array.isArray(product.variants)
    ? product.variants.map(group => ({
        ...group,
        options: Array.isArray(group.options)
          ? group.options.map(option => ({ ...option, ...normalizeInventory(option) }))
          : []
      }))
    : [],
  productDetailBlocks: Array.isArray(product.productDetailBlocks)
    ? product.productDetailBlocks.map((block, index) => ({ ...block, order: index }))
    : []
  });
};

const normalizeCategory = (category: Partial<Category> & MongoRecord): Category => ({
  ...(category as Category),
  id: String(category.id || category._id || category.slug || ''),
  image: typeof category.image === 'string' ? category.image.trim() : ''
});

const normalizeOrder = (order: BackendOrder): Order => ({
  ...(order as Order),
  id: String(order.id || order.orderId || order._id || ''),
  date: order.date || order.createdAt || '',
  customerName: order.customerName || order.shippingAddress?.fullName || '',
  email: order.email || '',
  phone: order.phone || order.shippingAddress?.phone || '',
  items: Array.isArray(order.items) ? order.items : [],
  discount: order.discount ?? order.discountAmount ?? 0,
  shipping: order.shipping ?? order.deliveryCharge ?? 0
});

interface StoreContextType {
  // Data
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  reviews: Review[];
  settings: StoreSettings;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalItems: number;
  cartSubtotal: number;

  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponDiscountAmount: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Admin CRUD Actions
  addProduct: (productData: ProductInput) => Promise<Product | null>;
  updateProduct: (id: string, productData: Partial<ProductInput>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;

  addCategory: (categoryData: Omit<Category, 'id' | 'itemCount'>) => Category;
  updateCategory: (id: string, categoryData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void;
  updateOrderTracking: (orderId: string, trackingNumber: string) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'date'>) => Promise<Order | null>;

  addCoupon: (couponData: Omit<Coupon, 'id' | 'usedCount'>) => Coupon;
  updateCoupon: (id: string, couponData: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  updateAppearanceSettings: (newSettings: Pick<StoreSettings, 'storefrontNavigation' | 'homepageSections'>) => void;
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage state initialization
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('playbimboo_products');
    const initialProducts = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    return initialProducts.map(normalizeProduct);
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('playbimboo_categories');
    const initialCategories = saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    return initialCategories.map(normalizeCategory);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('playbimboo_orders');
    const initialOrders = saved ? JSON.parse(saved) : INITIAL_ORDERS;
    return initialOrders.map(normalizeOrder);
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('playbimboo_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('playbimboo_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('playbimboo_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('playbimboo_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.freeShippingThreshold === 50) {
        parsed.freeShippingThreshold = 5000;
      }
      return normalizeStoreSettings(parsed);
    }
    return normalizeStoreSettings(INITIAL_SETTINGS);
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('playbimboo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('playbimboo_wishlist');
    return saved ? JSON.parse(saved) : ['p-101', 'p-103'];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refreshProducts = async () => {
    const [realProducts, realCategories] = await Promise.all([api.getProducts(), api.getCategories()]);
    if (realProducts) setProducts(realProducts.map(normalizeProduct));
    if (realCategories) setCategories(realCategories.map(normalizeCategory));
  };

  
  // Fetch real data from backend API on mount
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const hasAdminSession = Boolean(getAuthToken());
        if (!hasAdminSession) {
          setOrders([]);
          setCustomers([]);
          setCoupons([]);
          setReviews([]);
        }
        const [
          realProducts,
          realCategories,
          realOrders,
          realCustomers,
          realCoupons,
          realSettings,
          realReviews
        ] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          hasAdminSession ? api.getOrders() : Promise.resolve(null),
          hasAdminSession ? api.getCustomers() : Promise.resolve(null),
          hasAdminSession ? api.getCoupons() : Promise.resolve(null),
          api.getSettings(),
          hasAdminSession ? api.getAllReviewsAdmin() : Promise.resolve(null)
        ]);

        if (realProducts) setProducts(realProducts.map(normalizeProduct));
        if (realCategories) setCategories(realCategories.map(normalizeCategory));
        if (realOrders) setOrders(realOrders.map(normalizeOrder));
        if (realCustomers) setCustomers(realCustomers);
        if (realCoupons) setCoupons(realCoupons);
        if (realSettings) setSettings(normalizeStoreSettings(realSettings));
        if (realReviews) setReviews(realReviews);
      } catch (err) {
        console.error('Failed to fetch real data from backend', err);
      }
    };

    void fetchRealData();
    window.addEventListener('pb-auth-changed', fetchRealData);
    return () => window.removeEventListener('pb-auth-changed', fetchRealData);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('playbimboo_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('playbimboo_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('playbimboo_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('playbimboo_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('playbimboo_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('playbimboo_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('playbimboo_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('playbimboo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('playbimboo_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedVariant === selectedVariant);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedVariant === selectedVariant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Coupon application logic
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === trimmed && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimum spend of ${formatPrice(found.minSpend)} required for this code.`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const couponDiscountAmount = React.useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return (cartSubtotal * appliedCoupon.amount) / 100;
    } else {
      return Math.min(cartSubtotal, appliedCoupon.amount);
    }
  }, [appliedCoupon, cartSubtotal]);

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Admin CRUD handlers
  const addProduct = async (productData: ProductInput) => {
    const savedProduct = await api.createProduct(productData);
    if (!savedProduct) return null;

    const normalizedProduct = normalizeProduct(savedProduct);
    setProducts(prev => [normalizedProduct, ...prev]);
    await refreshProducts();
    return normalizedProduct;
  };

  const updateProduct = async (id: string, productData: Partial<ProductInput>) => {
    const savedProduct = await api.updateProduct(id, productData);
    if (!savedProduct) return null;

    const normalizedProduct = normalizeProduct(savedProduct);
    setProducts(prev => prev.map(p => (p.id === id ? normalizedProduct : p)));
    await refreshProducts();
    return normalizedProduct;
  };

  const deleteProduct = async (id: string) => {
    const result = await api.deleteProduct(id);
    if (!result) return false;
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const addCategory = (categoryData: Omit<Category, 'id' | 'itemCount'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now().toString().slice(-3)}`,
      itemCount: 0,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...categoryData } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], trackingNumber?: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status, ...(trackingNumber ? { trackingNumber } : {}) } : o))
    );
    api.updateOrderStatus(orderId, status).catch(() => {});
    if (trackingNumber) {
      api.updateOrderTracking(orderId, trackingNumber).catch(() => {});
    }
  };

  const updateOrderTracking = (orderId: string, trackingNumber: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, trackingNumber } : o))
    );
    api.updateOrderTracking(orderId, trackingNumber).catch(() => {});
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'date'>) => {
    const savedOrder = await api.createOrder({
      ...orderData,
      deliveryCharge: orderData.shipping,
      discountAmount: orderData.discount
    });
    if (!savedOrder) return null;

    const newOrder = normalizeOrder(savedOrder);
    setOrders(prev => [newOrder, ...prev]);
    await refreshProducts();

    // Update customer total spent
    setCustomers(prev => {
      const existing = prev.find(c => c.email.toLowerCase() === orderData.email.toLowerCase());
      if (existing) {
        return prev.map(c =>
          c.email.toLowerCase() === orderData.email.toLowerCase()
            ? { ...c, ordersCount: c.ordersCount + 1, totalSpent: c.totalSpent + orderData.total }
            : c
        );
      } else {
        return [
          ...prev,
          {
            id: `cust-${Date.now().toString().slice(-3)}`,
            name: orderData.customerName,
            email: orderData.email,
            phone: orderData.phone,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            ordersCount: 1,
            totalSpent: orderData.total,
            joinedDate: new Date().toISOString().split('T')[0],
            addresses: [
              {
                id: 'addr-new',
                name: 'Shipping',
                street: orderData.shippingAddress.street,
                city: orderData.shippingAddress.city,
                state: orderData.shippingAddress.state,
                postalCode: orderData.shippingAddress.postalCode,
                isDefault: true,
              },
            ],
          },
        ];
      }
    });

    clearCart();
    return newOrder;
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `coup-${Date.now().toString().slice(-3)}`,
      usedCount: 0,
    };
    setCoupons(prev => [...prev, newCoupon]);
    return newCoupon;
  };

  const updateCoupon = (id: string, couponData: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => (c.id === id ? { ...c, ...couponData } : c)));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => normalizeStoreSettings({ ...prev, ...newSettings }));
  };

  const updateAppearanceSettings = (
    newSettings: Pick<StoreSettings, 'storefrontNavigation' | 'homepageSections'>
  ) => {
    setSettings(prev => normalizeStoreSettings({ ...prev, ...newSettings }));
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newReview, ...prev]);

  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        customers,
        coupons,
        reviews,
        settings,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalItems,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscountAmount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        updateOrderTracking,
        placeOrder,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        updateSettings,
        updateAppearanceSettings,
        addReview,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
