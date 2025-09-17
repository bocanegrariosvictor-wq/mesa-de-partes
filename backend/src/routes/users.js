const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { User } = require('../models');

// List users (admin only)
router.get('/', auth, roleCheck(['admin']), async (req, res) => {
  const users = await User.findAll({ attributes: ['id','name','email','role'] });
  res.json(users);
});

// Create user (admin)
router.post('/', auth, roleCheck(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password || 'change_me', 10);
  const user = await User.create({ name, email, passwordHash: hash, role });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// Update user (admin)
router.put('/:id', auth, roleCheck(['admin']), async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: 'No encontrado' });
  if (password) user.passwordHash = await bcrypt.hash(password, 10);
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  await user.save();
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// Delete user (admin)
router.delete('/:id', auth, roleCheck(['admin']), async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: 'No encontrado' });
  await user.destroy();
  res.json({ ok: true });
});

module.exports = router;
