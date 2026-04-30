const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PROFILE (Protected Route)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Profile data',
    user: req.user
  });
});


module.exports = router;