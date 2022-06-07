const showMenu = document.querySelector('.show-friend');
const friendList = document.querySelector('.friend-list');
const messageRoom = document.querySelector('.message-room');
const closeMenu = document.querySelector('.close-btn');
const friendMenuController = (e) => {
    friendList.classList.remove('hide-default');
    messageRoom.classList.add('hide');
}
showMenu.addEventListener('click', friendMenuController);
closeMenu.addEventListener('click', friendMenuController);


////
const main = document.querySelector('main');
const loading = document.querySelector('.loading');
const friendListContainer = document.querySelector('.friend-zone-container');
const friendListController = async () => {
    const response = await fetch('/api/user/message/friend/list');
    const data = await response.json();
    const friendList = data.data
    // console.log(friendList)
    main.style.display = 'flex';
    loading.style.display = 'none';
    for(let i = 0; i < friendList.length; i++){
        const friendCard = document.createElement('div');
        const imgContainer = document.createElement('div');
        const image = document.createElement('img');
        const friendInfo = document.createElement('div');
        const friendName = document.createElement('div');
        const unReadMsg = document.createElement('div');

        const counter = localStorage.getItem(friendList[i]['username']);
        if(counter){
            unReadMsg.textContent = counter;
        }else{
            unReadMsg.textContent = 0;
            unReadMsg.classList.add('hide')
        }
        image.src = friendList[i]['image'];
        friendName.textContent = friendList[i]['username'];
        friendName.setAttribute('class', 'name')
        friendName.classList.add('name-list')

        imgContainer.setAttribute('class', 'img-container');
        unReadMsg.classList.add('un-read-msg')
        unReadMsg.setAttribute('id', `${friendList[i]['username']}-msg`)
        friendInfo.setAttribute('class', 'friend-info');

        imgContainer.appendChild(image);
        friendInfo.appendChild(friendName);
        friendInfo.appendChild(unReadMsg)

        friendCard.setAttribute('class', 'friend-card')
        friendCard.setAttribute('id', `${friendList[i]['username']}-${friendList[i]['id']}`);
        friendCard.appendChild(imgContainer);
        friendCard.appendChild(friendInfo);

        friendListContainer.appendChild(friendCard)
    }
}
friendListController();


//// [start...]
const socket = io();

const displayData = (image, sender, time, message) => {
    const msgContainer = document.createElement('div');

    const imgContainer = document.createElement('div');
    const img = document.createElement('img');

    const msgInfoContainer = document.createElement('div');
    const userInfoContainer = document.createElement('div');
    const senderTitle = document.createElement('div');
    const sendTime = document.createElement('div');
    const msg = document.createElement('div');

    img.src = image;
    senderTitle.textContent = sender;
    sendTime.textContent = time
    msg.textContent = message;

    senderTitle.setAttribute('class', 'title');
    sendTime.setAttribute('class', 'msg-date');

    imgContainer.setAttribute('class', 'img-container');
    imgContainer.appendChild(img);

    userInfoContainer.setAttribute('class', 'message-user-info')
    userInfoContainer.appendChild(senderTitle);
    userInfoContainer.appendChild(sendTime);

    msgInfoContainer.setAttribute('class', 'message-info-container');
    msgInfoContainer.appendChild(userInfoContainer);
    msgInfoContainer.appendChild(msg);

    msgContainer.setAttribute('class', 'message-container')
    msgContainer.appendChild(imgContainer);
    msgContainer.appendChild(msgInfoContainer);

    sectionContainer.append(msgContainer)
    sectionContainer.scrollTop = sectionContainer.scrollHeight;
}

let receiver;
let sender;
let image;
let userName;
const asideFriendList = document.querySelector('.friend-list');
const messageContainer= document.querySelector('.message-room');
const defaultContainer= document.querySelector('.default-room');
const sectionContainer = document.querySelector('.section-container');
const friendCardContainer = document.querySelector('.friend-zone-container');
const chatUser = document.querySelector('.chat-name');
const createChatRoom = async (e) => {
    const userId = document.querySelector('.profile-icon').id;
    const [username, friendId] = e.target.id.split('-');
    const unReadUser = document.querySelector(`#${username}-msg`);

    const response = await fetch('api/user/message/people', {
        method: "POST",
        body: JSON.stringify({
            "userId": userId,
            "friendId": friendId
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json();

    receiver = data.data.receiver
    sender = data.data.sender;
    image = data.data.image;
    userName = data.data.username;

    if(window.screen.width < 900){
        asideFriendList.classList.add('hide-default')
    }
    messageContainer.classList.remove('hide')
    defaultContainer.classList.add('hide');

    chatUser.textContent = username;
    sectionContainer.innerHTML = '';

    localStorage.removeItem(username)
    unReadUser.textContent = 0;
    unReadUser.classList.add('hide');

    // send connect
    socket.emit('user_connected', userId)

    // history message
    const historyResponse = await fetch('api/user/message/history', {
        method: "POST",
        body: JSON.stringify({
            "sender": sender,
            "receiver": receiver
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const historyData = await historyResponse.json();
    const senderList = historyData.people;
    const messageList = historyData.data;

    for(let i = 0; i < messageList.length; i++){
        const image = senderList[messageList[i]['sender']]['image'];
        const username = senderList[messageList[i]['sender']]['username'];
        displayData(image, username, messageList[i]['time'], messageList[i]['message'])
    }
}
friendCardContainer.addEventListener('click', createChatRoom)

//// send the message
const msgForm = document.querySelector('.msg-form');
const message = document.querySelector('.message-value');
const sendMsgController = async (e) => {
    e.preventDefault();
    const current = new Date();
    const time = current.toLocaleTimeString('en-US',{timeStyle: 'short'});

    if(message.value){
        socket.emit('send_message', {
            sender: sender,
            receiver: receiver,
            message: message.value,
            time: time
        })
    }
    displayData(image, userName, time, message.value)
    
    message.value = '';
    message.focus();
}
msgForm.addEventListener('submit', sendMsgController)


// show message
socket.on('new_message', (data) => {
    console.log(data);
    const currentUser = document.querySelector('.chat-name');
    console.log(currentUser.textContent)
    if(currentUser.textContent === data.sender){
        displayData(data.image, data.sender, data.time, data.message)
    }else{
        const unReadUser = document.querySelector(`#${data.sender}-msg`);
        // console.log(unReadUser)
        const counter = Number(unReadUser.textContent) + 1;
        unReadUser.textContent = counter;
        localStorage.setItem(data.sender, counter)
        unReadUser.classList.remove('hide')
        console.log('other person=',data);

    }
    
})


//// search controller
const search = document.querySelector('.search-input');
const searchController = () => {
    const filter = search.value.toUpperCase()
    const friendList = document.querySelectorAll('.friend-card');
    const nameList = document.querySelectorAll('.name-list');
    for(let i = 0; i < nameList.length; i++){
        const txtValue = nameList[i].textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            friendList[i].style.display = "";
        } else {
            friendList[i].style.display = "none";
        }
    }
}
search.addEventListener('keyup', searchController)


//// emoji controller
const emoji = document.querySelector('.emoji');
const picker = new EmojiButton();
picker.on('emoji', selection => {
  document.querySelector('.message-value').value += selection;
});
emoji.addEventListener('click', () => picker.togglePicker(emoji));