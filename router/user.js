const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isLoggedIn, googleCallBack, checkUserLogIn, userSignUp, userLogIn, userLogOut } = require('../controller/user');


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


module.exports = router;