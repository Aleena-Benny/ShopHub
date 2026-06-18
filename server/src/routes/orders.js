import express from 'express';
import { mockDB } from '../mockData.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const user = await mockDB.users.findById(req.user._id);
  if (!user.cart.length) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const items = [];
  let totalPrice = 0;

  for (const item of user.cart) {
    const product = await mockDB.products.findById(item.product);
    if (!product || product.stock < item.quantity) {
      return res
        .status(400)
        .json({ message: `Insufficient stock for ${product?.name || 'product'}` });
    }

    items.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
    });
    totalPrice += product.price * item.quantity;
  }

  const order = await mockDB.orders.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'PayPal',
    totalPrice,
    isPaid: true,
    paidAt: new Date(),
  });

  for (const item of items) {
    const product = await mockDB.products.findById(item.product);
    if (product) {
      product.stock -= item.quantity;
      await mockDB.products.findByIdAndUpdate(item.product, product);
    }
  }

  user.cart = [];
  await mockDB.users.save(user);

  res.status(201).json(order);
});

router.get('/myorders', protect, async (req, res) => {
  const orders = await mockDB.orders.find({ user: req.user._id });
  // Sort by createdAt descending
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

router.get('/:id', protect, async (req, res) => {
  const order = await mockDB.orders.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.user !== req.user._id && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(order);
});

router.get('/', protect, admin, async (req, res) => {
  const allOrders = await mockDB.orders.find({});
  
  // Populate user info
  const ordersWithUsers = await Promise.all(
    allOrders.map(async (order) => {
      const orderUser = await mockDB.users.findById(order.user);
      return {
        ...order,
        user: orderUser ? { name: orderUser.name, email: orderUser.email } : null,
      };
    })
  );
  
  // Sort by createdAt descending
  ordersWithUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(ordersWithUsers);
});

export default router;

