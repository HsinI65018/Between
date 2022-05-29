const express = require('express');
const router = express.Router();
const transaction = require('../model/utility');
const { getUserEmail } = require('../controller/auth');

router.get('/friend/list', async (req, res) => {
    const email = getUserEmail(req);
    const sql = ["SELECT friends FROM message WHERE user = ?"];
    const value = [email];
    const data = await transaction(sql, [value])
    const {friends} = data[0][0];
    const friendList = JSON.parse(friends);
    const responseData = [];
    for(let i = 0; i < friendList.length; i++){
        const sql = ["SELECT username, image FROM member WHERE id = ?"];
        const value = [friendList[i]];
        const data = await transaction(sql, [value])
        const friendData = data[0][0];
        const friendInfo = {
            "id": friendList[i],
            "username": friendData.username,
            "image": friendData.image
        };
        responseData.push(friendInfo)
    }
    console.log(friends);
    res.status(200).json({"success": true, "data": responseData})
})

module.exports = router;