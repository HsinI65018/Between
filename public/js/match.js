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


