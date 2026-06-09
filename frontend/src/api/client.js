import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && err.response?.data?.code === 'TOKEN_EXPIRED' && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken: refresh });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  refresh: (data) => API.post('/auth/refresh', data),
  logout: (data) => API.post('/auth/logout', data),
  profile: () => API.get('/auth/profile'),
};

export const productAPI = {
  list: (params) => API.get('/products', { params }),
  get: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
  upload: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return API.post('/products/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const categoryAPI = {
  list: () => API.get('/categories'),
  get: (id) => API.get(`/categories/${id}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart', data),
  update: (id, data) => API.put(`/cart/${id}`, data),
  remove: (id) => API.delete(`/cart/${id}`),
  clear: () => API.delete('/cart/clear'),
};

export const wishlistAPI = {
  get: () => API.get('/wishlist'),
  add: (data) => API.post('/wishlist', data),
  remove: (id) => API.delete(`/wishlist/${id}`),
};

export const orderAPI = {
  place: () => API.post('/orders'),
  mine: () => API.get('/orders'),
  get: (id) => API.get(`/orders/${id}`),
  cancel: (id) => API.put(`/orders/${id}/cancel`),
  all: (params) => API.get('/orders/all', { params }),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

export const paymentAPI = {
  process: (data) => API.post('/payments', data),
  status: (jobId) => API.get(`/payments/status/${jobId}`),
  byOrder: (orderId) => API.get(`/payments/${orderId}`),
};

export const reviewAPI = {
  byProduct: (productId) => API.get(`/reviews/product/${productId}`),
  add: (productId, data) => API.post(`/reviews/product/${productId}`, data),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export const adminAPI = {
  dashboard: () => API.get('/admin/dashboard'),
  users: (params) => API.get('/admin/users', { params }),
  productSales: () => API.get('/admin/reports/product-sales'),
  dailyRevenue: (params) => API.get('/admin/reports/daily-revenue', { params }),
};

export default API;
