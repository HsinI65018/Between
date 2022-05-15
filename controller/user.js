const pool = require('../model/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    req.user || req.cookies.jwt? next() : res.status(403).json({"success": false, "message": "Can't get authorization"});
}

const googleCallBack = async(req, res) => {
    const username = req.user.displayName;
    const email = req.user.emails[0].value;
    const image = req.user.photos[0].value;
    try {
        const existUser = await pool.query("SELECT username FROM member WHERE email = ?", [email]);
        if(existUser.length === 0){
            pool.query("INSERT INTO member (username, email, image, userstatus) VALUES (?,?,?,?)", [username, email, image, 0]);
        }
    } catch (error) {
        if(error) throw error;
    }
    res.redirect('/member');
};

const checkUserLogIn = async(req, res) => {
    const token = req.cookies.jwt;
    try {
        if(token){
            const email = jwt.verify(token, process.env.JWT_SECRET_KEY, {algorithms: "HS256"}).email;
            const data = await pool.query("SELECT id, username, email, image, register, userstatus FROM member WHERE email = ?", [email]);
            return res.status(200).json({"data": data[0]})
        }
        if(req.user){
            const email = req.user.emails[0].value;
            const data = await pool.query("SELECT id, username, email, image, register, userstatus FROM member WHERE email = ?", [email]);
            return res.status(200).json({"data": data[0]})
        }
    } catch (error) {
        return res.status(403).json({"success": false, "message": "Can't get authorization"})
    }
};

const userSignUp = async(req, res) => {
    const {username, email, password} = req.body
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const existUser = await pool.query("SELECT username FROM member WHERE email = ?", [email]);

    if(existUser.length !== 0) return res.status(400).json({"success": false, "message": "This email already exist"});

    try {
        pool.query("INSERT INTO member (username, email, password, userstatus) VALUES (?,?,?,?)", [username, email, hash, 0]);
        res.status(200).json({"success": true})
    } catch (error) {
        res.status(500).json({"success": false, "message": "error message from server"})
    }
};

const userLogIn = async (req, res) => {
    const {email, password} = req.body;
    try {
        const hashPassword = await pool.query("SELECT password FROM member WHERE email = ?", [email]);
        if(hashPassword.length === 0) return res.status(400).json({"success": false, "message": "email does not exist"});

        const hashResult = bcrypt.compareSync(password, hashPassword[0].password);
        if(hashResult){
            const token = jwt.sign({email: email}, process.env.JWT_SECRET_KEY, {algorithm: 'HS256'});
            res.cookie("jwt", token, {httpOnly: true})
            return res.status(200).json({"success": true});
        }else{
            return res.status(400).json({"success": false, "message": "please enter connecr password"});
        }
    } catch (error) {
        res.status(500).json({"success": false, "message": "error message from server"})
    }
};

const userLogOut = (req, res) => {
    req.logout();
    req.session.destroy();
    res.clearCookie("jwt");
    res.status(200).json({"success": true})
};

const editUserInfo = async (req, res) => {
    const {type, data, email} = req.body;
    try {
        if(type === 'username'){
            pool.query("UPDATE member SET username = ?  WHERE email = ?", [data, email]);
        }else{
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(data, salt);
            pool.query("UPDATE member SET password = ?  WHERE email = ?", [hash, email]);
        }
        return res.status(200).json({"success": true})
    } catch (error) {
        res.status(500).json({"success": false, "message": "error message from server"})
    }
};

module.exports = {
    isLoggedIn,
    googleCallBack,
    checkUserLogIn,
    userSignUp,
    userLogIn,
    userLogOut,
    editUserInfo
};