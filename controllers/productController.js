const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { category, min_price, max_price, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT p.*, c.name AS category_name,
               COALESCE(AVG(r.rating), 0) AS avg_rating,
               COUNT(DISTINCT r.id) AS review_count
               FROM products p
               LEFT JOIN categories c ON p.category_id = c.id
               LEFT JOIN reviews r ON p.id = r.product_id`;
    let countSql = 'SELECT COUNT(*) AS total FROM products p';
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('p.category_id = ?');
      params.push(category);
    }
    if (min_price) {
      conditions.push('p.price >= ?');
      params.push(min_price);
    }
    if (max_price) {
      conditions.push('p.price <= ?');
      params.push(max_price);
    }
    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      sql += whereClause;
      countSql += whereClause;
    }

    sql += ' GROUP BY p.id ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await pool.query(sql, params);
    const [[{ total }]] = await pool.query(countSql, conditions.length > 0 ? params.slice(0, -2) : []);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT p.*, c.name AS category_name,
       COALESCE(AVG(r.rating), 0) AS avg_rating,
       COUNT(DISTINCT r.id) AS review_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN reviews r ON p.id = r.product_id
       WHERE p.id = ?
       GROUP BY p.id`,
      [req.params.id]
    );
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(products[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image_url } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category_id || null, image_url || null]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image_url } = req.body;
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ? WHERE id = ?',
      [name, description, price, stock, category_id || null, image_url || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
