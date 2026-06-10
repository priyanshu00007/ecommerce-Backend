const pool = require('../config/db');
const { paymentQueue, emailQueue } = require('../config/queue');
const logger = require('../config/logger');

exports.processPayment = async (req, res) => {
  try {
    const { order_id, method } = req.body;

    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [order_id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orders[0].status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot pay for a cancelled order' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM payments WHERE order_id = ? AND status = ?',
      [order_id, 'completed']
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Order already paid' });
    }

    const job = await paymentQueue.add('process_payment', {
      order_id,
      user_id: req.user.id,
      method,
      amount: orders[0].total_amount,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });

    await emailQueue.add('order_confirmation', {
      type: 'order_confirmation',
      to: req.user.email,
      data: { order_id, amount: orders[0].total_amount },
    });

    logger.info(`Payment queued for order ${order_id}`, { jobId: job.id });

    res.json({
      message: 'Payment is being processed',
      jobId: job.id,
      order_id,
    });
  } catch (err) {
    logger.error('Payment processing error', { error: err.message });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await paymentQueue.getJob(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const state = await job.getState();
    const returnValue = job.returnvalue;
    res.json({ jobId, state, result: returnValue });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
  }
};
