const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => request('/auth/profile'),

  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  getCart: () => request('/cart'),
  addToCart: (productId, quantity = 1) =>
    request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (productId, quantity) =>
    request(`/cart/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeFromCart: (productId) => request(`/cart/${productId}`, { method: 'DELETE' }),
  clearCart: () => request('/cart', { method: 'DELETE' }),

  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request('/orders/myorders'),
  getAllOrders: () => request('/orders'),
};
