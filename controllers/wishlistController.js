const pool = require('../config/db');

exports.getWishlist = async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT w.id, w.product_id, p.name, p.price, p.image_url, p.stock
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [req.user.id]
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { product_id } = req.body;

    const [products] = await pool.query('SELECT id FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.user.id, product_id]
    );
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM wishlist WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
