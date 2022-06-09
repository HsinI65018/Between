const express = require('express');
const router = express.Router();
const { getUnMatchCandidate, generateMatchCandidate } = require('../controller/candidate');
const { updateUnMatchCandidate, updateMatching, updateDefaultUnMatch } = require('../controller/candidate');

//// if un_match is not NULL then return un_match data
router.get('/', getUnMatchCandidate)

//// generate candidate main function
router.post('/generate', generateMatchCandidate)

//// update un_match when front-end click the button
router.patch('/update', updateUnMatchCandidate)

//// if click to the end refresh the data
router.delete('/refresh', updateMatching)

//// check default un_match to prevent un_match will not be wrong when going to another page (api called in init.js)
// router.post('/update/default', updateDefaultUnMatch)

module.exports = router;