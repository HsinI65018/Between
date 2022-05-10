const express = require('express');
const router = express.Router();
const pool = require('../model/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('dotenv').config();
require('../controller/auth');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/user/failure' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/user/protected');
  });

router.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

router.get('/failure', (req, res) => {
  res.send('Failed to authenticate..');
});



//////////////
router.get('/', async (req, res) => {
    const token = req.cookies.jwt;
    // console.log(token)
    if(token){
        const email = jwt.verify(token, process.env.JWT_SECRET_KEY, {algorithms: "HS256"}).email;
        const data = await pool.query("SELECT id, username, email FROM member WHERE email = ?", [email]);
        return res.status(200).json({"data": data[0]})
    }else{
        return res.status(403).json({"success": false, "message": "Can't get authorization"})
    }
})

router.post('/signup', async (req, res) => {
    const {username, email, password} = req.body
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const existUser = await pool.query("SELECT email FROM member WHERE email = ?", [email]);

    if(existUser.length !== 0) return res.status(400).json({"success": false, "message": "This email already exist"});

    try {
        pool.query("INSERT INTO member (username, email, password, userstatus) VALUES (?,?,?,?)", [username, email, hash, 0]);
        res.status(200).json({"success": true})
    } catch (error) {
        //console.log(error);
        res.status(500).json({"success": false, "message": "error message from server"})
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    // console.log(email, password);
    try {
        const hashPassword = await pool.query("SELECT password FROM member WHERE email = ?", [email]);
        // console.log(hashPassword)
        if(hashPassword.length === 0) return res.status(400).json({"success": false, "message": "email does not exist"});

        const hashResult = bcrypt.compareSync(password, hashPassword[0].password);
        // console.log(hashResult)
        if(hashResult){
            const token = jwt.sign({email: email}, process.env.JWT_SECRET_KEY, {algorithm: 'HS256'});
            res.cookie("jwt", token)
            return res.status(200).json({"success": true});
        }else{
            return res.status(400).json({"success": false, "message": "please enter connecr password"});
        }
    } catch (error) {
        res.status(500).json({"success": false, "message": "error message from server"})
    }
})

router.delete('/logout', (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({"success": true})
})

module.exports = router;