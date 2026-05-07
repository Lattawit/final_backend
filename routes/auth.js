const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', async (req, res) => {
  const { fname, lname, username, email, password } = req.body;

  if (!fname || fname.length < 1 || fname.length > 100)
    return res.status(400).json({ message: 'Invalid fname' });

  if (!lname || lname.length < 1 || lname.length > 100)
    return res.status(400).json({ message: 'Invalid lname' });

  if (!username || !/^[a-z0-9_]{3,50}$/.test(username))
    return res.status(400).json({ message: 'Invalid username' });

  if (!email)
    return res.status(400).json({ message: 'Invalid email' });

  if (!password || password.length < 8)
    return res.status(400).json({ message: 'Password must be at least 8 characters' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (fname, lname, username, email, password)
       VALUES (?, ?, ?, ?, ?)`,
      [fname, lname, username, email, hashedPassword]
    );

    res.json({ message: 'User registered', id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login success
 *       401:
 *         description: Unauthorized
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fname: user.fname,
        lname: user.lname,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags: [Authentication]
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, fname, lname, username, email, profile_image FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;