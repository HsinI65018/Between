const { getUserEmail } = require('./auth');
const Match = require('../model/match');
const Formate = require('./formatData');
const Response = require('./response');
const transaction = require('../model/utility');

const match = new Match();
const formate = new Formate()
const response = new Response();

//// add front-end like to pending
const updatePending = async (req, res) => {
    let { pendingList } = req.body;
    // console.log(pendingList)
    const email = getUserEmail(req);
    // const data = await match.getUserPending(email)
    // console.log('data[0][0]=',data[0])
    try {
        // if(data[0]['pending'] !== null){
        //     const newPending = JSON.parse(data[0]['pending']);
        //     for(let i = 0; i < pendingList.length; i++){
        //         newPending.push(Number(pendingList[i]))
        //     }
        //     pendingList = newPending
        // }
        // const pendingStr = formate.formateToStr(pendingList)
        // await match.updateUserPending(pendingStr, email)
        for(let i = 0; i < pendingList.length; i++){
            const sql = ['INSERT INTO pending (user, pending) VALUES (?, ?)'];
            const value = [[email, pendingList[i]]]
            await transaction(sql, value)
        }
        res.status(200).json(response.getResponseSuccess("add to pending"))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }   
}


const getMatchSuccessInfo = async (req, res) => {
    const email = getUserEmail(req);
    const data = await match.getUserMatched(email)
    const { matched, image } = data[0]

    const sql = ["SELECT matched FROM matched WHERE user = ?"];
    const value = [[email]];
    const d = await transaction(sql, value);
    // console.log(d[0])


    // console.log(matched)
    let responseData = null;

    if(d[0].length !== 0){
        await transaction(["INSERT INTO friend (user, friend) VALUES (?, ?)"], [[email, d[0][0]['matched']]])

        const matchData = await match.getMatchSuccessInfo(d[0][0]['matched'])
        responseData = {
            "matchUser": matchData[0]['username'],
            "matchImage": matchData[0]['image'],
            "image": image
        }

        await transaction(["DELETE FROM matched WHERE user = ? AND matched = ?"], [[email, d[0][0]['matched']]])

        res.status(200).json(response.getResponseSuccess(responseData))
    }else{
        res.status(200).json(response.getResponseSuccess(null))
    }

    /*try {
        if(matched !== '[0]'){
            const matchedList = JSON.parse(matched)
            const data = await match.getUserFriendList(email)
            const { friends } = data[0];

            let friendList;

            if(friends === null){
                friendList = [];
            }else{
                friendList = JSON.parse(friends);
            }
            friendList.push(matchedList[1]);

            const friendsStr = formate.formateToStr(friendList)
            await match.updateUserFriendList(friendsStr, email)
    
            const matchData = await match.getMatchSuccessInfo(matchedList[1])
            responseData = {
                "matchUser": matchData[0]['username'],
                "matchImage": matchData[0]['image'],
                "image": image
            }
    
            const newMatched = JSON.parse(matched)
            newMatched.splice(1, 1)
            // console.log(newMatch)
            const newMatchedStr = formate.formateToStr(newMatched)
            // console.log('test=',newStr)
            await match.updateUserMatched(newMatchedStr, email)
        }
        res.status(200).json(response.getResponseSuccess(responseData))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }*/
}


//// check if it is match
const checkMatching = async (req, res) => {
    const email = getUserEmail(req);
    const data = await match.getUserChecking(email)
    const { matched, pending, id } = data[0]
    const sql = ["SELECT pending FROM pending WHERE user = ?"];
    const value = [[email]];
    const d = await transaction(sql, value);
    // console.log(d[0].length)
    // console.log(matched)
    const pendingList = JSON.parse(pending);
    try {
        if(pendingList !== null){
            for(let i = 0; i < d[0].length; i++){
                // console.log(d[0][i]['pending'])
                const sql = ["SELECT user, pending FROM pending INNER JOIN member ON pending.user = member.email WHERE id = ?"];
                const value = [[d[0][i]['pending']]]
                const da = await transaction(sql, value);
                // console.log(da[0])

                // const data = await match.getCandidateChecking(d[0][i]['pending'])
                // const pending = data[0]['pending'];
                // const hisMatched = data[0]['matched'];
                // const matchEmail = data[0]['email'];
    
                // const pendingUser = JSON.parse(pending)
                // const matchUser = JSON.parse(hisMatched)

                da[0].map(async (item) => {
                    if(item.pending === id){
                        console.log('m')

                        const sql = ["INSERT INTO matched (user, matched) VALUES (?, ?)"];
                        const value = [[email, [d[0][i]['pending']]]]
                        await transaction(sql, value);

                        const sq = ["INSERT INTO matched (user, matched) VALUES (?, ?)"];
                        const va = [[item.user, id]]
                        await transaction(sq, va);

                        await transaction(["DELETE FROM pending WHERE user = ? AND pending = ?"], [[email, [d[0][i]['pending']]]]);
                        await transaction(["DELETE FROM pending WHERE user = ? AND pending = ?"], [[item.user, id]]);

                    }
                })
    
                // if(pendingUser !== null && pendingUser.includes(id) || matchUser !== null && matchUser.includes(id)){
                //     console.log('match!!!')
    
                //     const user = JSON.parse(matched);
                //     const other = JSON.parse(hisMatched);
    
                //     user.push([pendingList[i]]);
                //     other.push(id);
    
                //     const userStr = formate.formateToStr(user);
                //     const otherStr = formate.formateToStr(other)
    
                //     await match.updateUserMatched(userStr, email)
                //     await match.updateUserMatched(otherStr, matchEmail)
    
    
                //     let updatePendingList = pendingList.filter((item) => item !== pendingList[i])
                //     const updatePendingStr = formate.formateToStr(updatePendingList)
                //     await match.updateUserPending(updatePendingStr, email)
    
                //     let updatePendingUser = pendingUser.filter((item) => item !== id)
                //     const updatePendingUserStr = formate.formateToStr(updatePendingUser)
                //     await match.updateUserPending(updatePendingUserStr, matchEmail)
                //     break
                // }
            }
        }
        res.status(200).json(response.getResponseSuccess("add to matched"))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
}

module.exports = {
    updatePending,
    getMatchSuccessInfo,
    checkMatching
}