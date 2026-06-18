import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    price: 149.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 25,
    rating: 4.5,
    numReviews: 128,
  },
  {
    name: 'Smart Watch Pro',
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 15,
    rating: 4.7,
    numReviews: 89,
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket made from sustainable organic cotton.',
    price: 79.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    stock: 40,
    rating: 4.3,
    numReviews: 56,
  },
  {
    name: 'Running Sneakers',
    description: 'Lightweight running shoes with responsive cushioning.',
    price: 119.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 30,
    rating: 4.6,
    numReviews: 203,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs, dishwasher safe.',
    price: 34.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca0d?w=400',
    stock: 50,
    rating: 4.4,
    numReviews: 42,
  },
  {
    name: 'JavaScript: The Good Parts',
    description: 'Essential guide to the elegant, lightweight language of the web.',
    price: 29.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    stock: 100,
    rating: 4.8,
    numReviews: 312,
  },
  {
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand for better posture.',
    price: 49.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    stock: 35,
    rating: 4.2,
    numReviews: 67,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip eco-friendly yoga mat with carrying strap.',
    price: 39.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    stock: 45,
    rating: 4.5,
    numReviews: 91,
  },
  {
    name: 'Minimalist Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature.',
    price: 59.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    stock: 20,
    rating: 4.1,
    numReviews: 38,
  },
  {
    name: 'Cotton T-Shirt Pack',
    description: 'Pack of 3 premium cotton t-shirts in assorted colors.',
    price: 44.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    stock: 60,
    rating: 4.0,
    numReviews: 145,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 360° sound.',
    price: 89.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock: 28,
    rating: 4.4,
    numReviews: 176,
  },
  {
    name: 'Clean Code',
    description: 'A handbook of agile software craftsmanship by Robert C. Martin.',
    price: 39.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
    stock: 75,
    rating: 4.9,
    numReviews: 428,
  },
];

const seed = async () => {
  await connectDB();

  await Product.deleteMany();
  await User.deleteMany();

  await Product.insertMany(products);

  await User.create({
    name: 'Admin User',
    email: 'admin@shop.com',
    password: 'admin123',
    isAdmin: true,
  });

  await User.create({
    name: 'Demo User',
    email: 'demo@shop.com',
    password: 'demo123',
  });

  console.log('Database seeded successfully');
  console.log('Admin: admin@shop.com / admin123');
  console.log('Demo:  demo@shop.com / demo123');
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
