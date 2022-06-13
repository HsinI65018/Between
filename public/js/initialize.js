//// check sigin status
const errorContainer = document.querySelector('.error-container');
const errorMessage = document.querySelector('.error > .message');
const checkSignInController = async () => {
    const response = await fetch('/api/user/');
    const data = await response.json();
    console.log(data)
    if(data.success === false) window.location = '/';

    if(window.location.pathname !== '/'){
        const profile = document.querySelector('.profile-icon');
        profile.id = data['data']['id']
    }

    if(window.location.pathname === '/member') memberController(data);

    if(data.data.userstatus !== 1){
        if(window.location.pathname === '/match' || window.location.pathname === '/message'){
            window.location = '/member';
        }
        if(data.data.userstatus === 2){
            errorContainer.classList.remove('hide');
            errorMessage.textContent = 'Oops, you forget to upload the photo.'
        }
    }
}
checkSignInController();


//// init member page
const body = document.querySelector('body');
const header = document.querySelector('header');
const main = document.querySelector('main');
const loading = document.querySelector('.loading');
const memberController = async (data) => {
    body.style.display = 'block';
    header.style.display = 'flex';
    main.style.display = 'flex';
    loading.style.display = 'none';

    const userData = data['data'];
    const userName = document.querySelector('.save-user-username');
    const userEmail = document.querySelector('.save-user-email');
    const userImage = document.querySelector('.upload-image');
    const userPassword = document.querySelector('.register-pwd');
    const profile = document.querySelector('.profile-container ');
    const editBtn = document.querySelector('.edit-profile');
    const startMatchBtn = document.querySelector('.start-match');

    userName.textContent = userData.username;
    userEmail.textContent = userData.email;
    
    if(userData.image !== null){
        userImage.src = userData.image;
        userImage.classList.add('upload');
    }

    if(userData.register === 'google') userPassword.style.display = 'none';

    if(userData.userstatus === 0){
        profile.classList.remove('hide');
        editBtn.style.display = 'none';
        startMatchBtn.style.display = 'none';
    }else{
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        const profileData = data.data;

        const location = document.querySelector('.location-value');
        const introduction = document.querySelector('.intro-value');
        
        location.value = profileData.location;
        introduction.value = profileData.introduction;

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