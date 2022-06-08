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

const getFriendList = async (req, res) => {
    const email = getUserEmail(req);
    try {
        const data = await client.hget("friends", email, async (error, result) => {
            if(error){
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
                return res.status(200).json(response.getResponseSuccess(responseData))
            }else{
                return JSON.parse(result);
            }
        });
        const responseData = JSON.parse(data);
        res.status(200).json(response.getResponseSuccess(responseData))
    } catch (error) {
        console.log(error)
        res.status(500).json(response.getServerError())
    }
}


const getHistoryFromDB = async (sender, receiver) => {
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
    return {
        "messages": messages,
        "imgResponse": imgResponse
    }
}

const getHistory = async (req, res) => {
    const { sender, receiver } = req.body;
    try {
        // const messagesData = await client.hget("message", `${sender}-${receiver}`, async (error, result) => {
        //     if(error){
        //         const { imgResponse, messages } =  await getHistoryFromDB(sender, receiver);
        //         res.status(200).json(response.getOthereSuccess(imgResponse, messages))
        //     }else{
        //         return result
        //     } 
        // });
        
        // const imgData = await client.hget("image", `${sender}-${receiver}`, async (error, result) => {
        //     if(error){
        //         const { imgResponse, messages } =  await getHistoryFromDB(sender, receiver);
        //         res.status(200).json(response.getOthereSuccess(imgResponse, messages))
        //     }else{
        //         return result
        //     }
        // });

        // const messages = JSON.parse(messagesData)
        // const imgResponse = JSON.parse(imgData);

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
        res.status(500).json(response.getServerError())
    }
    
}


module.exports = {
    getFriendList,
    getHistory,
    getChattingUser
}