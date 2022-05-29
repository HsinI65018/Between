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
showMenu.addEventListener('click', friendMenuController);
closeMenu.addEventListener('click', friendMenuController);

const friendListContainer = document.querySelector('.friend-zone-container');
const friendListController = async () => {
    const response = await fetch('/api/user/message/friend/list');
    const data = await response.json();
    const friendList = data.data
    // console.log(friendList)
    for(let i = 0; i < friendList.length; i++){
        const friendCard = document.createElement('div');
        const imgContainer = document.createElement('div');
        const image = document.createElement('img');
        const friendInfo = document.createElement('div');
        const friendName = document.createElement('div');

        image.src = friendList[i]['image'];
        friendName.textContent = friendList[i]['username'];
        friendName.setAttribute('class', 'name')

        imgContainer.setAttribute('class', 'img-container');
        friendInfo.setAttribute('class', 'friend-info');
        imgContainer.appendChild(image);
        friendInfo.appendChild(friendName);

        friendCard.setAttribute('class', 'friend-card')
        friendCard.appendChild(imgContainer);
        friendCard.appendChild(friendInfo);

        friendListContainer.appendChild(friendCard)
    }
}
friendListController();