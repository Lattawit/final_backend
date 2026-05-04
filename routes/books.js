const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book found
 *       404:
 *         description: Book not found
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM books WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /books:
 *   post:
 *     tags: [Books]
 *     summary: Create new book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBook'
 *     responses:
 *       200:
 *         description: Book created
 */
router.post('/', async (req, res) => {
  const { title, author, genre, description, rating } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO books (title, author, genre, description, rating)
       VALUES (?, ?, ?, ?, ?)`,
      [title, author, genre, description, rating]
    );

    res.json({ message: 'Book created', id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBook'
 *     responses:
 *       200:
 *         description: Book updated
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, description, rating } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE books
       SET title=?, author=?, genre=?, description=?, rating=?
       WHERE id=?`,
      [title, author, genre, description, rating, id]
    );

    res.json({ message: 'Book updated' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM books WHERE id=?', [id]);
    res.json({ message: 'Book deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;