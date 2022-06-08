const Redis = require("ioredis");
require('dotenv').config();

const client = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

client.on("connect", () => {
    console.log("Redis Client Connected");
});

module.exports = client;