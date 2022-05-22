const express = require('express');
const router = express.Router();
const { editUserInfo, uploadImage, updateProfile, getProfile } = require('../controller/member');
const uploadToS3 = require('../controller/mutler');


router.get('/', getProfile);
router.post('/edit', editUserInfo);
router.post('/upload', uploadToS3.single('file'), uploadImage);
router.post('/update', updateProfile);


module.exports = router;