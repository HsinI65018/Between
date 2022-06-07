const { getUserEmail } = require('./auth');
const Match = require('../model/match');
const Response = require('./response');

const match = new Match();
const response = new Response();

//// add front-end like to pending
const updatePending = async (req, res) => {
    let { pendingList } = req.body;
    const email = getUserEmail(req);
    try {
        for(let i = 0; i < pendingList.length; i++){
            await match.createUserPrnding(email, pendingList[i])
        }
        res.status(200).json(response.getResponseSuccess("add to pending"))
    } catch (error) {
        res.status(500).json(response.getServerError())
    }   
}


const getMatchSuccessInfo = async (req, res) => {
    const email = getUserEmail(req);
    try {
        const { image } = await match.getUserImage(email)
        const data = await match.getUserMatch(email)

        let responseData = null;

        if(data.length !== 0){
            await match.createUserFriend(email, data[0]['matched'])

            const matchData = await match.getMatchSuccessInfo(data[0]['matched'])
            responseData = {
                "matchUser": matchData[0]['username'],
                "matchImage": matchData[0]['image'],
                "image": image
            }

            await match.deleteUserMatch(email, data[0]['matched'])
            res.status(200).json(response.getResponseSuccess(responseData))
        }else{
            res.status(200).json(response.getResponseSuccess(null))
        }
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
}


//// check if it is match
const checkMatching = async (req, res) => {
    const email = getUserEmail(req);
    const { id } = await match.getUserId(email);
    const data = await match.getUserPending(email)

    try {
        if(data[0].length !== 0){
            for(let i = 0; i < data[0].length; i++){
                const candidateData = await match.getCandidatePending(data[0][i]['pending'])

                candidateData[0].map(async (item) => {
                    if(item.pending === id){
                        console.log('m')

                        await match.createUserMatch(email, data[0][i]['pending'])
                        await match.createUserMatch(item.user, id)

                        await match.deleteUserPending(email, data[0][i]['pending'])
                        await match.deleteUserPending(item.user, id)
                    }
                })
                break
            }
            res.status(200).json(response.getResponseSuccess("add to matched"))
        }else{
            res.status(200).json(response.getResponseSuccess("no natched"))
        }
        
    } catch (error) {
        res.status(500).json(response.getServerError())
    }
}

module.exports = {
    updatePending,
    getMatchSuccessInfo,
    checkMatching
}