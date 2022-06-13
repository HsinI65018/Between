const express = require('express');
const router = express.Router();
const { updatePending, getMatchSuccessInfo, checkMatching } = require('../controller/match')


router.post('/pending', updatePending)
router.get('/', getMatchSuccessInfo)
router.post('/check/pending', checkMatching)

module.exports = router;
