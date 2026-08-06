// PlayBimboo Unified Backend API Client
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for Token Management
export const getAuthToken = (): string | null => localStorage.getItem('pb_admin_token');
export const setAuthToken = (token: string): void => {
  localStorage.setItem('pb_admin_token', token);
  window.dispatchEvent(new Event('pb-auth-changed'));
};
export const removeAuthToken = (): void => {
  localStorage.removeItem('pb_admin_token');
  window.dispatchEvent(new Event('pb-auth-changed'));
};
export type AdminSessionUser = { id?: string; email?: string; role?: 'super_admin' | 'admin' | 'customer' };
export const getAdminSessionUser = (): AdminSessionUser | null => {
  try {
    const value = localStorage.getItem('pb_admin_user');
    return value ? JSON.parse(value) as AdminSessionUser : null;
  } catch {
    return null;
  }
};
export const isSuperAdmin = () => getAdminSessionUser()?.role === 'super_admin';
let lastApiError = '';
export const getLastApiError = (): string => lastApiError;

const safeApiError = (status: number, backendMessage?: string) => {
  const safeBackend = typeof backendMessage === 'string' && backendMessage.length <= 280 &&
    !/stack|mongodb|mongoose|smtp|cloudinary.*secret|api[_ -]?secret|node_modules|\\|\/src\//i.test(backendMessage)
    ? backendMessage : '';
  if (status === 400) return safeBackend || 'Please check the submitted information.';
  if (status === 401) return 'Session expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return safeBackend || 'Requested item was not found.';
  if (status === 409) return safeBackend || 'This change conflicts with existing data.';
  if (status === 413) return 'File is too large.';
  if (status === 429) return 'Too many requests. Please try again.';
  return status >= 500 ? 'Temporary service problem. Please try again.' : safeBackend || 'Request failed.';
};

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    lastApiError = '';
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
      cache: options?.cache || 'no-store',
      credentials: 'include',
      headers
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(safeApiError(res.status, errorBody.error));
    }

    return await res.json();
  } catch (err: any) {
    lastApiError = err.message || 'Request failed';
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
  getAdminCategories: () => fetchJson<any[]>('/categories/admin/all'),
  createCategory: (data: any) => fetchJson<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => fetchJson<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => fetchJson<any>(`/categories/${id}`, { method: 'DELETE' }),
  getCategoryDeleteImpact: (id: string) => fetchJson<any>(`/categories/${id}/delete-impact`),
  deleteCategoryWithResolution: (id: string, data: any) => fetchJson<any>(`/categories/${id}`, { method: 'DELETE', body: JSON.stringify(data) }),

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
  updateCoupon: (id: string, data: any) => fetchJson<any>(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoupon: (id: string) => fetchJson<any>(`/coupons/${id}`, { method: 'DELETE' }),

  // Reviews
  getProductReviews: (productId: string) => fetchJson<any[]>(`/reviews/product/${productId}`),
  submitReview: (reviewData: any) => fetchJson<any>('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  submitAdminReview: (reviewData: any) => fetchJson<any>('/reviews/admin', { method: 'POST', body: JSON.stringify(reviewData) }),
  getAdminReviews: (params?: any) => {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return fetchJson<any>(`/reviews/admin${query ? `?${query}` : ''}`);
  },
  getAllReviewsAdmin: () => fetchJson<any[]>('/reviews/admin/all'), // Legacy/fallback, can be removed eventually
  updateReview: (id: string, data: any) => fetchJson<any>(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  approveReview: (id: string) => fetchJson<any>(`/reviews/${id}/approve`, { method: 'PUT' }),
  rejectReview: (id: string) => fetchJson<any>(`/reviews/${id}/reject`, { method: 'PUT' }),
  deleteReview: (id: string) => fetchJson<any>(`/reviews/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => fetchJson<any>('/settings'),
  getAdminAppearance: () => fetchJson<any>('/settings/appearance/admin'),
  updateSettings: (data: any) => fetchJson<any>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  updateAppearance: (data: any) => fetchJson<any>('/settings/appearance', { method: 'PUT', body: JSON.stringify(data) }),
  resetAppearance: () => fetchJson<any>('/settings/appearance/reset', { method: 'POST' }),

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
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ error: 'Failed to upload image' }));
        throw new Error(errorBody.error || 'Failed to upload image');
      }
      const result = await res.json();
      return {
        ...result,
        url: result.secureUrl || result.url
      };
    } catch (err: any) {
      console.error('Image Upload Error:', err);
      throw err;
    }
  },
  uploadDetailContentImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/upload/detail-content-image`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ error: 'Failed to upload image' }));
      throw new Error(errorBody.error || 'Failed to upload image');
    }
    return await res.json() as { secureUrl: string; url: string; publicId: string };
  },
  deleteImage: (publicId: string) =>
    fetchJson<{ deleted: boolean }>('/upload/image', {
      method: 'DELETE',
      body: JSON.stringify({ publicId })
    }),
  uploadCategoryImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/upload/category-image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      credentials: 'include'
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(safeApiError(res.status, body.error));
    }
    return await res.json() as { secureUrl: string; url: string; publicId: string };
  },
  deleteCategoryImage: (publicId: string) => fetchJson<{ deleted: boolean }>('/upload/category-image', {
    method: 'DELETE', body: JSON.stringify({ publicId })
  }),
  getGlobalAttributes: () => fetchJson<any[]>('/admin/global-attributes'),
  getGlobalAttributeUsage: (id: string) => fetchJson<{ productCount: number }>(`/admin/global-attributes/${id}/usage`),
  createGlobalAttribute: (data: any) => fetchJson<any>('/admin/global-attributes', { method: 'POST', body: JSON.stringify(data) }),
  updateGlobalAttribute: (id: string, data: any) => fetchJson<any>(`/admin/global-attributes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGlobalAttribute: (id: string) => fetchJson<any>(`/admin/global-attributes/${id}`, { method: 'DELETE' }),
  addGlobalAttributeTerm: (attrId: string, data: any) => fetchJson<any>(`/admin/global-attributes/${attrId}/terms`, { method: 'POST', body: JSON.stringify(data) }),
  updateGlobalAttributeTerm: (attrId: string, termId: string, data: any) => fetchJson<any>(`/admin/global-attributes/${attrId}/terms/${termId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGlobalAttributeTerm: (attrId: string, termId: string) => fetchJson<any>(`/admin/global-attributes/${attrId}/terms/${termId}`, { method: 'DELETE' }),
  reorderGlobalAttributeTerms: (attrId: string, data: any) => fetchJson<any>(`/admin/global-attributes/${attrId}/reorder-terms`, { method: 'PUT', body: JSON.stringify(data) }),
  uploadProductImage: (formData: FormData) => fetchJson<{ secureUrl: string }>('/upload/product-image', { method: 'POST', body: formData })
};
