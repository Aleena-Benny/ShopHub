import express from 'express';
import { mockDB } from '../mockData.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  const exists = await mockDB.users.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await mockDB.users.create({ name, email, password, isAdmin: false });
  const token = mockDB.auth.generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await mockDB.users.findOne({ email });
  
  // Simple password matching (no hashing in this mock version)
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = mockDB.auth.generateToken(user._id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

router.get('/profile', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  });
});

export default router;

