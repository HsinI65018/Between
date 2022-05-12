const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isLoggedIn, googleCallBack, userSignIn, userSignUp, userLogin, userLogout, editUserInfo } = require('../controller/user');
const pool = require('../model/connection');

//// google oauth
router.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']})
)
router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    googleCallBack
)

//// login and register
router.get('/', isLoggedIn, userSignIn)
router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.delete('/logout', userLogout);


//// edit register info
router.post('/edit', editUserInfo);

// pool.query("SELECT * FROM member",(err, result) => {
//     console.log(result)
// })

module.exports = router;