require('dotenv').config();
const logger = require('../config/logger');

const paymentWorker = require('./paymentWorker');
const emailWorker = require('./emailWorker');

logger.info('Workers started');
console.log('Workers: payment, email, inventory');

process.on('SIGTERM', async () => {
  logger.info('Shutting down workers...');
  await paymentWorker.close();
  await emailWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down workers...');
  await paymentWorker.close();
  await emailWorker.close();
  process.exit(0);
});
