const pool = require('./utility');

class User{
    getExistUser(email) {
        const data = pool.query("SELECT username FROM member WHERE email = ?", [email]);
        return data
    }

    getUserInfo(email) {
        const data = pool.query("SELECT id, username, email, image, register, userstatus FROM member WHERE email = ?", [email]);
        return data
    }

    getHashPassword(email) {
        const data = pool.query("SELECT password FROM member WHERE email = ?", [email]);
        return data
    }

    getUserStatus(email) {
        const data = pool.query("SELECT userstatus FROM member WHERE email = ?", [email]);
        return data
    }

    createUser(username, email, hash) {
        pool.query("INSERT INTO member (username, email, password, register, userstatus) VALUES (?,?,?,?)", [username, email, hash, 'local', 0]);
        pool.query("INSERT INTO profile (user) VALUES (?)", [email]);
    }

    createGoogleUser(username, email, image) {
        pool.query("INSERT INTO member (username, email, image, register, userstatus) VALUES (?,?,?,?)", [username, email, image, 'google', 0]);
        pool.query("INSERT INTO profile (user) VALUES (?)", [email]);
    }
}

module.exports = User;