const express = require('express');
const router = express.Router();
const { updatePending, getMatchSuccessInfo, checkMatching } = require('../controller/match')


//// add front-end like to pending
router.post('/pending', updatePending)

//// get match success data
router.get('/', getMatchSuccessInfo)

//// check if it is match
router.post('/check/pending', checkMatching)

module.exports = router;
