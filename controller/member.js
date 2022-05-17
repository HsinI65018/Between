const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Member = require('../model/member');
const Response = require('./response');

const member = new Member();
const response = new Response();


const getUserEmail = (req) => {
    let email;
    if(req.cookies.jwt) email = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY, {algorithms: "HS256"}).email;
    if(req.user) email = req.user.emails[0].value;
    return email
}


const getProfile = async (req, res) => {
    const email = getUserEmail(req);
    try {
        const data = await member.getUserProfile(email);
        res.status(200).json(response.getResponseSuccess(data[0]))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
};


const editUserInfo = async (req, res) => {
    const {type, data} = req.body;
    const email = getUserEmail(req);
    try {
        if(type === 'username') member.updateUserName(data, email);

        if(type === 'password'){
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(data, salt);
            member.updateUserPassword(hash, email);
        }
        res.status(200).json(response.getSuccess())
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
};


const uploadImage = async (req, res) => {
    const fileURL = `${process.env.CLOUD_FRONT_URL}${req.file.originalname}`;
    const email = getUserEmail(req);
    try {
        member.updateUserImage(fileURL, email);
        res.status(200).json({"success": true, "imgURL": fileURL})
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
};


const updateProfile = async (req, res) => {
    const {location, introduction, type, sex, condition} = req.body;
    const email = getUserEmail(req);
    try {
        member.updateUserProfile(location, introduction, type, sex, condition, email);
        res.status(200).json(response.getSuccess())
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
};


module.exports = {
    editUserInfo,
    uploadImage,
    updateProfile,
    getProfile
};