const pool = require('../config/db');

exports.processPayment = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { order_id, method } = req.body;

    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [order_id, req.user.id]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orders[0].status === 'cancelled') {
      await connection.rollback();
      return res.status(400).json({ message: 'Cannot pay for a cancelled order' });
    }

    const [existing] = await connection.query(
      'SELECT id FROM payments WHERE order_id = ? AND status = ?',
      [order_id, 'completed']
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Order already paid' });
    }

    await connection.query(
      'INSERT INTO payments (order_id, amount, method, status) VALUES (?, ?, ?, ?)',
      [order_id, orders[0].total_amount, method, 'completed']
    );

    await connection.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['confirmed', order_id]
    );

    await connection.commit();
    res.json({ message: 'Payment successful', order_id });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    connection.release();
  }
};

exports.getPaymentByOrder = async (req, res) => {
  try {
    const [payments] = await pool.query(
      'SELECT * FROM payments WHERE order_id = ?',
      [req.params.orderId]
    );
    if (payments.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payments[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
