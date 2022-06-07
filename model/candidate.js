const transaction = require('./utility');

class Candidate {
    async getCandidateInfo(id) {
        const sql = ["SELECT id, username, image, location, introduction FROM member INNER JOIN profile ON member.email = profile.user WHERE id = ?"];
        const value = [[id]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getUserType (email){
        const sql = ["SELECT type, sex, id FROM member INNER JOIN profile ON member.email = profile.user WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getSTPCandidateId(sex, type) {
        const sql = ["SELECT id FROM member INNER JOIN profile ON member.email = profile.user WHERE userstatus = 1 AND sex = ? AND type = ?"];
        const value = [[sex, type]];
        const data = await transaction(sql, value)
        return data
    }

    async getUserUnMatch(email) {
        const sql = ["SELECT un_match FROM un_match WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getUserSkip(table ,email) {
        const sql = [`SELECT skip FROM ${table} WHERE user = ?`];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data
    }

    async getOTPCandidateId(sex, type) {
        const sql = ["SELECT id FROM member INNER JOIN profile ON member.email = profile.user WHERE userstatus = 1 AND sex = ? AND type NOt IN (?)"];
        const value = [[sex, type]];
        const data = await transaction(sql, value)
        return data
    }

    async createUserSkip(table, email, id) {
        const sql = [`INSERT INTO ${table} (user, skip) VALUES (?, ?)`];
        const value = [[email, id]];
        await transaction(sql, value)
    }

    async createUserUnMatch(email, id) {
        const sql = ["INSERT INTO un_match (user, un_match) VALUES (?, ?)"];
        const value = [[email, id]];
        await transaction(sql, value)
    }

    async deleteUserUnMatch(email, id) {
        const sql = ["DELETE FROM un_match WHERE user = ? AND un_match = ?"];
        const value = [[email, id]];
        await transaction(sql, value)
    }

    async deleteAll(table, email) {
        const sql = [`DELETE FROM ${table} WHERE user = ?`];
        const value = [[email]];
        await transaction(sql, value)
    }
}

module.exports = Candidate;