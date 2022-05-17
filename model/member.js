const pool = require('./utility');

class Member{
    getUserProfile(email) {
        const data = pool.query("SELECT location, introduction, type, sex, searchCondition FROM profile WHERE user = ?", [email]);
        return data
    }
    
    updateUserName(data, email) {
        pool.query("UPDATE member SET username = ?  WHERE email = ?", [data, email]);
    }

    updateUserPassword(hash, email) {
        pool.query("UPDATE member SET password = ?  WHERE email = ?", [hash, email]);
    }

    updateUserImage(fileURL, email) {
        pool.query("UPDATE member SET image = ? WHERE email = ?", [fileURL, email]);
    }

    updateUserProfile(location, introduction, type, sex, condition, email) {
        pool.query("UPDATE profile SET location = ?, introduction = ?, type = ?, sex = ?, searchCondition = ? WHERE user = ?", [location, introduction, type, sex, condition, email]);
        pool.query("UPDATE member SET userstatus = ? WHERE email = ?", [1, email]);
    }
}

module.exports = Member;