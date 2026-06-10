const connection = require('../config/redis');
const pool = require('../config/db');
const logger = require('../config/logger');

const isRedisAvailable = connection !== null;

let Worker, paymentWorker;

if (isRedisAvailable) {
  const bull = require('bullmq');
  Worker = bull.Worker;

  paymentWorker = new Worker('payments', async (job) => {
    const { order_id, user_id, method, amount } = job.data;
    logger.info(`Processing payment for order ${order_id}`, { jobId: job.id });

    const db = await pool.getConnection();
    try {
      await db.beginTransaction();

      const [orders] = await db.query('SELECT * FROM orders WHERE id = ? FOR UPDATE', [order_id]);
      if (orders.length === 0) throw new Error('Order not found');
      if (orders[0].status === 'cancelled') throw new Error('Order cancelled');

      const [existing] = await db.query(
        'SELECT id FROM payments WHERE order_id = ? AND status = ?',
        [order_id, 'completed']
      );
      if (existing.length > 0) throw new Error('Order already paid');

      await db.query(
        'INSERT INTO payments (order_id, amount, method, status) VALUES (?, ?, ?, ?)',
        [order_id, amount, method, 'completed']
      );

      await db.query('UPDATE orders SET status = ? WHERE id = ?', ['confirmed', order_id]);

      await db.commit();
      logger.info(`Payment completed for order ${order_id}`);
      return { success: true, order_id };
    } catch (err) {
      await db.rollback();
      logger.error(`Payment failed for order ${order_id}`, { error: err.message });
      throw err;
    } finally {
      db.release();
    }
  }, {
    connection,
    concurrency: 5,
  });

  paymentWorker.on('failed', (job, err) => {
    logger.error(`Payment job ${job.id} failed after ${job.attemptsMade} attempts`, {
      error: err.message,
      orderId: job.data.order_id,
    });
  });
} else {
  logger.info('Payment worker disabled — Redis not available');
}

module.exports = paymentWorker || { name: 'payments', close: async () => {} };
