const client = require('../model/redisConnection');

const SocketIo = require('../model/socket');
const Formate = require('./formatData');

const socketIo = new SocketIo();
const formate = new Formate()

const redis = require('redis');
require('dotenv').config();
const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const publisher = redis.createClient({
    // url
})
publisher.connect();
const subscriber = redis.createClient({
    // url
})
subscriber.connect();

const users = [];
function initSocket(io){
    io.on('connection', async (socket) => {
        console.log('a user connected');
        socket.on('user_connected', async (userId) => {
            // console.log('prev=',users)

            const data = await socketIo.getUserEmail(userId);
            const { email } = data[0][0]

            users[email] = socket.id;
            // console.log('users=',users)
        })

        socket.on('send_message', async (data) => {
            // console.log(data)
            const id = users[data.receiver];
            const userData = await socketIo.getUserInfo(data.sender)
            const { image, username } = userData[0][0];
            const response = formate.formateMessage(data, image, username)

            await publisher.publish(data.sender, JSON.stringify(response));

            // io.to(id).emit('new_message', response)
            

            const senderHistory = await client.hGet("message", `${data.sender}-${data.receiver}`);
            const senderHistoryList = JSON.parse(senderHistory);
            if(senderHistoryList === null){
                const initFriendList = [
                    formate.formateRedisMessage(data.sender, data.receiver, data.message, data.time)
                ]
                client.hSet("message", `${data.sender}-${data.receiver}`, JSON.stringify(initFriendList))
            }else{
                senderHistoryList.push(
                    formate.formateRedisMessage(data.sender, data.receiver, data.message, data.time)
                )
                client.hSet("message", `${data.sender}-${data.receiver}`, JSON.stringify(senderHistoryList));
            }

            const receiverHistory = await client.hGet("message", `${data.receiver}-${data.sender}`);
            const receiverHistoryList = JSON.parse(receiverHistory);
            if(receiverHistoryList === null){
                const initFriendList = [
                    formate.formateRedisMessage(data.sender, data.receiver, data.message, data.time)
                ]
                client.hSet("message", `${data.receiver}-${data.sender}`, JSON.stringify(initFriendList))
            }else{
                receiverHistoryList.push(
                    formate.formateRedisMessage(data.sender, data.receiver, data.message, data.time)
                )
                client.hSet("message", `${data.receiver}-${data.sender}`, JSON.stringify(receiverHistoryList));
            }

            await socketIo.createUserMessage(data.sender, data.receiver, data.message, data.time)
        })

        socket.on('redis', async (data) => {
            const id = users[data.receiver];
            await subscriber.subscribe(data.sender, (message, channel) => {
                console.log("Message from channel " + channel + ": " + message);
                const response = JSON.parse(message);
                console.log(response)
                io.to(id).emit('new_message', response)
            });
        })

        socket.on('disconnect', () => {
            console.log('a user disconnected');
            const email = Object.keys(users).find(key => users[key] === socket.id)
            delete users[email]
            // console.log(users)
        })
    })
}


module.exports = initSocket;