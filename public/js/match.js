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
    }
}
sendMessageBtn.addEventListener('click', matchSuccessController);
keepPlayingBtn.addEventListener('click', matchSuccessController);


//// like the person controller
const imgContainer = document.querySelector('.img-container');
const likeIcon = document.querySelector('.like');
const likeController = (e) => {
    likeIcon.classList.remove('hide');
    setTimeout(() => {
        likeIcon.classList.add('hide');
    }, 500)
    console.log(userName.id)
}
imgContainer.addEventListener('dblclick', likeController)


//// [In progress.....]
let dataList = [];
const userName = document.querySelector('.user-name');
const userIcon = document.querySelector('.user-image');
const userImage = document.querySelector('.img-container');
const userLocation = document.querySelector('.location-name');
const introduction = document.querySelector('.introduction');
const matchController = async () => {
    const response = await fetch('/api/user/match');
    const data = await response.json();
    console.log(data)
    if(data['data'] === null){
        initMatchCandidate();
    }else if(data['data'].length === 0){
        errorContainer.classList.remove('hide');
        errorMessage.textContent = 'Oops, something went wrong. You seem playing to fast. Click the button to refresh the page.'
    }else{
        for(let i = 0; i < data['data'].length; i++){
            dataList.push(data['data'][i])
        }
        userName.id = dataList[0]['id'];
        userName.textContent = dataList[0]['username'];
        userIcon.src = dataList[0]['image'];
        userImage.style.backgroundImage = `url(${dataList[0]['image']})`;
        userLocation.textContent = dataList[0]['location'];
        introduction.textContent = dataList[0]['introduction'];
        dataList.shift();
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
    if(data['data'] === null){
        clearInterval(start)
    }
    for(let i = 0; i < data['data'].length; i++){
        dataList.push(data['data'][i])
    }

    userName.textContent = dataList[0]['username'];
    userIcon.src = dataList[0]['image'];
    userImage.style.backgroundImage = `url(${dataList[0]['image']})`;
    userLocation.textContent = dataList[0]['location'];
    introduction.textContent = dataList[0]['introduction'];
    dataList.shift();
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

    if(data['data'] === null){
        clearInterval(start)
    }else{
        for(let i = 0; i < data['data'].length; i++){
            dataList.push(data['data'][i])
        }
    }
}


//// auto generate candidate
const start = setInterval(async () => {
    if(window.location.pathname !== '/match'){
        clearInterval(start)
    }
    await generateMatchCandidate();
}, 4000)
start;


//// next button controller
const nextBtn = document.querySelector('.next-btn');
const errorContainer = document.querySelector('.error-container');
const errorMessage = document.querySelector('.error > .message');
const nextPersonController = async () => {
    if(dataList.length === 0){
        errorContainer.classList.remove('hide');
        errorMessage.textContent = 'Oops, something went wrong. You seem playing to fast. Click the button to refresh the page.'
    }else{
        userName.textContent = dataList[0]['username'];
        userIcon.src = dataList[0]['image'];
        userImage.style.backgroundImage = `url(${dataList[0]['image']})`;
        userLocation.textContent = dataList[0]['location'];
        introduction.textContent = dataList[0]['introduction'];
        dataList.shift();

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