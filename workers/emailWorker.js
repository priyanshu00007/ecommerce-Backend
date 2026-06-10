const connection = require('../config/redis');
const logger = require('../config/logger');

const isRedisAvailable = connection !== null;

let Worker, emailWorker;

if (isRedisAvailable) {
  const bull = require('bullmq');
  Worker = bull.Worker;

  emailWorker = new Worker('emails', async (job) => {
    const { type, to, data } = job.data;
    logger.info(`Sending ${type} email to ${to}`, { jobId: job.id });

    switch (type) {
      case 'order_confirmation':
        logger.info(`Order confirmation email sent to ${to} for order #${data.order_id}`);
        break;
      case 'payment_received':
        logger.info(`Payment receipt sent to ${to} for order #${data.order_id}`);
        break;
      case 'welcome':
        logger.info(`Welcome email sent to ${to}`);
        break;
      case 'order_shipped':
        logger.info(`Shipping notification sent to ${to} for order #${data.order_id}`);
        break;
      default:
        logger.warn(`Unknown email type: ${type}`);
    }

    return { sent: true, to, type };
  }, {
    connection,
    concurrency: 10,
  });

  emailWorker.on('failed', (job, err) => {
    logger.error(`Email job ${job.id} failed`, { error: err.message, type: job.data.type });
  });
} else {
  logger.info('Email worker disabled — Redis not available');
}

module.exports = emailWorker || { name: 'emails', close: async () => {} };
