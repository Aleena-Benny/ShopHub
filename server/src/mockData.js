// Mock data store - replaces MongoDB
let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In real app, this would be hashed
    isAdmin: true,
    cart: [],
    orders: [],
    createdAt: new Date(),
  },
  {
    _id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
    cart: [],
    orders: [],
    createdAt: new Date(),
  },
  {
    _id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
    cart: [],
    orders: [],
    createdAt: new Date(),
  },
];

let products = [
  {
    _id: '101',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 79.99,
    image: 'https://dummyimage.com/300x300/4CAF50/FFFFFF?text=Wireless+Headphones',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    reviews: [],
    createdAt: new Date(),
  },
  {
    _id: '102',
    name: 'USB-C Cable',
    description: 'Durable USB-C charging and data cable',
    price: 12.99,
    image: 'https://dummyimage.com/300x300/2196F3/FFFFFF?text=USB-C+Cable',
    category: 'Accessories',
    stock: 100,
    rating: 4.2,
    reviews: [],
    createdAt: new Date(),
  },
  {
    _id: '103',
    name: 'Laptop Stand',
    description: 'Ergonomic adjustable laptop stand',
    price: 49.99,
    image: 'https://dummyimage.com/300x300/FF9800/FFFFFF?text=Laptop+Stand',
    category: 'Office',
    stock: 30,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
  },
  {
    _id: '104',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with custom switches',
    price: 129.99,
    image: 'https://dummyimage.com/300x300/9C27B0/FFFFFF?text=Mechanical+Keyboard',
    category: 'Electronics',
    stock: 25,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
  },
  {
    _id: '105',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 39.99,
    image: 'https://dummyimage.com/300x300/F44336/FFFFFF?text=Wireless+Mouse',
    category: 'Electronics',
    stock: 60,
    rating: 4.4,
    reviews: [],
    createdAt: new Date(),
  },
  {
    _id: '106',
    name: 'Monitor Arm',
    description: 'Adjustable dual monitor arm mount',
    price: 89.99,
    image: 'https://dummyimage.com/300x300/00BCD4/FFFFFF?text=Monitor+Arm',
    category: 'Office',
    stock: 20,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
  },
];

let orders = [
  {
    _id: '1001',
    user: '2',
    items: [
      {
        product: '101',
        name: 'Wireless Headphones',
        image: 'https://dummyimage.com/300x300/4CAF50/FFFFFF?text=Wireless+Headphones',
        price: 79.99,
        quantity: 1,
      },
    ],
    shippingAddress: '123 Main St, New York, NY 10001',
    paymentMethod: 'PayPal',
    totalPrice: 79.99,
    isPaid: true,
    paidAt: new Date('2024-01-15'),
    isDelivered: true,
    deliveredAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-15'),
  },
];

// Simple session/token storage (replace JWT)
let activeSessions = new Map();

const generateToken = (userId) => {
  const token = `token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  activeSessions.set(token, {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return token;
};

const verifyToken = (token) => {
  const session = activeSessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return null;
  }
  return session.userId;
};

const invalidateToken = (token) => {
  activeSessions.delete(token);
};

// Simulated async operations
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Database operations
export const mockDB = {
  // User operations
  users: {
    findOne: async (query) => {
      await delay(10);
      if (query.email) {
        return users.find((u) => u.email === query.email) || null;
      }
      return null;
    },
    findById: async (id) => {
      await delay(10);
      return users.find((u) => u._id === id) || null;
    },
    create: async (userData) => {
      await delay(10);
      const newUser = {
        _id: String(Math.max(...users.map((u) => parseInt(u._id) || 0)) + 1),
        ...userData,
        cart: [],
        orders: [],
        createdAt: new Date(),
      };
      users.push(newUser);
      return newUser;
    },
    save: async (user) => {
      await delay(10);
      const index = users.findIndex((u) => u._id === user._id);
      if (index !== -1) {
        users[index] = user;
      }
      return user;
    },
  },

  // Product operations
  products: {
    find: async (query = {}, skip = 0, limit = 12) => {
      await delay(10);
      let results = [...products];

      if (query.category) {
        results = results.filter((p) => p.category === query.category);
      }
      if (query.search) {
        const searchLower = query.search.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
      }

      return results.slice(skip, skip + limit);
    },
    countDocuments: async (query = {}) => {
      await delay(10);
      let results = [...products];

      if (query.category) {
        results = results.filter((p) => p.category === query.category);
      }
      if (query.search) {
        const searchLower = query.search.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
      }

      return results.length;
    },
    findById: async (id) => {
      await delay(10);
      return products.find((p) => p._id === id) || null;
    },
    create: async (productData) => {
      await delay(10);
      const newProduct = {
        _id: String(
          Math.max(...products.map((p) => parseInt(p._id) || 0)) + 1
        ),
        ...productData,
        reviews: [],
        createdAt: new Date(),
      };
      products.push(newProduct);
      return newProduct;
    },
    findByIdAndUpdate: async (id, updateData) => {
      await delay(10);
      const index = products.findIndex((p) => p._id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updateData };
        return products[index];
      }
      return null;
    },
    findByIdAndDelete: async (id) => {
      await delay(10);
      const index = products.findIndex((p) => p._id === id);
      if (index !== -1) {
        const deleted = products[index];
        products.splice(index, 1);
        return deleted;
      }
      return null;
    },
  },

  // Order operations
  orders: {
    find: async (query = {}) => {
      await delay(10);
      let results = [...orders];

      if (query.user) {
        results = results.filter((o) => o.user === query.user);
      }

      return results;
    },
    findById: async (id) => {
      await delay(10);
      return orders.find((o) => o._id === id) || null;
    },
    create: async (orderData) => {
      await delay(10);
      const newOrder = {
        _id: String(
          Math.max(...orders.map((o) => parseInt(o._id) || 0)) + 1
        ),
        ...orderData,
        createdAt: new Date(),
      };
      orders.push(newOrder);
      return newOrder;
    },
    findByIdAndUpdate: async (id, updateData) => {
      await delay(10);
      const index = orders.findIndex((o) => o._id === id);
      if (index !== -1) {
        orders[index] = { ...orders[index], ...updateData };
        return orders[index];
      }
      return null;
    },
  },

  // Auth operations
  auth: {
    generateToken,
    verifyToken,
    invalidateToken,
  },
};

export default mockDB;
