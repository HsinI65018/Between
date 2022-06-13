const { getUserEmail } = require('./auth');
const Candidate = require('../model/candidate');
const Response = require('./response');

const candidate = new Candidate();
const response = new Response();

//// choose random candicate
const randomCandidate = async (initData, page, table, email) => {
    let responseData;
    const randomList = [];

    // make random number
    while(randomList.length < page){
        let num = Math.floor(Math.random() * initData.length);
        if(randomList.includes(num)) continue;
        randomList.push(num);
    }

    // select random person
    const selectList = [];
    for(let i = 0; i < randomList.length; i++){
        selectList.push(initData[randomList[i]].id);
    }

    // update random peson to db
    await updateSkipCandidate(table, selectList, email);

    responseData = await getCandidateInfo(selectList);
    return responseData
}


//// update stp_skip or otp_skip
const updateSkipCandidate = async (table, selectList, email) => {
    for(let i = 0; i < selectList.length; i++){
        await candidate.createUserSkip(table, email, selectList[i]);
        await candidate.createUserUnMatch(email, selectList[i])
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


//// find candicate in opposite type
const optController = async (email, sexOption, type) => {
    let responseData;
    const initData = await candidate.getOTPCandidateId(sexOption, type)
    const data = await candidate.getUserSkip('otp_skip', email)

    if(data[0].length === 0){
        console.log('first time otp')
        if(initData[0].length < 20){
            responseData = await randomCandidate(initData[0], initData[0].length, 'otp_skip', email)
        }else{
            responseData = await randomCandidate(initData[0], 10, 'otp_skip', email)
        }
    }else{
        let newArr = initData[0]
        for(let i = 0; i < data[0].length; i++){
            newArr = newArr.filter((item) => item.id !== data[0][i]['skip'])
        }

        if(newArr.length === 0){
            console.log('no opt data');
            responseData = null;
            return responseData
        }

        if(newArr.length < 20){
            responseData = await randomCandidate(newArr, newArr.length, 'otp_skip', email)
            return responseData
        }

        responseData = await randomCandidate(newArr, 10, 'otp_skip', email)
    }
    return responseData
} 


//// if un_match is not NULL then return un_match data
const getUnMatchCandidate = async (req, res) => {
    const email = getUserEmail(req);
    try {
        const data = await candidate.getUserUnMatch(email)
        const newList = [];
        data.map((item) => {
            newList.push(item.un_match)
        })
        if(data){
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
    const data = await candidate.getUserSkip('stp_skip', email)

    let bisexualData = initData[0]
    if(sexOption === 'Bisexual'){
        bisexualData = bisexualData.filter((item) => item.id !== id)
        initData[0] = bisexualData
    }

    try {
        if(data[0].length === 0){
            console.log('first time')
            if(initData[0].length < 20){
                responseData = await randomCandidate(initData[0], initData[0].length, 'stp_skip', email);
            }else{
                responseData = await randomCandidate(initData[0], 10, 'stp_skip', email)
            }
        }else{
    
            let newArr = initData[0]
            for(let i = 0; i < data[0].length; i++){
                newArr = newArr.filter((item) => item.id !== data[0][i]['skip'])
            }
    
            if(newArr.length === 0){
                console.log('no data');
                console.log('start opt')
                responseData = await optController(email, sexOption, type);
                return res.status(200).json({"type":type, "data": responseData})
            }
    
            if(newArr.length < 20){
                responseData = await randomCandidate(newArr, newArr.length, 'stp_skip', email);
                return res.status(200).json({"type":type, "data": responseData})
            }
    
            responseData = await randomCandidate(newArr, 10, 'stp_skip', email)
        }
        res.status(200).json(response.getResponseSuccess(responseData))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
}


//// update un_match when front-end click the button
const updateUnMatchCandidate = async (req, res) => {
    const email = getUserEmail(req);
    const { currentId } = req.body;
    await candidate.deleteUserUnMatch(email, currentId)
    res.status(200).json(response.getSuccess())
}


//// if click to the end refresh the data
const updateMatching = async (req, res) => {
    const email = getUserEmail(req);
    await candidate.deleteAll('stp_skip', email)
    await candidate.deleteAll('otp_skip', email)
    await candidate.deleteAll('un_match', email)
    res.status(200).json(response.getSuccess())
}


module.exports = {
    getUnMatchCandidate,
    generateMatchCandidate,
    updateUnMatchCandidate,
    updateMatching,
}