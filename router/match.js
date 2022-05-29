const express = require('express');
const router = express.Router();
const transaction = require('../model/utility');
const { isLoggedIn, getUserEmail } = require('../controller/auth');

//// choose random candicate
const randomCandidate = async (initData, page, skipList, column, email) => {
    let responseData;
    const randomList = [];

    // make random number
    while(randomList.length < page){
        let num = Math.floor(Math.random() * initData.length);
        if(randomList.includes(num)) continue;
        randomList.push(num);
    }
    // console.log('randomList=',randomList)

    // select random person
    const selectList = [];
    for(let i = 0; i < randomList.length; i++){
        selectList.push(initData[randomList[i]].id);
        skipList.push(initData[randomList[i]].id);
    }
    // console.log('selectList=',selectList)
    // console.log('new-unSkip=', skipList)

    // update random peson to db
    await updateSkipCandidate(column, skipList, email);

    responseData = await getCandidateInfo(selectList);
    return responseData
}


//// update stp_skip or otp_skip
const updateSkipCandidate = async (column, skipList, email) => {
    const sql = [`UPDATE matching SET ${column} = ? WHERE user = ?`];
    // console.log(skipList.toString())
    const skipStr = "[" + skipList.toString() + "]";
    // console.log(typeof(skipStr))
    const value = [skipStr, email];
    await transaction(sql, [value]);
}


//// get user matching info
const getCandidateInfo = async (selectList) => {
    const responseData = [];
    for(let i = 0; i < selectList.length; i++){
        const sql = ["SELECT id, username, image, location, introduction FROM member INNER JOIN profile ON member.email = profile.user WHERE id = ?"];
        const value = [selectList[i]];
        const data = await transaction(sql, [value]);
        responseData.push(data[0][0]);
    }
    return responseData
}


//// check if the column un_match is not NULL
const checkPendingMatch = async (selectData) => {
    const selectDataList = JSON.parse(selectData[0][0]['un_match'])
    // console.log('selectDataList=', selectDataList)
    const responseData = await getCandidateInfo(selectDataList)
    return responseData
}


//// find candicate in opposite type
const optController = async (email, sexOption, type) => {
    let responseData;

    const sql = ["SELECT id FROM member INNER JOIN profile ON member.email = profile.user WHERE userstatus = 1 AND sex = ? AND type NOt IN (?)"];
    const value = [sexOption, type]
    const initData = await transaction(sql, [value]);
    const skip = await transaction(["SELECT otp_skip FROM matching WHERE user = ?"], [[email]]);

    if(skip[0][0]['otp_skip'] === null){
        console.log('first time otp')
        const skipList = [];
        if(initData[0].length < 20){
            responseData = await randomCandidate(initData[0], initData[0].length, skipList, 'otp_skip', email)
        }else{
            responseData = await randomCandidate(initData[0], 10, skipList, 'otp_skip', email)
        }
    }else{
        const skipList = JSON.parse(skip[0][0]['otp_skip']);

        let newArr = initData[0]
        for(let i = 0; i < skipList.length; i++){
            newArr = newArr.filter((item) => item.id !== skipList[i])
        }

        if(newArr.length === 0){
            console.log('no opt data');
            responseData = null;
            return responseData
        }

        if(newArr.length < 20){
            responseData = await randomCandidate(newArr, newArr.length, skipList, 'otp_skip', email)
            return responseData
        }

        responseData = await randomCandidate(newArr, 10, skipList, 'otp_skip', email)
    }
    return responseData
} 

//// ROUTER!!!!!!

//// if un_match is not NULL then return un_match data
router.get('/candidate', async (req, res) => {
    const email = getUserEmail(req);
    const selectData = await transaction(["SELECT un_match FROM matching WHERE user = ?"], [[email]]);
    if(selectData[0][0]['un_match']){
        let responseData = await checkPendingMatch(selectData);
        return res.status(200).json({"data": responseData})
    };
    return res.status(200).json({"data": null})
})


//// generate candidate main function
router.post('/generate', isLoggedIn, async (req, res) => {
    const email = getUserEmail(req);
    const typeData = await transaction(["SELECT type, sex FROM profile WHERE user = ?"], [email]);
    const {type, sex} = typeData[0][0];

    if(sex === 'Male'){
        sexOption = 'Female';
    }else if(sex === 'Female'){
        sexOption = 'Male';
    }else{
        sexOption = 'Bisexual';
    }

    let responseData;

    const sql = ["SELECT id FROM member INNER JOIN profile ON member.email = profile.user WHERE userstatus = 1 AND sex = ? AND type = ?"];
    const value = [sexOption, type]
    const initData = await transaction(sql, [value]);
    const skip = await transaction(["SELECT stp_skip FROM matching WHERE user = ?"], [[email]])
    // console.log('init-data=',initData[0])
    // console.log('init-skip=',skip)

    if(skip[0][0]['stp_skip'] === null){
        console.log('first time')
        const skipList = [];
        if(initData[0].length < 20){
            responseData = await randomCandidate(initData[0], initData[0].length, skipList, 'stp_skip', email);
        }else{
            responseData = await randomCandidate(initData[0], 10, skipList, 'stp_skip', email)
        }
    }else{
        // console.log(skip)
        // console.log('skip=',skip[0][0]['stp_skip'])
        const skipList = JSON.parse(skip[0][0]['stp_skip']);

        let newArr = initData[0]
        for(let i = 0; i < skipList.length; i++){
            newArr = newArr.filter((item) => item.id !== skipList[i])
        }
        // console.log('newArr=',newArr)

        /// HERE!!!!
        if(newArr.length === 0){
            console.log('no data');
            responseData = await optController(email, sexOption, type);
            return res.status(200).json({"type":type, "data": responseData})
        }

        if(newArr.length < 20){
            // console.log('Hello');
            responseData = await randomCandidate(newArr, newArr.length, skipList, 'stp_skip', email);
            return res.status(200).json({"type":type, "data": responseData})
        }

        responseData = await randomCandidate(newArr, 10, skipList, 'stp_skip', email)
    }
    // console.log('responseData=', responseData)
    res.status(200).json({"type":type, "data": responseData})
});


//// update un_match when front-end click the button
router.patch('/update', async (req, res) => {
    const email = getUserEmail(req);
    const {data} = req.body;
    const selectList = [];
    data.map((item) => {selectList.push(item.id)});
    const selectStr = "[" + selectList.toString() + "]";
    const sql = ["UPDATE matching SET un_match = ? WHERE user = ?"];
    const value = [selectStr, email];
    await transaction(sql, [value]);
    await transaction(["UPDATE matching SET un_match_status = 1 WHERE user = ?"], [[email]])
    res.status(200).json({"success": true})
})


//// if click to the end refresh the data
router.delete('/refresh', async (req, res) => {
    const email = getUserEmail(req);
    await transaction(["UPDATE matching SET stp_skip = NULL, otp_skip = NULL, un_match = NULL , un_match_status = 0 , pending = NULL WHERE user = ?"], [email]);
    res.status(200).json({"success": true})
})


//// [FIX!!!!!!!!!]
//// check default un_match to prevent un_match will not be wrong when going to another page (api called in init.js)
router.post('/update/default', async (req, res) => {
    const email = getUserEmail(req);

    const data = await transaction(["SELECT un_match_status FROM matching WHERE user = ?"], [email]);
    const unMatchStatus = data[0][0]['un_match_status'];
    // console.log('test!!!!!!!!!',unMatchStatus)

    if(unMatchStatus === 0){
        const sql = ["SELECT un_match FROM matching WHERE user = ?"];
        const value = [email];
        const data = await transaction(sql, value);
        const unMatch = data[0][0]['un_match'];

        if(unMatch === null || unMatch === []){
            await transaction(["UPDATE matching SET stp_skip = NULL, otp_skip = NULL, un_match = NULL WHERE user = ?"], [email]);
        }else{
            let unMatchList = JSON.parse(unMatch);
            unMatchList = unMatchList.slice(1);
            // console.log(unMatchList)
            const unMatchStr = "[" + unMatchList.toString() + "]";
            await transaction(["UPDATE matching SET un_match = ? WHERE user = ?"], [[unMatchStr, email]]);
        }
    }else{
        await transaction(["UPDATE matching SET un_match_status = 0 WHERE user = ?"], [email])
    }
    res.status(200).json({"success": true})
})



//// match part


//// add front-end like to pending
router.post('/pending', async (req, res) => {
    const email = getUserEmail(req);
    let {pendingList} = req.body;
    // console.log(pendingList)
    const data = await transaction(["SELECT pending FROM matching WHERE user = ?"], [[email]]);
    // console.log('data[0][0]=',data[0][0])
    if(data[0][0]['pending'] !== null){
        const newPending = JSON.parse(data[0][0]['pending']);
        for(let i = 0; i < pendingList.length; i++){
            newPending.push(Number(pendingList[i]))
        }
        pendingList = newPending
    }
    const pendingStr = "[" + pendingList.toString() + "]";
    await transaction(["UPDATE matching SET pending = ? WHERE user = ?"], [[pendingStr, email]]);
    res.status(200).json({"success": true, "message": "add pending"})
})


router.get('/', async (req, res) => {
    const email = getUserEmail(req);
    const sql = ["SELECT matched, image FROM matching INNER JOIN member ON matching.user = member.email WHERE user = ?"];
    const value = [email];
    const data = await transaction(sql, [value]);
    const {matched, image} = data[0][0]
    console.log(matched)

    let responseData = null;
    
    if(matched !== '[0]'){
        const matchedList = JSON.parse(matched)
        const data = await transaction(["SELECT email FROM member WHERE id = ?"], [[matchedList[1]]]);
        // const data = await transaction(["SELECT email FROM member WHERE id = ?"], [[matched]]);
        const matchEmail = data[0][0]['email'];

        // await transaction(["UPDATE matching SET matched_status = 1 WHERE user = ?"], [[email]]);
        // await transaction(["UPDATE matching SET matched_status = 1 WHERE user = ?"], [[matchEmail]]);

        const friendData = await transaction(["SELECT friends FROM message WHERE user = ?"], [[email]]);
        const {friends} = friendData[0][0];

        if(friends === null){
            const friendList = [];
            // friendList.push(matched);
            friendList.push(matchedList[1]);
            const friendsStr = "[" + friendList.toString() + "]";
            await transaction(["UPDATE message SET friends = ? WHERE user = ?"], [[friendsStr, email]])
        }else{
            const friendList = JSON.parse(friends);
            // friendList.push(matched)
            friendList.push(matchedList[1]);
            const friendsStr = "[" + friendList.toString() + "]";
            await transaction(["UPDATE message SET friends = ? WHERE user = ?"], [[friendsStr, email]])
        }

        const sql = ["SELECT username, image FROM member INNER JOIN matching ON member.email = matching.user WHERE id = ?"];
        // const value = [matched]
        const value = [matchedList[1]]
        const matchData = await transaction(sql, [value])
        // console.log(data)
        responseData = {
            "matchUser": matchData[0][0]['username'],
            "matchImage": matchData[0][0]['image'],
            "image": image
        }

        // await transaction(["UPDATE matching SET matched = NULL WHERE user = ?"], [[email]]);
        const newMatch = JSON.parse(matched)
        newMatch.splice(1, 1)
        console.log(newMatch)
        const newStr = "[" + newMatch.toString() + "]";
        console.log('test=',newStr)
        await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[newStr, email]])
    }
    return res.status(200).json({"success": true, "responseData": responseData})
})


//// check if it is match
router.post('/check/pending', async (req, res) => {
    const email = getUserEmail(req);
    const sql = ["SELECT matched, pending, id FROM matching INNER JOIN member ON matching.user = member.email WHERE user = ?"];
    const value = [email];
    const data = await transaction(sql, [value]);
    const {matched, pending, id} = data[0][0]
    // console.log(matched)

   
    const pendingList = JSON.parse(pending);
    let updatePendingList;
    let updatePendingUser;
    
    if(pendingList !== null){
        for(let i = 0; i < pendingList.length; i++){
            const sql = ["SELECT pending, matched FROM matching INNER JOIN member ON matching.user = member.email WHERE id = ?"];
            const value = [pendingList[i]]
            const data = await transaction(sql, [value])
            const pending = data[0][0]['pending'];
            const hisMatched = data[0][0]['matched'];

            const pendingUser = JSON.parse(pending)
            const tt = JSON.parse(hisMatched)
        
            if(pendingUser !== null && pendingUser.includes(id)){
                console.log('match!!!')
                const data = await transaction(["SELECT email FROM member WHERE id = ?"], [[pendingList[i]]]);
                const matchEmail = data[0][0]['email']

                const my = JSON.parse(matched);
                const other = JSON.parse(hisMatched);

                my.push([pendingList[i]]);
                other.push(id);

                const mystr =  "[" + my.toString() + "]";
                const otherstr =  "[" + other.toString() + "]";

                await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[mystr, email]]);
                await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[otherstr, matchEmail]]);

                // await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[pendingList[i], email]]);
                // await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[id, matchEmail]]);

                updatePendingList = pendingList.filter((item) => item !== pendingList[i])
                const updatePendingStr = "[" + updatePendingList.toString() + "]";
                await transaction(["UPDATE matching SET pending = ? WHERE user = ?"], [[updatePendingStr, email]])

                updatePendingUser = pendingUser.filter((item) => item !== id)
                const updatePendingUserStr = "[" + updatePendingUser.toString() + "]";
                await transaction(["UPDATE matching SET pending = ? WHERE user = ?"], [[updatePendingUserStr, matchEmail]])

                break
            }else if(tt !== null && tt.includes(id)){
                console.log('match!!!')
                const data = await transaction(["SELECT email FROM member WHERE id = ?"], [[pendingList[i]]]);
                const matchEmail = data[0][0]['email']

                const my = JSON.parse(matched);
                const other = JSON.parse(hisMatched);

                my.push([pendingList[i]]);
                other.push(id);

                const mystr =  "[" + my.toString() + "]";
                const otherstr =  "[" + other.toString() + "]";

                await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[mystr, email]]);
                await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[otherstr, matchEmail]]);

                updatePendingList = pendingList.filter((item) => item !== pendingList[i])
                const updatePendingStr = "[" + updatePendingList.toString() + "]";
                await transaction(["UPDATE matching SET pending = ? WHERE user = ?"], [[updatePendingStr, email]])

                updatePendingUser = pendingUser.filter((item) => item !== id)
                const updatePendingUserStr = "[" + updatePendingUser.toString() + "]";
                await transaction(["UPDATE matching SET pending = ? WHERE user = ?"], [[updatePendingUserStr, matchEmail]])

                break
            }

            /*if(matchStatus === 1){
                console.log('no match')
                break
            }else{
                const pendingUser = JSON.parse(pending)
                const tt = JSON.parse(hisMatched)
            
                if(pendingUser !== null && pendingUser.includes(id)){
                    console.log('match!!!')
                    const data = await transaction(["SELECT email FROM member WHERE id = ?"], [[pendingList[i]]]);
                    const matchEmail = data[0][0]['email']

                    const my = JSON.parse(matched);
                    const other = JSON.parse(hisMatched);

                    my.push([pendingList[i]]);
                    other.push(id);

                    const mystr =  "[" + my.toString() + "]";
                    const otherstr =  "[" + other.toString() + "]";

                    await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[mystr, email]]);
                    await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[otherstr, matchEmail]]);

                    // await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[pendingList[i], email]]);
                    // await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[id, matchEmail]]);

                    updatePendingList = pendingList.filter((item) => item !== pendingList[i])
                    const updatePendingStr = "[" + updatePendingList.toString() + "]";
                    await transaction(["UPDATE matching SET pending = ? WHERE user = ?"], [[updatePendingStr, email]])

                    updatePendingUser = pendingUser.filter((item) => item !== id)
                    const updatePendingUserStr = "[" + updatePendingUser.toString() + "]";
                    await transaction(["UPDATE matching SET pending = ? WHERE user = ?"], [[updatePendingUserStr, matchEmail]])

                    break
                }else if(tt !== null && tt.includes(id)){
                    console.log('match!!!')
                    const data = await transaction(["SELECT email FROM member WHERE id = ?"], [[pendingList[i]]]);
                    const matchEmail = data[0][0]['email']

                    const my = JSON.parse(matched);
                    const other = JSON.parse(hisMatched);

                    my.push([pendingList[i]]);
                    other.push(id);

                    const mystr =  "[" + my.toString() + "]";
                    const otherstr =  "[" + other.toString() + "]";

                    await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[mystr, email]]);
                    await transaction(["UPDATE matching SET matched = ? WHERE user = ?"], [[otherstr, matchEmail]]);

                    updatePendingList = pendingList.filter((item) => item !== pendingList[i])
                    const updatePendingStr = "[" + updatePendingList.toString() + "]";
                    await transaction(["UPDATE matching SET pending = ? WHERE user = ?"], [[updatePendingStr, email]])

                    updatePendingUser = pendingUser.filter((item) => item !== id)
                    const updatePendingUserStr = "[" + updatePendingUser.toString() + "]";
                    await transaction(["UPDATE matching SET pending = ? WHERE user = ?"], [[updatePendingUserStr, matchEmail]])

                    break
                }
            }*/
        }
    }
    res.status(200).json({"success": "test!!!"})
})

module.exports = router;
