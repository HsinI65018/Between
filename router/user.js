const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isLoggedIn, googleCallBack, checkUserLogIn, userSignUp, userLogIn, userLogOut, editUserInfo } = require('../controller/user');
const pool = require('../model/connection');
const uploadToS3 = require('../controller/mutler');

const jwt = require('jsonwebtoken');

//// google oauth
router.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']})
)
router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    googleCallBack
)

//// login and register
router.get('/', isLoggedIn, checkUserLogIn)
router.post('/signup', userSignUp);
router.post('/login', userLogIn);
router.delete('/logout', userLogOut);


//// edit register info
router.post('/edit', editUserInfo);
router.post('/upload', uploadToS3.single('file'), async (req, res) => {
    // console.log(req.file)
    const fileURL = `${process.env.CLOUD_FRONT_URL}${req.file.originalname}`;
    const token = req.cookies.jwt;
    let email;

    try {
        if(token){ email = jwt.verify(token, process.env.JWT_SECRET_KEY, {algorithms: "HS256"}).email };
        if(req.user){ email = req.user.emails[0].value };

        pool.query("UPDATE member SET image = ? WHERE email = ?", [fileURL, email]);
        return res.status(200).json({"success": true, "imgURL": fileURL})
    } catch (error) {
        res.status(500).json({"success": false, "message": "error message from server"})
    }
})
router.post('/update', async (req, res) => {
    const {location, introduction, type, sex, condition} = req.body;
    const token = req.cookies.jwt;
    let email;

    try {
        if(token){ email = jwt.verify(token, process.env.JWT_SECRET_KEY, {algorithms: "HS256"}).email };
        if(req.user){ email = req.user.emails[0].value };
        // console.log(email)
        pool.query("UPDATE member SET location = ?, introduction = ?, type = ?, sex = ?, searchCondition = ?, userstatus = ? WHERE email = ?", [location, introduction, type, sex, condition, 1, email])
        return res.status(200).json({"success": true})
    } catch (error) {
        res.status(500).json({"success": false, "message": "error message from server"})
    }
})
router.get('/profile', async (req, res) => {
    const token = req.cookies.jwt;
    let email;
    
    try {
        if(token){ email = jwt.verify(token, process.env.JWT_SECRET_KEY, {algorithms: "HS256"}).email };
        if(req.user){ email = req.user.emails[0].value };

        const data = await pool.query("SELECT location, introduction, type, sex, searchCondition FROM member WHERE email = ?", [email]);
        return res.status(200).json({"success": true, "data": data[0]})
    } catch (error) {
        res.status(500).json({"success": false, "message": "error message from server"})
    }
})
// pool.query("SELECT * FROM member",(err, result) => {
//     console.log(result)
// })
module.exports = router;