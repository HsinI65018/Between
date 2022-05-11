const showMenu = document.querySelector('.show-friend');
const friendList = document.querySelector('.friend-list');
const messageRoom = document.querySelector('.message-room');
const closeMenu = document.querySelector('.close-btn');
const friendMenuController = (e) => {
    const target = e.target.className;
    if(target === 'close-btn'){
        friendList.classList.add('hide-aside');
        messageRoom.classList.remove('hide-aside');
    }else{
        friendList.classList.remove('hide-aside');
        messageRoom.classList.add('hide-aside');
    }
}
showMenu.addEventListener('click', friendMenuController)
closeMenu.addEventListener('click', friendMenuController)