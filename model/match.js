const transaction = require('../model/utility');

class Match{
    async getUserPending(email) {
        const sql = ["SELECT pending FROM matching WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getUserMatched(email) {
        const sql = ["SELECT matched, image FROM matching INNER JOIN member ON matching.user = member.email WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getUserFriendList(email) {
        const sql = ["SELECT friends FROM matching WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getMatchSuccessInfo(id) {
        const sql = ["SELECT username, image FROM member INNER JOIN matching ON member.email = matching.user WHERE id = ?"];
        const value = [[id]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getUserChecking(email) {
        const sql = ["SELECT matched, pending, id FROM matching INNER JOIN member ON matching.user = member.email WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getCandidateChecking(id) {
        const sql = ["SELECT pending, matched, email FROM matching INNER JOIN member ON matching.user = member.email WHERE id = ?"];
        const value = [[id]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async updateUserPending(pending, email) {
        const sql = ["UPDATE matching SET pending = ? WHERE user = ?"];
        const value = [[pending, email]];
        await transaction(sql, value)
    }

    async updateUserFriendList(friend, email) {
        const sql = ["UPDATE matching SET friends = ? WHERE user = ?"];
        const value = [[friend, email]];
        await transaction(sql, value)
    }

    async updateUserMatched(matched, email) {
        const sql = ["UPDATE matching SET matched = ? WHERE user = ?"];
        const value = [[matched, email]];
        await transaction(sql, value)
    }
}

module.exports = Match;