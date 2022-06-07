//// show person introduction throw the dots icon
const moreInfoBtn = document.querySelector('.more-btn');
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
const matchSuccessController = async (e) => {
    const target = e.target.className
    if(target.includes('message')){
        window.location = '/message';
    }else{
        matchSuccess.classList.add('hide');
        nextBtn.classList.remove('disabled');
        likeContainer.classList.remove('disabled');
        moreInfoBtn.classList.remove('disabled');
        startMatching();
    }
}
sendMessageBtn.addEventListener('click', matchSuccessController);
keepPlayingBtn.addEventListener('click', matchSuccessController);


//// like the person controller
let pendingList = [];
const likeContainer = document.querySelector('.like-container');
const likeController = async () => {
    likeContainer.classList.add('liked')
    pendingList.push(userName.id);
}
likeContainer.addEventListener('click', likeController);


//// send pendingList to back-end
const pendingController = async () => {
    await fetch('/api/user/match/pending', {
        method: "POST",
        body: JSON.stringify({
            "pendingList": pendingList
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
}


//// send to back-end every 6 second
let autoPending;
const startAddPending = async () => {
    autoPending = setInterval(async () => {
        if(window.location.pathname !== '/match'){
            clearInterval(autoPending)
        }
        await pendingController();
        pendingList = [];
    }, 10000)
};
startAddPending();


//// check if there is a match success
//// check matching, if seuuess show the success block
const showMatch = document.querySelector('.show-match-container');
const subTitle = document.querySelector('.sub-title');
const matchPerson = document.querySelector('.person-1 > img');
const user = document.querySelector('.person-2 > img');
const nextBtn = document.querySelector('.next-btn');
const checkMatchingController = async () => {
    console.log('start match!!!!!')
    const response = await fetch('/api/user/match');
    const data = await response.json();
    const matchData = data.data;
    console.log(data)
    if(matchData !== null){
        clearInterval(autoMatching);
        showMatch.classList.remove('hide');
        subTitle.textContent = `You and ${matchData.matchUser} have liked each other`;
        matchPerson.src = matchData.matchImage;
        user.src = matchData.image;
        nextBtn.classList.add('disabled');
        likeContainer.classList.add('disabled');
        moreInfoBtn.classList.add('disabled');
    }else{
        await fetch('/api/user/match/check/pending', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}


//// check matching erery 15 second
let autoMatching;
const startMatching = async () => {
    autoMatching = setInterval(async () => {
        if(window.location.pathname !== '/match'){
            clearInterval(autoMatching);
        }
        await checkMatchingController();
    }, 15000)
};
startMatching();


//// show matching candidate
//// display candidate info
let currentCandidate;
const showCandidateInfo = async () => {
    likeContainer.classList.remove('liked')
    userName.id = dataList[0]['id'];
    userName.textContent = dataList[0]['username'];
    userIcon.src = dataList[0]['image'];
    userImage.style.backgroundImage = `url(${dataList[0]['image']})`;
    userImage.style.backgroundSize = 'cover';
    userLocation.textContent = dataList[0]['location'];
    introduction.textContent = dataList[0]['introduction'];

    await fetch('/api/user/candidate/update', {
        method: "PATCH",
        body: JSON.stringify({
            "data": dataList,
            "currentId": dataList[0]['id']
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

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
    const response = await fetch('/api/user/candidate');
    const data = await response.json();
    console.log(data)

    if(data['data'].length === 0){
        await generateMatchCandidate();
        await showCandidateInfo();
    }else{
        for(let i = 0; i < data['data'].length; i++){
            dataList.push(data['data'][i])
        }
        showCandidateInfo();
    }
}
// setTimeout(async () => {await matchController();}, 2000)
matchController();


//// generate candidate
const generateMatchCandidate = async () => {
    const response = await fetch('/api/user/candidate/generate', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();

    if(data['data'] === null){
        clearInterval(autoGenerate);
        setTimeout(() => {
            console.log('start again!')
            startGenerateCandidate()
        }, 20000)
    }else{
        for(let i = 0; i < data['data'].length; i++){
            dataList.push(data['data'][i])
        }
    }
}


//// auto generate candidate in erery 10 second
let autoGenerate;
const startGenerateCandidate = async () => {
    autoGenerate = setInterval(async () => {
        if(window.location.pathname !== '/match'){
            clearInterval(autoGenerate)
        }
        await generateMatchCandidate();
    }, 8000)
};
startGenerateCandidate();


//// next button controller
const imgContainer = document.querySelector('.test');
const errorContainer = document.querySelector('.error-container');
const errorMessage = document.querySelector('.error > .message');
const nextPersonController = async () => {
    if(dataList.length === 0){
        errorContainer.classList.remove('hide');
        errorMessage.textContent = 'Oops, something went wrong. You seem playing to fast. Click the button to refresh the page.'
    }else{
        showCandidateInfo();
    }
}
console.log(window.screen.width)
nextBtn.addEventListener('click', nextPersonController);
if(window.screen.width < 800){
    imgContainer.classList.remove('hide');
    imgContainer.addEventListener('touchstart', nextPersonController);
}