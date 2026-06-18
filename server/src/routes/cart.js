import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json(user.cart);
});

router.post('/', protect, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const user = await User.findById(req.user._id);
  const existing = user.cart.find(
    (item) => item.product.toString() === productId
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product');
  res.json(updated.cart);
});

router.put('/:productId', protect, async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.find(
    (i) => i.product.toString() === req.params.productId
  );

  if (!item) {
    return res.status(404).json({ message: 'Item not in cart' });
  }

  if (quantity <= 0) {
    user.cart = user.cart.filter(
      (i) => i.product.toString() !== req.params.productId
    );
  } else {
    item.quantity = quantity;
  }

  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product');
  res.json(updated.cart);
});

router.delete('/:productId', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    (i) => i.product.toString() !== req.params.productId
  );
  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product');
  res.json(updated.cart);
});

router.delete('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json([]);
});

export default router;
