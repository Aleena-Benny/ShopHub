import express from 'express';
import { mockDB } from '../mockData.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;
  const query = {};

  if (category) query.category = category;
  if (search) query.search = search;

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    mockDB.products.find(query, skip, Number(limit)),
    mockDB.products.countDocuments(query),
  ]);

  res.json({
    products,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  });
});

router.get('/:id', async (req, res) => {
  const product = await mockDB.products.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

router.post('/', protect, admin, async (req, res) => {
  const product = await mockDB.products.create(req.body);
  res.status(201).json(product);
});

router.put('/:id', protect, admin, async (req, res) => {
  const product = await mockDB.products.findByIdAndUpdate(req.params.id, req.body);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

router.delete('/:id', protect, admin, async (req, res) => {
  const product = await mockDB.products.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ message: 'Product removed' });
});

export default router;

