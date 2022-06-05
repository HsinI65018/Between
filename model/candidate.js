const transaction = require('../model/utility');

class Candidate {
    async getUserType (email){
        const sql = ["SELECT type, sex, id FROM member INNER JOIN profile ON member.email = profile.user WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getCandidateInfo(id) {
        const sql = ["SELECT id, username, image, location, introduction FROM member INNER JOIN profile ON member.email = profile.user WHERE id = ?"];
        const value = [[id]];
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
        const sql = ["SELECT un_match FROM matching WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getUserSkip(column ,email) {
        const sql = [`SELECT ${column} FROM matching WHERE user = ?`];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async getOTPCandidateId(sex, type) {
        const sql = ["SELECT id FROM member INNER JOIN profile ON member.email = profile.user WHERE userstatus = 1 AND sex = ? AND type NOt IN (?)"];
        const value = [[sex, type]];
        const data = await transaction(sql, value)
        return data
    }

    async getUnMatchStatus(email) {
        const sql = ["SELECT un_match_status FROM matching WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql, value)
        return data[0]
    }

    async updateUserSkip(column, skip, email) {
        const sql = [`UPDATE matching SET ${column} = ? WHERE user = ?`];
        const value = [[skip, email]];
        await transaction(sql, value)
    }

    async updateUnMatch(unMatch, email) {
        const sql = ["UPDATE matching SET un_match = ? WHERE user = ?"];
        const value = [[unMatch, email]];
        await transaction(sql, value)
    }

    async updateUnMatchStatus(status, email) {
        const sql = ["UPDATE matching SET un_match_status = ? WHERE user = ?"];
        const value = [[status, email]];
        await transaction(sql, value)
    }

    async updateUserMatching(email) {
        const sql = ["UPDATE matching SET stp_skip = NULL, otp_skip = NULL, un_match = NULL , un_match_status = 0 WHERE user = ?"];
        const value = [[email]];
        await transaction(sql, value)
    }
}

module.exports = Candidate;