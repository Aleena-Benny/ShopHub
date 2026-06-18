import express from 'express';
import { mockDB } from '../mockData.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const user = await mockDB.users.findById(req.user._id);
  
  // Populate cart with product details
  const cartWithProducts = user.cart.map((item) => {
    const product = item.product || item.productId;
    return {
      product,
      quantity: item.quantity,
    };
  });
  
  res.json(cartWithProducts);
});

router.post('/', protect, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await mockDB.products.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const user = await mockDB.users.findById(req.user._id);
  const existing = user.cart.find((item) => item.product === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await mockDB.users.save(user);
  
  // Populate cart with product details
  const cartWithProducts = user.cart.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
  
  res.json(cartWithProducts);
});

router.put('/:productId', protect, async (req, res) => {
  const { quantity } = req.body;
  const user = await mockDB.users.findById(req.user._id);
  const item = user.cart.find((i) => i.product === req.params.productId);

  if (!item) {
    return res.status(404).json({ message: 'Item not in cart' });
  }

  if (quantity <= 0) {
    user.cart = user.cart.filter((i) => i.product !== req.params.productId);
  } else {
    item.quantity = quantity;
  }

  await mockDB.users.save(user);
  
  // Populate cart with product details
  const cartWithProducts = user.cart.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
  
  res.json(cartWithProducts);
});

router.delete('/:productId', protect, async (req, res) => {
  const user = await mockDB.users.findById(req.user._id);
  user.cart = user.cart.filter((i) => i.product !== req.params.productId);
  
  await mockDB.users.save(user);
  
  // Populate cart with product details
  const cartWithProducts = user.cart.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
  
  res.json(cartWithProducts);
});

router.delete('/', protect, async (req, res) => {
  const user = await mockDB.users.findById(req.user._id);
  user.cart = [];
  await mockDB.users.save(user);
  res.json([]);
});

export default router;

