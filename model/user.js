const transaction = require('./utility');

class User{
    async getExistUser(email) {
        const sql = ["SELECT username FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql, value);
        return data[0]
    }

    async getUserInfo(email) {
        const sql = ["SELECT id, username, email, image, register, userstatus FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql, value);
        return data[0]
    }

    async getHashPassword(email) {
        const sql = ["SELECT password FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql, value);
        return data[0]
    }

    async getUserStatus(email) {
        const sql = ["SELECT userstatus FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql, value);
        return data[0]
    }

    async createUser(username, email, hash) {
        const sql = ["INSERT INTO member (username, email, password, register, userstatus) VALUES (?,?,?,?,?)", "INSERT INTO profile (user) VALUES (?)"];
        const value = [[username, email, hash, 'local', 0], [email]];
        await transaction(sql, value)
    }

    async createGoogleUser(username, email, image) {
        const sql = ["INSERT INTO member (username, email, image, register, userstatus) VALUES (?, ?, ?, ?, ?)", "INSERT INTO profile (user) VALUES (?)"];
        const value = [[username, email, image, 'google', 0], [email]];
        await transaction(sql, value);
    }
}
module.exports = User;