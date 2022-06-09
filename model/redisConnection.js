// const Redis = require("ioredis");
// require('dotenv').config();

// const client = new Redis({
//     // host: process.env.REDIS_HOST,
//     // port: process.env.REDIS_PORT
// });

// client.on("connect", () => {
//     console.log("Redis Client Connected");
// });
const redis = require('redis');
require('dotenv').config();
const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const client = redis.createClient({
    // url
});
client.connect();

module.exports = client;