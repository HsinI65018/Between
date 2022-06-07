const { getUserEmail } = require('../controller/auth');
const Message = require('../model/message');
const Response = require('./response');

const message = new Message();
const response = new Response();

// const Redis = require('ioredis')
// const redis = new Redis({
//     port: 6379,
//     host: 'between.jyncx8.ng.0001.apse1.cache.amazonaws.com:6379',
//     connectTimeout: 10000
// });

// redis.on('error', function (error) {
//     console.log(error)
//   })

// redis.set("mykey", "value");

// redis.get("mykey").then((result) => {
//     console.log(result); // Prints "value"
// });

const getFriendList = async (req, res) => {
    const email = getUserEmail(req);
    try {
        const data = await message.getFriendList(email)
        const friendList = [];
        data.map((item) => {
            friendList.push(item.friend)
        })
        const friendSet = new Set(friendList)
        const newFriendList = [...friendSet]
        const responseData = [];
        for(let i = 0; i < newFriendList.length; i++){
            const data = await message.getFriendListInfo(newFriendList[i])
            const friendData = data[0];
            const friendInfo = {
                "id": newFriendList[i],
                "username": friendData.username,
                "image": friendData.image
            };
            responseData.push(friendInfo)
        }
        res.status(200).json(response.getResponseSuccess(responseData))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
}


const getHistory = async (req, res) => {
    const { sender, receiver } = req.body;
    try {
        const data = await message.getHistory(sender, receiver);
        const messages = data;
        // console.log(message)
        const senderData = await message.getHistoryUser(sender);
        const receiverData = await message.getHistoryUser(receiver);
        // console.log(imgData[0])
        const imgResponse = {};
        imgResponse[sender] = senderData[0];
        imgResponse[receiver] = receiverData[0];
        // console.log('re=',imgResponse)
        res.status(200).json(response.getOthereSuccess(imgResponse, messages))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
    
}


const getChattingUser = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const data = await message.getUserInfo(userId);
        const { username, email, image } = data[0]

        const friendData = await message.getFriendInfo(friendId)
        const friendEmail = friendData[0]['email']

        const responseData = {
            'sender': email,
            'username': username,
            'image': image,
            'receiver': friendEmail
        }
        res.status(200).json(response.getResponseSuccess(responseData))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
    
}


module.exports = {
    getFriendList,
    getHistory,
    getChattingUser
}