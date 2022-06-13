const { getUserEmail } = require('../controller/auth');
const client = require('../model/redisConnection')
const Message = require('../model/message');
const Response = require('./response');

const message = new Message();
const response = new Response();


// client.hget("image", "nancy@gmail.com-leo@gmail.com", (err, result) => {
//     const re = JSON.parse(result)
//     console.log(re);
// })
const updateRedisFriend = async (email) => {
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
    client.hSet("friends", email, JSON.stringify(responseData));
    return responseData
}


const getFriendList = async (req, res) => {
    const email = getUserEmail(req);
    try {
        const redisData = await client.hGet("friends", email, async (error, result) => {
            if(error){
                const responseData = await updateRedisFriend(email)
                return res.status(200).json(response.getResponseSuccess(responseData))
            }else{
                return result;
            }
        });
        if(redisData === null){
            const responseData = await updateRedisFriend(email)
            return res.status(200).json(response.getResponseSuccess(responseData))
        }
        const responseData = JSON.parse(redisData);
        res.status(200).json(response.getResponseSuccess(responseData))
    } catch (error) {
        console.log(error)
        res.status(500).json(response.getServerError())
    }
}


const getHistoryFromDB = async (sender, receiver) => {
    const data = await message.getHistory(sender, receiver);
    const messages = data;

    const senderData = await message.getHistoryUser(sender);
    const receiverData = await message.getHistoryUser(receiver);

    const imgResponse = {};
    imgResponse[sender] = senderData[0];
    imgResponse[receiver] = receiverData[0];

    return {
        "messages": messages,
        "imgResponse": imgResponse
    }
}

const updateRedisImage = async (sender, receiver) => {
    const senderData = await message.getHistoryUser(sender);
    const receiverData = await message.getHistoryUser(receiver);

    const imgResponse = {};
    imgResponse[sender] = senderData[0];
    imgResponse[receiver] = receiverData[0];
    return imgResponse
}

const getHistory = async (req, res) => {
    const { sender, receiver } = req.body;
    try {
        const messagesData = await client.hGet("message", `${sender}-${receiver}`, async (error, result) => {
            if(error){
                const { imgResponse, messages } =  await getHistoryFromDB(sender, receiver);
                client.hSet("message", `${sender}-${receiver}`, JSON.stringify(messages));
                return res.status(200).json(response.getOthereSuccess(imgResponse, messages))
            }else{
                return result
            }
        });
        if(messagesData === null){
            const { imgResponse, messages } =  await getHistoryFromDB(sender, receiver);
            client.hSet("message", `${sender}-${receiver}`, JSON.stringify(messages));
            return res.status(200).json(response.getOthereSuccess(imgResponse, messages))
        }
        const messages = JSON.parse(messagesData)

        const imgData = await client.hGet("image", `${sender}-${receiver}`, async (error, result) => {
            if(error){
                const imgResponse = await updateRedisImage(sender, receiver);
                client.hSet("image", `${sender}-${receiver}`, JSON.stringify(imgResponse));
                return res.status(200).json(response.getOthereSuccess(imgResponse, messages))
            }else{
                return result
            }
        });
        if(imgData === null){
            const imgResponse = await updateRedisImage(sender, receiver)
            client.hSet("image", `${sender}-${receiver}`, JSON.stringify(imgResponse));
            return res.status(200).json(response.getOthereSuccess(imgResponse, messages))
        }
        const imgResponse = JSON.parse(imgData)
        res.status(200).json(response.getOthereSuccess(imgResponse, messages))
    } catch (error) {
        console.log(error)
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
        console.log(error)
        res.status(500).json(response.getServerError())
    }
    
}


module.exports = {
    getFriendList,
    getHistory,
    getChattingUser
}