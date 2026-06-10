import axios from 'axios';
import { mockProducts, mockCategories, mockUsers, mockReviews, filterMockProducts } from './mockData';

const API = axios.create({ baseURL: '/api', timeout: 1500 });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const BACKEND_KEY = 'aura_backend';
if (!localStorage.getItem(BACKEND_KEY)) {
  localStorage.setItem(BACKEND_KEY, 'checking');
  API.get('/health').then(() => localStorage.setItem(BACKEND_KEY, 'true')).catch(() => localStorage.setItem(BACKEND_KEY, 'false'));
}

export const authAPI = {
  register: async (data) => {
    try { return await API.post('/auth/register', data); }
    catch {
      const exists = mockUsers.find(u => u.email === data.email);
      if (exists) throw { response: { data: { message: 'Email already registered' } } };
      const user = { id: mockUsers.length + 1, name: data.name, email: data.email, role: 'customer', created_at: new Date().toISOString() };
      mockUsers.push(user);
      const tokens = { accessToken: 'mock_access_' + user.id, refreshToken: 'mock_refresh_' + user.id };
      return { data: { message: 'User registered successfully', ...tokens, user } };
    }
  },
  login: async (data) => {
    try { return await API.post('/auth/login', data); }
    catch {
      const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
      if (!user) throw { response: { data: { message: 'Invalid email or password' } } };
      const { password, ...safe } = user;
      const tokens = { accessToken: 'mock_access_' + user.id, refreshToken: 'mock_refresh_' + user.id };
      return { data: { message: 'Login successful', ...tokens, user: safe } };
    }
  },
  refresh: (data) => API.post('/auth/refresh', data),
  logout: async (data) => {
    try { return await API.post('/auth/logout', data); } catch { return { data: { message: 'Logged out' } }; }
  },
  profile: async () => {
    try { return await API.get('/auth/profile'); }
    catch {
      const id = parseInt(localStorage.getItem('accessToken')?.split('_').pop() || '1');
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw { response: { data: { message: 'Not found' } } };
      const { password, ...safe } = user;
      return { data: safe };
    }
  },
};

export const productAPI = {
  list: async (params) => {
    try { return await API.get('/products', { params }); }
    catch { return { data: filterMockProducts(params) }; }
  },
  get: async (id) => {
    try { return await API.get(`/products/${id}`); }
    catch {
      const product = mockProducts.find(p => p.id === Number(id));
      if (!product) throw { response: { data: { message: 'Product not found' } } };
      return { data: product };
    }
  },
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
  list: async () => {
    try { return await API.get('/categories'); }
    catch { return { data: mockCategories }; }
  },
  get: async (id) => {
    try { return await API.get(`/categories/${id}`); }
    catch {
      const cat = mockCategories.find(c => c.id === Number(id));
      if (!cat) throw { response: { data: { message: 'Category not found' } } };
      return { data: cat };
    }
  },
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

const CART_KEY = 'local_cart';

function getLocalCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}

function saveLocalCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

let cartIdCounter = 100;

export const cartAPI = {
  get: async () => {
    try { return await API.get('/cart'); }
    catch { return { data: getLocalCart() }; }
  },
  add: async (data) => {
    try { return await API.post('/cart', data); }
    catch {
      const items = getLocalCart();
      const existing = items.find(i => i.product_id === data.product_id);
      if (existing) {
        existing.quantity += data.quantity || 1;
      } else {
        const product = mockProducts.find(p => p.id === data.product_id);
        items.push({ id: ++cartIdCounter, product_id: data.product_id, quantity: data.quantity || 1, product_name: product?.name, product_price: product?.price, product_image: product?.image_url, stock: product?.stock });
      }
      saveLocalCart(items);
      return { data: { message: 'Item added to cart' } };
    }
  },
  update: async (id, data) => {
    try { return await API.put(`/cart/${id}`, data); }
    catch {
      const items = getLocalCart().map(i => i.id === Number(id) ? { ...i, quantity: data.quantity } : i);
      saveLocalCart(items);
      return { data: { message: 'Cart updated' } };
    }
  },
  remove: async (id) => {
    try { return await API.delete(`/cart/${id}`); }
    catch {
      saveLocalCart(getLocalCart().filter(i => i.id !== Number(id)));
      return { data: { message: 'Item removed from cart' } };
    }
  },
  clear: async () => {
    try { return await API.delete('/cart/clear'); }
    catch { saveLocalCart([]); return { data: { message: 'Cart cleared' } }; }
  },
};

export const wishlistAPI = {
  get: async () => {
    try { return await API.get('/wishlist'); }
    catch {
      const data = JSON.parse(localStorage.getItem('local_wishlist') || '[]');
      return { data };
    }
  },
  add: async (data) => {
    try { return await API.post('/wishlist', data); }
    catch {
      const items = JSON.parse(localStorage.getItem('local_wishlist') || '[]');
      if (!items.find(i => i.product_id === data.product_id)) {
        const product = mockProducts.find(p => p.id === data.product_id);
        items.push({ id: Date.now(), product_id: data.product_id, product_name: product?.name, product_price: product?.price, product_image: product?.image_url });
      }
      localStorage.setItem('local_wishlist', JSON.stringify(items));
      return { data: { message: 'Added to wishlist', id: Date.now() } };
    }
  },
  remove: async (id) => {
    try { return await API.delete(`/wishlist/${id}`); }
    catch {
      const items = JSON.parse(localStorage.getItem('local_wishlist') || '[]').filter(i => i.id !== Number(id));
      localStorage.setItem('local_wishlist', JSON.stringify(items));
      return { data: { message: 'Removed from wishlist' } };
    }
  },
};

export const orderAPI = {
  place: async () => {
    try { return await API.post('/orders'); } catch { throw { response: { data: { message: 'Backend required for orders' } } }; }
  },
  mine: async () => {
    try { return await API.get('/orders'); }
    catch {
      const userId = parseInt(localStorage.getItem('accessToken')?.split('_').pop() || '2');
      return { data: mockOrders.filter(o => o.user_id === userId) };
    }
  },
  get: async (id) => {
    try { return await API.get(`/orders/${id}`); }
    catch {
      const order = mockOrders.find(o => o.id === Number(id));
      if (!order) throw { response: { data: { message: 'Order not found' } } };
      return { data: { ...order, payments: [{ id: 1, amount: order.total_amount, method: 'card', status: 'completed' }] } };
    }
  },
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
  byProduct: async (productId) => {
    try { return await API.get(`/reviews/product/${productId}`); }
    catch { return { data: mockReviews.filter(r => r.product_id === Number(productId)) }; }
  },
  add: async (productId, data) => {
    try { return await API.post(`/reviews/product/${productId}`, data); }
    catch {
      mockReviews.push({ id: Date.now(), user_id: 1, product_id: Number(productId), rating: data.rating, comment: data.comment, user_name: 'You', created_at: new Date().toISOString() });
      return { data: { message: 'Review added', id: Date.now() } };
    }
  },
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export const adminAPI = {
  dashboard: async () => {
    try { return await API.get('/admin/dashboard'); }
    catch {
      return { data: {
        totalRevenue: 13394, totalOrders: 4, totalProducts: 16, totalUsers: 3,
        recentOrders: [
          { id: 4, user_name: 'Jane Smith', total_amount: 1299, status: 'pending', created_at: new Date().toISOString() },
          { id: 3, user_name: 'Jane Smith', total_amount: 6497, status: 'shipped', created_at: new Date(Date.now() - 86400000).toISOString() },
        ],
        lowStock: [{ id: 9, name: 'Non-Stick Cookware Set', stock: 25 }],
      }};
    }
  },
  users: async () => {
    try { return await API.get('/admin/users'); }
    catch { return { data: { users: mockUsers.map(({ password, ...u }) => u), pagination: { page: 1, limit: 20, total: mockUsers.length, pages: 1 } } }; }
  },
  productSales: () => API.get('/admin/reports/product-sales'),
  dailyRevenue: (params) => API.get('/admin/reports/daily-revenue', { params }),
};

export default API;
