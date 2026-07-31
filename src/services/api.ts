// PlayBimboo Unified Backend API Client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for Token Management
export const getAuthToken = (): string | null => localStorage.getItem('pb_admin_token');
export const setAuthToken = (token: string): void => localStorage.setItem('pb_admin_token', token);
export const removeAuthToken = (): void => localStorage.removeItem('pb_admin_token');

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>)
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errorBody.error || `HTTP Error ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[Backend API Warning] ${endpoint}:`, err.message);
    return null;
  }
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchJson<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => fetchJson<any>('/auth/logout', { method: 'POST' }),
  getMe: () => fetchJson<any>('/auth/me'),
  syncWishlist: (wishlist: string[]) =>
    fetchJson<any>('/auth/wishlist', { method: 'POST', body: JSON.stringify({ wishlist }) }),
  getCustomers: () => fetchJson<any[]>('/auth/users'),

  // Products
  getProducts: (params?: { category?: string; ageGroup?: string; search?: string; isVisible?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<any[]>(`/products?${query}`);
  },

  getProduct: (idOrSlug: string) => fetchJson<any>(`/products/${idOrSlug}`),
  createProduct: (data: any) => fetchJson<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => fetchJson<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => fetchJson<any>(`/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => fetchJson<any[]>('/categories'),
  createCategory: (data: any) => fetchJson<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => fetchJson<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => fetchJson<any>(`/categories/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: (email?: string) => fetchJson<any[]>(`/orders${email ? `?email=${encodeURIComponent(email)}` : ''}`),
  createOrder: (orderData: any) => fetchJson<any>('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  cancelOrder: (orderId: string) => fetchJson<any>(`/orders/${orderId}/cancel`, { method: 'POST' }),
  updateOrderStatus: (orderId: string, status: string) => fetchJson<any>(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateOrderTracking: (orderId: string, trackingNumber: string) => fetchJson<any>(`/orders/${orderId}/tracking`, { method: 'PUT', body: JSON.stringify({ trackingNumber }) }),

  // Coupons
  getCoupons: () => fetchJson<any[]>('/coupons'),
  validateCoupon: (code: string, cartSubtotal: number) => fetchJson<any>('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, cartSubtotal }) }),
  createCoupon: (data: any) => fetchJson<any>('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  deleteCoupon: (id: string) => fetchJson<any>(`/coupons/${id}`, { method: 'DELETE' }),

  // Reviews
  getProductReviews: (productId: string) => fetchJson<any[]>(`/reviews/product/${productId}`),
  submitReview: (reviewData: any) => fetchJson<any>('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  getAllReviewsAdmin: () => fetchJson<any[]>('/reviews/admin/all'),
  approveReview: (id: string) => fetchJson<any>(`/reviews/${id}/approve`, { method: 'PUT' }),
  deleteReview: (id: string) => fetchJson<any>(`/reviews/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => fetchJson<any>('/settings'),
  updateSettings: (data: any) => fetchJson<any>('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // File Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers,
        body: formData
      });
      if (!res.ok) throw new Error('Failed to upload image');
      return await res.json();
    } catch (err: any) {
      console.error('Image Upload Error:', err);
      return null;
    }
  }
};
