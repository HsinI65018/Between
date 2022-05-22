//// check sigin status
const checkSignInController = async () => {
    const response = await fetch('/api/user/');
    const data = await response.json();
    console.log(data)
    if(data.success === false) window.location = '/';

    if(window.location.pathname === '/member') memberController(data);

    if(data.data.userstatus === 0){
        if(window.location.pathname === '/match' || window.location.pathname === '/message'){
            window.location = '/member';
        }
    }
}
checkSignInController();


//// init member page
const memberController = async (data) => {
    const userData = data['data'];
    const userName = document.querySelector('.save-user-username');
    const userEmail = document.querySelector('.save-user-email');
    const userImage = document.querySelector('.upload-image');
    const userPassword = document.querySelector('.register-pwd');
    const profile = document.querySelector('.profile-container ');
    const editBtn = document.querySelector('.edit-profile');

    userName.textContent = userData.username;
    userEmail.textContent = userData.email;
    
    if(userData.image !== null){
        userImage.src = userData.image;
        userImage.classList.add('upload');
    }

    if(userData.register === 'google') userPassword.style.display = 'none';

    if(userData.userstatus === 0){
        profile.classList.remove('hide');
        editBtn.classList.add('hide');
    }else{
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        const profileData = data.data;

        const location = document.querySelector('.location-value');
        const facebook = document.querySelector('.fb-value');
        const instagram = document.querySelector('.ig-value');
        const introduction = document.querySelector('.intro-value');
        const condition = document.querySelector('.condition-value');
        
        location.value = profileData.location;
        facebook.value = profileData.facebook;
        instagram.value = profileData.instagram;
        introduction.value = profileData.introduction;
        condition.value = profileData.searchCondition;

        const sex = document.querySelector(`.sex-${profileData.sex[0]}`);
        const typeOne = document.querySelector(`.type-${profileData.type[0]}`);
        const typeTwo = document.querySelector(`.type-${profileData.type[1]}`);
        const typeThree = document.querySelector(`.type-${profileData.type[2]}`);
        const typeFour = document.querySelector(`.type-${profileData.type[3]}`);

        sex.classList.add('click-btn');
        typeOne.classList.add('select');
        typeTwo.classList.add('select');
        typeThree.classList.add('select');
        typeFour.classList.add('select');

        profile.classList.add('hide');
        editBtn.classList.remove('hide');
    }
}


////
let dataList;
const userName = document.querySelector('.user-name');
const userIcon = document.querySelector('.user-image');
const userImage = document.querySelector('.img-container');
const userLocation = document.querySelector('.location-name');
const introduction = document.querySelector('.introduction');
const matchController = async () => {
    const response = await fetch('/api/user/match');
    const data = await response.json();
    // console.log(data);
    dataList = data['data'];

    userName.textContent = data['data'][0]['username'];
    userIcon.src = data['data'][0]['image'];
    userImage.style.backgroundImage = `url(${data['data'][0]['image']})`;
    userLocation.textContent = data['data'][0]['location'];
    introduction.textContent = data['data'][0]['introduction'];
}
matchController();


let index = 1;
const nextBtn = document.querySelector('.next-btn');
const nextPersonController = () => {
    // console.log(dataList)
    // console.log(dataList.length)
    
    userName.textContent = dataList[index]['username'];
    userIcon.src = dataList[index]['image'];
    userImage.style.backgroundImage = `url(${dataList[index]['image']})`;
    userLocation.textContent = dataList[index]['location'];
    introduction.textContent = dataList[index]['introduction'];
    index++
}
nextBtn.addEventListener('click', nextPersonController)