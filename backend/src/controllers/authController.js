const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, isUsingMySQL, getStore } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let user = null;
    const store = getStore();

    if (isUsingMySQL()) {
      const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } else {
      user = (store.users || []).find((u) => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCurrentUser = (req, res) => {
  res.json({ user: req.user });
};
