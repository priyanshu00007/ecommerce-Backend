const { Queue } = require('bullmq');
const connection = require('./redis');

const isRedisAvailable = connection !== null;

function createQueue(name, options = {}) {
  if (!isRedisAvailable) {
    const mockQueue = {
      name,
      add: async () => ({ id: 'mock', name, data: {} }),
      getJob: async () => null,
      on: () => {},
      close: async () => {},
    };
    return mockQueue;
  }
  return new Queue(name, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: { age: 86400, count: 100 },
      removeOnFail: { age: 604800, count: 50 },
      ...options,
    },
  });
}

const paymentQueue = createQueue('payments');
const emailQueue = createQueue('emails');
const inventoryQueue = createQueue('inventory');

module.exports = { paymentQueue, emailQueue, inventoryQueue };
