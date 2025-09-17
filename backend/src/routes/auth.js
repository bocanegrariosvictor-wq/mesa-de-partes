const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Create a default admin user if not exists (for demo)
(async () => {
  try {
    const admin = await User.findOne({ where: { email: 'admin@demo.local' } });
    if (!admin) {
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Admin Demo', email: 'admin@demo.local', passwordHash: hash, role: 'admin' });
      console.log('Admin user created: admin@demo.local / admin123');
    }
  } catch (e) { console.error(e); }
})();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'tu_secreto_jwt', { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

module.exports = router;
