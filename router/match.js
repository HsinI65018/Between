const express = require('express');
const router = express.Router();
const transaction = require('../model/utility');

router.get('/', async (req, res) => {
    const sql = ["SELECT username, image, location, introduction FROM member INNER JOIN profile ON member.email = profile.user and userstatus = 1"];
    const data = await transaction(sql, []);
    // console.log(data[0])
    res.status(200).json({"data": data[0]})
});

module.exports = router;
