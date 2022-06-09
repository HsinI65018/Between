const transaction = require('./utility');

class Message {
    async getFriendList(email) {
        const sql = ["SELECT friend FROM friend WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql ,value)
        return data[0]
    }

    async getFriendListInfo(id) {
        const sql = ["SELECT username, image FROM member WHERE id = ?"];
        const value = [[id]];
        const data = await transaction(sql ,value)
        return data[0]
    }

    async getHistory(sender, receiver) {
        const sql = ["SELECT sender, receiver, message, time FROM message WHERE sender = ? AND receiver = ? OR sender = ? AND receiver = ?"];
        const value = [[sender, receiver, receiver, sender]];
        const data = await transaction(sql ,value)
        return data[0]
    }

    async getHistoryUser(email) {
        const sql = ["SELECT image, username FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql ,value)
        return data[0]
    }

    async getUserInfo(id) {
        const sql = ["SELECT username, email, image FROM member WHERE id = ?"];
        const value = [[id]];
        const data = await transaction(sql ,value)
        return data[0]
    }

    async getFriendInfo(id) {
        const sql = ["SELECT email FROM member WHERE id = ?"];
        const value = [[id]];
        const data = await transaction(sql ,value)
        return data[0]
    }
}

module.exports = Message;