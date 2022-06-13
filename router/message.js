const express = require('express');
const router = express.Router();
const { getFriendList, getHistory, getChattingUser } = require('../controller/message')


router.get('/friend/list', getFriendList);
router.post('/history', getHistory)
router.post('/people', getChattingUser)


module.exports = router;