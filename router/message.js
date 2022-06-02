const express = require('express');
const router = express.Router();
const transaction = require('../model/utility');
const { getUserEmail } = require('../controller/auth');
// const {EmojiButton} = require('../node_modules/@joeattardi/emoji-button')

router.get('/friend/list', async (req, res) => {
    const email = getUserEmail(req);
    const data = await transaction(["SELECT friends FROM matching WHERE user = ?"], [[email]])
    const {friends} = data[0][0];
    const friendList = JSON.parse(friends);
    const friendSet = new Set(friendList)
    const newFriendList = [...friendSet]
    const responseData = [];

    for(let i = 0; i < newFriendList.length; i++){
        const sql = ["SELECT username, image FROM member WHERE id = ?"];
        const value = [newFriendList[i]];
        const data = await transaction(sql, [value])
        const friendData = data[0][0];
        const friendInfo = {
            "id": newFriendList[i],
            "username": friendData.username,
            "image": friendData.image
        };
        responseData.push(friendInfo)
    }
    res.status(200).json({"success": true, "data": responseData})
})

module.exports = router;