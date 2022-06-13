const transaction = require('./utility');

class Match{
    ////
    async getHistoryUser(email) {
        const sql = ["SELECT image, username FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql ,value)
        return data[0]
    }
    
    async getUserImage(email) {
        const sql = ["SELECT image FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0][0]
    }

    async getUserId(email) {
        const sql = ["SELECT id FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0][0]
    }

    async getUserPending(email) {
        const sql = ["SELECT pending FROM pending WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data
    }

    async getCandidatePending(id) {
        const sql = ["SELECT user, pending FROM pending INNER JOIN member ON pending.user = member.email WHERE id = ?"];
        const value = [[id]];
        const data = await transaction(sql, value)
        return data
    }

    async getUserMatch(email) {
        const sql = ["SELECT matched FROM matched WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data
    }

    async getMatchSuccessInfo(id) {
        const sql = ["SELECT username, image, email FROM member WHERE id = ?"];
        const value = [[id]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async createUserPrnding(email, id) {
        const sql = ["INSERT INTO pending (user, pending) VALUES (?, ?)"];
        const value = [[email, id]];
        await transaction(sql, value)
    }

    async createUserFriend(email, id) {
        const sql = ["INSERT INTO friend (user, friend) VALUES (?, ?)"];
        const value = [[email, id]];
        await transaction(sql, value)
    }

    async createUserMatch(email, id){
        const sql = ["INSERT INTO matched (user, matched) VALUES (?, ?)"];
        const value = [[email, id]];
        await transaction(sql, value)
    }

    async deleteUserMatch(email, id) {
        const sql = ["DELETE FROM matched WHERE user = ? AND matched = ?"];
        const value = [[email, id]];
        await transaction(sql, value)
    }

    async deleteUserPending(email, id) {
        const sql = ["DELETE FROM pending WHERE user = ? AND pending = ?"];
        const value = [[email, id]];
        await transaction(sql, value)
    }
}

module.exports = Match;