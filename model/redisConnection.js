const redis = require('redis');
require('dotenv').config();
const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const client = redis.createClient({
    url
});
client.connect();

module.exports = client;