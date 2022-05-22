const transaction = require('./utility');

class Member{
    async getUserProfile(email) {
        const sql = ["SELECT location, facebook, instagram, introduction, type, sex, searchCondition FROM profile WHERE user = ?"];
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

    async updateUserProfile(location, facebook, instagram, introduction, type, sex, condition, email) {
        const sql = ["UPDATE profile SET location = ?, facebook = ?, instagram = ?, introduction = ?, type = ?, sex = ?, searchCondition = ? WHERE user = ?", "UPDATE member SET userstatus = ? WHERE email = ?"];
        const value = [[location, facebook, instagram, introduction, type, sex, condition, email], [1, email]];
        await transaction(sql ,value);
    }
}

module.exports = Member;