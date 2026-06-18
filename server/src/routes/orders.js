import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const user = await User.findById(req.user._id).populate('cart.product');
  if (!user.cart.length) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const items = [];
  let totalPrice = 0;

  for (const item of user.cart) {
    const product = item.product;
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

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'PayPal',
    totalPrice,
    isPaid: true,
    paidAt: new Date(),
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  user.cart = [];
  await user.save();

  res.status(201).json(order);
});

router.get('/myorders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(order);
});

router.get('/', protect, admin, async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
