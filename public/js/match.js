//// show person introduction throw the dots icon
const moreInfoBtn = document.querySelector('.more-info-Btn');
const showMoreInfoController = () => {
    const introduction = document.querySelector('.introduction-container');
    if(introduction.className.includes('hide')){
        introduction.classList.remove('hide');
    }else{
        introduction.classList.add('hide');
    }
}
moreInfoBtn.addEventListener('click', showMoreInfoController);


//// controll match success block
const sendMessageBtn = document.querySelector('.message-btn');
const keepPlayingBtn = document.querySelector('.playing-btn');
const matchSuccess = document.querySelector('.show-match-container');
const matchSuccessController = (e) => {
    const target = e.target.className
    if(target.includes('message')){
        window.location = '/message';
    }else{
        matchSuccess.classList.add('hide');
        startMatching();
    }
}
sendMessageBtn.addEventListener('click', matchSuccessController);
keepPlayingBtn.addEventListener('click', matchSuccessController);


//// Add front-end pendingList in every 4 second
//// like the person controller
let pendingList = [];
const imgContainer = document.querySelector('.img-container');
const likeIcon = document.querySelector('.like');
const likeController = async () => {
    likeIcon.classList.remove('hide');
    setTimeout(() => {
        likeIcon.classList.add('hide');
    }, 500)
    pendingList.push(userName.id);
}
imgContainer.addEventListener('dblclick', likeController);


//// send pendingList to back-end
const pendingController = async () => {
    const response = await fetch('/api/user/match/pending', {
        method: "POST",
        body: JSON.stringify({
            "pendingList": pendingList
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    console.log('pending=',data)
}


//// if pendingList.lengh > 3 send to back-end every 4 second
const startAddPending = async () => {
    setInterval(async () => {
        if(window.location.pathname !== '/match'){
            clearInterval(startAddPending)
        }
        if(pendingList.length >= 3){
            await pendingController();
            pendingList = [];
        }
    }, 4000)
};
startAddPending();



//// check if there is a match success
//// check matching, if seuuess show the success block
const showMatch = document.querySelector('.show-match-container');
const subTitle = document.querySelector('.sub-title');
const matchPerson = document.querySelector('.person-1 > img');
const user = document.querySelector('.person-2 > img');
const checkMatchingController = async () => {
    console.log('start match!!!!!')
    const response = await fetch('/api/user/match/check/pending', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json();
    const matchData = data.responseData;
    if(matchData !== null ){
        showMatch.classList.remove('hide');
        subTitle.textContent = `You and ${matchData.matchUser} have liked each other`;
        matchPerson.src = matchData.matchImage;
        user.src = matchData.image;
        clearInterval(startMatching);

    }
}


//// check matching erery 6 second
const startMatching = async () => {
    setInterval(async () => {
        if(window.location.pathname !== '/match'){
            clearInterval(startMatching);
        }
        await checkMatchingController();
    }, 6000)
};
startMatching();


//// show matching candidate
//// display candidate info
const showCandidateInfo = () => {
    userName.id = dataList[0]['id'];
    userName.textContent = dataList[0]['username'];
    userIcon.src = dataList[0]['image'];
    userImage.style.backgroundImage = `url(${dataList[0]['image']})`;
    userLocation.textContent = dataList[0]['location'];
    introduction.textContent = dataList[0]['introduction'];
    dataList.shift();
}


//// every time access in match page first time
let dataList = [];
const userName = document.querySelector('.user-name');
const userIcon = document.querySelector('.user-image');
const userImage = document.querySelector('.img-container');
const userLocation = document.querySelector('.location-name');
const introduction = document.querySelector('.introduction');
const matchController = async () => {
    const response = await fetch('/api/user/match');
    const data = await response.json();
    // console.log(data)
    if(data['data'] === null){
        initMatchCandidate();
    }else if(data['data'].length === 0){
        errorContainer.classList.remove('hide');
        errorMessage.textContent = 'Oops, something went wrong. You seem playing to fast. Click the button to refresh the page.'
    }else{
        for(let i = 0; i < data['data'].length; i++){
            dataList.push(data['data'][i])
        }
        showCandidateInfo();
    }
}
matchController();


//// first time generage candidate
const initMatchCandidate = async () => {
    const response = await fetch('/api/user/match', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    if(data['data'] === null) clearInterval(start);
    for(let i = 0; i < data['data'].length; i++){
        dataList.push(data['data'][i])
    }
    showCandidateInfo();
}


//// generate candidate
const generateMatchCandidate = async () => {
    const response = await fetch('/api/user/match', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();

    if(data['data'] !== null){
        for(let i = 0; i < data['data'].length; i++){
            dataList.push(data['data'][i])
        }
    }
}


//// auto generate candidate in erery 5 second
const start = async () => {
    setInterval(async () => {
        if(window.location.pathname !== '/match'){
            clearInterval(start)
        }
        await generateMatchCandidate();
    }, 5000)
};
start();


//// next button controller
const nextBtn = document.querySelector('.next-btn');
const errorContainer = document.querySelector('.error-container');
const errorMessage = document.querySelector('.error > .message');
const nextPersonController = async () => {
    if(dataList.length === 0){
        errorContainer.classList.remove('hide');
        errorMessage.textContent = 'Oops, something went wrong. You seem playing to fast. Click the button to refresh the page.'
    }else{
        showCandidateInfo();

        const updateResponse = await fetch('/api/user/match/update', {
            method: "PATCH",
            body: JSON.stringify({
                "data": dataList
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const updateData = await updateResponse.json();
    }
    
}
nextBtn.addEventListener('click', nextPersonController);
// imgContainer.addEventListener('touchend', nextPersonController);