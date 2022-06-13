const express = require('express');
const router = express.Router();
const { getUnMatchCandidate, generateMatchCandidate } = require('../controller/candidate');
const { updateUnMatchCandidate, updateMatching, updateDefaultUnMatch } = require('../controller/candidate');


router.get('/', getUnMatchCandidate)
router.post('/generate', generateMatchCandidate)
router.patch('/update', updateUnMatchCandidate)
router.delete('/refresh', updateMatching)

module.exports = router;