const Redis = require('ioredis');
const url = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(url);
module.exports = redis;
