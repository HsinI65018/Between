const transaction = require('./utility');

class Member{
    async getUserProfile(email) {
        const sql = ["SELECT location, introduction, type, sex, searchCondition FROM profile WHERE user = ?"];
        const value = [[email]];
        const data = await transaction(sql ,value)
        return data[0]
    }

    async getUserImage(email) {
        const sql = ["SELECT image FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql ,value)
        return data[0]
    }

    async getUserStatus(email) {
        const sql = ["SELECT userstatus FROM member WHERE email = ?"];
        const value = [[email]];
        const data = await transaction(sql ,value)
        return data[0]
    }
    
    async updateUserName(data, email) {
        const sql = ["UPDATE member SET username = ?  WHERE email = ?"];
        const value = [[data, email]];
        await transaction(sql ,value);
    }

    async updateUserPassword(hash, email) {
        const sql = ["UPDATE member SET password = ?  WHERE email = ?"];
        const value = [[hash, email]];
        await transaction(sql ,value);
    }

    async updateUserImage(fileURL, email) {
        const sql = ["UPDATE member SET image = ? WHERE email = ?"];
        const value = [[fileURL, email]];
        await transaction(sql ,value);
    }

    async updateUserProfile(location, introduction, type, sex, condition, email) {
        const sql = ["UPDATE profile SET location = ?, introduction = ?, type = ?, sex = ?, searchCondition = ? WHERE user = ?"];
        const value = [[location, introduction, type, sex, condition, email]];
        await transaction(sql ,value);
    }

    async updateUserStatus(statusCode, email) {
        const sql = ["UPDATE member SET userstatus = ? WHERE email = ?"];
        const value = [[statusCode, email]];
        await transaction(sql, value)
    }

    async updateMatching(email) {
        const sql = ["DELETE FROM stp_skip WHERE user = ?", "DELETE FROM otp_skip WHERE user = ?", "DELETE FROM un_match WHERE user = ?"];
        const value = [[email], [email], [email]];
        await transaction(sql, value)
    }
}

module.exports = Member;