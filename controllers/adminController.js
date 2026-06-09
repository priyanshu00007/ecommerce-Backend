const pool = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const [[{ total_revenue, total_orders, avg_order_value }]] = await pool.query(
      `SELECT COALESCE(SUM(p.amount), 0) AS total_revenue,
              COUNT(DISTINCT o.id) AS total_orders,
              COALESCE(SUM(p.amount) / NULLIF(COUNT(DISTINCT o.id), 0), 0) AS avg_order_value
       FROM orders o
       LEFT JOIN payments p ON o.id = p.order_id AND p.status = 'completed'
       WHERE o.status != 'cancelled'`
    );

    const [[{ total_products }]] = await pool.query('SELECT COUNT(*) AS total_products FROM products');
    const [[{ total_users }]] = await pool.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_categories }]] = await pool.query('SELECT COUNT(*) AS total_categories FROM categories');

    const [recentOrders] = await pool.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at, u.name AS user_name
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC LIMIT 10`
    );

    const [topProducts] = await pool.query(
      `SELECT p.name, COALESCE(SUM(oi.quantity), 0) AS sold, COALESCE(SUM(oi.quantity * oi.price), 0) AS revenue
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
       GROUP BY p.id, p.name
       ORDER BY sold DESC LIMIT 10`
    );

    res.json({
      stats: { total_revenue, total_orders, avg_order_value, total_products, total_users, total_categories },
      recentOrders,
      topProducts
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM users');
    res.json({
      users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProductSalesReport = async (req, res) => {
  try {
    const [report] = await pool.query('CALL GetProductSalesReport()');
    res.json(report[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getDailyRevenue = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const [report] = await pool.query('CALL GetDailyRevenue(?, ?)', [start_date, end_date]);
    res.json(report[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
