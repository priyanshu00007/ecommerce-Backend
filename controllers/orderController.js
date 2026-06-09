const pool = require('../config/db');

exports.placeOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [cartItems] = await connection.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock, p.name
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        await connection.rollback();
        return res.status(400).json({
          message: `Insufficient stock for "${item.name}". Available: ${item.stock}`
        });
      }
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [order] = await connection.query(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [req.user.id, totalAmount]
    );

    const orderItems = cartItems.map(item => [
      order.insertId,
      item.product_id,
      item.quantity,
      item.price
    ]);
    await connection.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
      [orderItems]
    );

    for (const item of cartItems) {
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await connection.commit();

    res.status(201).json({
      message: 'Order placed successfully',
      order_id: order.insertId,
      total_amount: totalAmount
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    connection.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, COALESCE(p.status, 'pending') AS payment_status
       FROM orders o
       LEFT JOIN payments p ON o.id = p.order_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    const [payments] = await pool.query(
      'SELECT * FROM payments WHERE order_id = ?',
      [req.params.id]
    );

    res.json({ ...orders[0], items, payments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orders[0].status !== 'pending') {
      await connection.rollback();
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    await connection.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['cancelled', req.params.id]
    );

    const [items] = await connection.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    connection.release();
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let sql = `SELECT o.*, u.name AS user_name, u.email
               FROM orders o JOIN users u ON o.user_id = u.id`;
    const params = [];

    if (status) {
      sql += ' WHERE o.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.query(sql, params);

    const [[{ total }]] = await pool.query(
      status ? 'SELECT COUNT(*) AS total FROM orders WHERE status = ?' : 'SELECT COUNT(*) AS total FROM orders',
      status ? [status] : []
    );

    res.json({
      orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: `Order status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
