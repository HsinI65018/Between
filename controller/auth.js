const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    req.user || req.cookies.jwt? next() : res.status(403).json(response.getError("Can't get authorization"));
}


const getUserEmail = (req) => {
    let email;
    if(req.cookies.jwt) email = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_KEY, {algorithms: "HS256"}).email;
    if(req.user) email = req.user.emails[0].value;
    return email
}

module.exports = {
    isLoggedIn,
    getUserEmail
}