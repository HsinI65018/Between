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
        if(type === 'username') await member.updateUserName(data, email);

        if(type === 'password'){
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(data, salt);
            await member.updateUserPassword(hash, email);
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
        await member.updateUserImage(fileURL, email);
        const data = await member.getUserStatus(email);
        const userStatus = data[0]['userstatus'];
        console.log(userStatus)
        if(userStatus === 2) await member.updateUserStatus(1, email);
        res.status(200).json({"success": true, "imgURL": fileURL})
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
};


const updateProfile = async (req, res) => {
    const {location, introduction, type, sex, condition} = req.body;
    const email = getUserEmail(req);
    try {
        await member.updateUserProfile(location, introduction, type, sex, condition, email);
        await member.updateMatching(email);
        const data = await member.getUserImage(email);
        const image = data[0]['image'];
        if(image !== null) {
            await member.updateUserStatus(1, email);
        }else{
            await member.updateUserStatus(2, email);
        }
        res.status(200).json(response.getSuccess())
    } catch (error) {
        console.log(error)
        res.status(500).json(response.getServerError())
    }
};


module.exports = {
    editUserInfo,
    uploadImage,
    updateProfile,
    getProfile
};