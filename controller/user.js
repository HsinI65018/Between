const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Response = require('./response');
const { getUserEmail } = require('../controller/auth');

const user = new User();
const response = new Response();


const isLoggedIn = (req, res, next) => {
    req.user || req.cookies.jwt? next() : res.status(403).json(response.getError("Can't get authorization"));
}

const googleCallBack = async(req, res) => {
    const username = req.user.displayName;
    const email = req.user.emails[0].value;
    const image = req.user.photos[0].value;
    try {
        const existUser = await user.getExistUser(email);
        if(existUser.length === 0){
            await user.createGoogleUser(username, email, image);
        }
    } catch (error) {
        if(error) throw error;
    }
    res.redirect('/member');
};


const checkUserLogIn = async(req, res) => {
    const email = getUserEmail(req);
    try {
        let data = await user.getUserInfo(email);
        res.status(200).json(response.getResponseSuccess(data[0]))
    } catch (error) {
        res.status(403).json(response.getError("Can't get authorization"))
    }
};


const userSignUp = async(req, res) => {
    const {username, email, password} = req.body
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const existUser = await user.getExistUser(email);

    if(existUser.length !== 0) return res.status(400).json(response.getError("This email already exist"));

    try {
        await user.createUser(username, email, hash);
        res.status(200).json(response.getSuccess())
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
};


const userLogIn = async (req, res) => {
    const {email, password} = req.body;
    try {
        const hashPassword = await user.getHashPassword(email);

        if(hashPassword[0].length === 0) return res.status(400).json(response.getError("email does not exist"));

        const hashResult = bcrypt.compareSync(password, hashPassword[0].password);
        
        if(hashResult){
            const userStatus = await user.getUserStatus(email);
            const token = jwt.sign({email: email}, process.env.JWT_SECRET_KEY, {algorithm: 'HS256'});
            res.cookie("jwt", token, {httpOnly: true})
            res.status(200).json({"success": true, "userStatus": userStatus[0]['userstatus']});
        }else{
            res.status(400).json(response.getError("please enter correct password"));
        }
    } catch (error) {
        res.status(500).json(response.getServerError());
    }
};


const userLogOut = (req, res) => {
    req.logout();
    req.session.destroy();
    res.clearCookie("jwt");
    res.status(200).json(response.getSuccess());
};


module.exports = {
    isLoggedIn,
    googleCallBack,
    checkUserLogIn,
    userSignUp,
    userLogIn,
    userLogOut
};