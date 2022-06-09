const transaction = require('./utility');

class SocketIo {
    async getUserEmail(id) {
        const sql = ["SELECT email FROM member WHERE id = ?"];
        const value = [[id]];
        const data = await transaction(sql, value);
        return data
    }

    async getUserInfo(email) {
        const sql = ["SELECT image, username FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql, value);
        return data
    }

    async createUserMessage(sender, receiver, message, time){
        const sql = ["INSERT INTO message (sender, receiver, message, time) VALUES (?, ?, ?, ?)"];
        const value = [[sender, receiver, message, time]];
        await transaction(sql, value);
    }
}

module.exports = SocketIo;