const { getUserEmail } = require('./auth');
const Candidate = require('../model/candidate');
const Formate = require('./formatData');
const Response = require('./response');
const transaction = require('../model/utility');

const formate = new Formate();
const candidate = new Candidate();
const response = new Response();

//// choose random candicate
const randomCandidate = async (initData, page, column, email) => {
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
        // skipList.push(initData[randomList[i]].id);
    }
    // console.log('selectList=',selectList)
    // console.log('new-unSkip=', skipList)

    // update random peson to db
    await updateSkipCandidate(column, selectList, email);

    responseData = await getCandidateInfo(selectList);
    return responseData
}


//// update stp_skip or otp_skip
const updateSkipCandidate = async (column, selectList, email) => {
    // const skipStr = formate.formateToStr(skipList)
    // await candidate.updateUserSkip(column, skipStr, email)
    // console.log(skipList)

    for(let i = 0; i < selectList.length; i++){
        const sql = [`INSERT INTO ${column} (user, skip) VALUES (?, ?)`, "INSERT INTO un_match (user, un_match) VALUES (?, ?)"];
        const value = [[email, selectList[i]], [email, selectList[i]]];
        await transaction(sql, value);
    }
}


//// get user matching info
const getCandidateInfo = async (selectList) => {
    const responseData = [];
    for(let i = 0; i < selectList.length; i++){
        const data = await candidate.getCandidateInfo(selectList[i])
        responseData.push(data[0]);
    }
    return responseData
}


//// check if the column un_match is not NULL
// const checkPendingMatch = async (selectData) => {
//     const selectDataList = JSON.parse(selectData[0]['un_match'])
//     // console.log('selectDataList=', selectDataList)
//     const responseData = await getCandidateInfo(selectDataList)
//     return responseData
// }


//// find candicate in opposite type
const optController = async (email, sexOption, type) => {
    let responseData;

    const initData = await candidate.getOTPCandidateId(sexOption, type)
    const skip = await candidate.getUserSkip('otp_skip', email)

    const sql = ["SELECT skip FROM otp_skip WHERE user = ?"];
    const value = [[email]];
    const data = await transaction(sql, value);
    // console.log('new-opt-skip=',data[0])

    //skip[0]['otp_skip']
    if(data[0].length === 0){
        console.log('first time otp')
        const skipList = [];
        if(initData[0].length < 10){
            responseData = await randomCandidate(initData[0], initData[0].length, 'otp_skip', email)
        }else{
            responseData = await randomCandidate(initData[0], 5, 'otp_skip', email)
        }
    }else{
        const skipList = JSON.parse(skip[0]['otp_skip']);

        let newArr = initData[0]
        for(let i = 0; i < data[0].length; i++){
            newArr = newArr.filter((item) => item.id !== data[0][i]['skip'])
        }

        if(newArr.length === 0){
            console.log('no opt data');
            responseData = null;
            return responseData
        }

        if(newArr.length < 10){
            responseData = await randomCandidate(newArr, newArr.length, 'otp_skip', email)
            return responseData
        }

        responseData = await randomCandidate(newArr, 5, 'otp_skip', email)
    }
    return responseData
} 


//// if un_match is not NULL then return un_match data
const getUnMatchCandidate = async (req, res) => {
    const email = getUserEmail(req);
    // const selectData = await candidate.getUserUnMatch(email)
    const sql = ["SELECT un_match FROM un_match WHERE user = ?"];
    const value = [[email]];
    const data = await transaction(sql, value);
    const newList = [];
    data[0].map((item) => {
        newList.push(item.un_match)
    })
    // console.log(newList)

    try {
        if(data[0]){
            // let responseData = await checkPendingMatch(selectData);
            const responseData = await getCandidateInfo(newList)
            return res.status(200).json({"data": responseData})
        };
        res.status(200).json(response.getResponseSuccess(null))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
}


//// generate candidate main function
const generateMatchCandidate = async (req, res) => {
    const email = getUserEmail(req);
    const typeData = await candidate.getUserType(email)
    const { type, sex, id } = typeData[0];

    if(sex === 'Male'){
        sexOption = 'Female';
    }else if(sex === 'Female'){
        sexOption = 'Male';
    }else{
        sexOption = 'Bisexual';
    }

    let responseData;
    let initData = await candidate.getSTPCandidateId(sexOption, type)
    const skip = await candidate.getUserSkip('stp_skip', email)
    const sql = ["SELECT skip FROM stp_skip WHERE user = ?"];
    const value = [[email]];
    const data = await transaction(sql, value);
    // console.log('new-stp-skip=',data[0])

    let bisexualData = initData[0]
    if(sexOption === 'Bisexual'){
        bisexualData = bisexualData.filter((item) => item.id !== id)
        initData[0] = bisexualData
    }
    // console.log('init-data=',initData[0])
    // console.log('init-skip=',skip)
    //if(skip[0]['stp_skip'] === null){
    try {
        if(data[0].length === 0){
            console.log('first time')
            const skipList = [];
            if(initData[0].length < 10){
                responseData = await randomCandidate(initData[0], initData[0].length, 'stp_skip', email);
            }else{
                responseData = await randomCandidate(initData[0], 5, 'stp_skip', email)
            }
        }else{
            // console.log(skip)
            // console.log('skip=',skip[0][0]['stp_skip'])
            const skipList = JSON.parse(skip[0]['stp_skip']);
    
            let newArr = initData[0]
            // for(let i = 0; i < skipList.length; i++){
            //     newArr = newArr.filter((item) => item.id !== skipList[i])
            // }
            for(let i = 0; i < data[0].length; i++){
                newArr = newArr.filter((item) => item.id !== data[0][i]['skip'])
            }
            // console.log('newArr=',newArr)
    
            /// HERE!!!!
            if(newArr.length === 0){
                console.log('no data');
                console.log('start opt')
                responseData = await optController(email, sexOption, type);
                return res.status(200).json({"type":type, "data": responseData})
            }
    
            if(newArr.length < 10){
                // console.log('Hello');
                responseData = await randomCandidate(newArr, newArr.length, 'stp_skip', email);
                return res.status(200).json({"type":type, "data": responseData})
            }
    
            responseData = await randomCandidate(newArr, 5, 'stp_skip', email)
        }
        // console.log('responseData=', responseData)
        res.status(200).json(response.getResponseSuccess(responseData))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
}


//// update un_match when front-end click the button
const updateUnMatchCandidate = async (req, res) => {
    const email = getUserEmail(req);
    const { currentId } = req.body;
    // const sql = ["SELECT un_match FROM un_match WHERE user = ?"];
    // const value = [[email]];
    // const unMatchData = await transaction(sql, value);
    // console.log(unMatchData[0])

    const sql_ = ["DELETE FROM un_match WHERE user = ? AND un_match = ?"];
    const value_ = [[email, currentId]];
    await transaction(sql_, value_);
    
    await candidate.updateUnMatchStatus(1, email);
    res.status(200).json(response.getSuccess())
}


//// if click to the end refresh the data
const updateMatching = async (req, res) => {
    const email = getUserEmail(req);
    // await candidate.updateUserMatching(email);
    const sql = ["DELETE FROM stp_skip WHERE user = ?", "DELETE FROM otp_skip WHERE user = ?", "DELETE FROM un_match WHERE user = ?"];
    const value = [[email], [email], [email]];
    await transaction(sql, value);
    res.status(200).json(response.getSuccess())
}


//// check default un_match to prevent un_match will not be wrong when going to another page (api called in init.js)
// const updateDefaultUnMatch = async (req, res) => {
//     const email = getUserEmail(req);
//     const data = await candidate.getUnMatchStatus(email)
//     const unMatchStatus = data[0]['un_match_status'];
//     // console.log('test!!!!!!!!!',unMatchStatus)
//     try {
//         if(unMatchStatus === 0){
//             const data = await candidate.getUserUnMatch(email)
//             const unMatch = data[0]['un_match'];
    
//             if(unMatch === null || unMatch === []){
//                 await candidate.updateUserMatching(email);
//             }else{
//                 let unMatchList = JSON.parse(unMatch);
//                 unMatchList = unMatchList.slice(1);
//                 // console.log(unMatchList)
//                 const unMatchStr = formate.formateToStr(unMatchList)
//                 await candidate.updateUnMatch(unMatchStr, email)
//             }
//         }else{
//             await candidate.updateUnMatchStatus(0, email);
//         }
//         res.status(200).json(response.getSuccess())
//     } catch (error) {
//         res.status(500).json(response.getServerError())
//     }
    
// }

module.exports = {
    getUnMatchCandidate,
    generateMatchCandidate,
    updateUnMatchCandidate,
    updateMatching,
    // updateDefaultUnMatch
}