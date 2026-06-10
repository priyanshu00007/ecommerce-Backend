const IORedis = require('ioredis');
require('dotenv').config();

const isConfigured = process.env.REDIS_HOST && process.env.REDIS_HOST !== 'localhost';

function createConnection() {
  if (!isConfigured) return null;

  const conn = new IORedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 1000, 5000);
    },
    lazyConnect: true,
  });

  conn.on('error', () => {});
  conn.connect().catch(() => {});

  return conn;
}

const connection = createConnection();
module.exports = connection;
