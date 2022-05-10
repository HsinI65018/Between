//// check sigin status
const checkSignInController = async () => {
    const response = await fetch('/api/user/');
    const data = await response.json();
    if(data['success'] === false) window.location = '/';
}
checkSignInController();


//// switch the page throw the icon
const logoBtn = document.querySelector('.logo');
const messageBtn = document.querySelector('.message');
const memberBtn = document.querySelector('.member');
const switchPage = (e) => {
    const target = e.target.className;
    if(target === 'logo'){
        window.location = '/match';
    }else if(target === 'logout'){
        window.location = '/';
    }
    else{
        window.location = `/${target}`;
    }
    
}
logoBtn.addEventListener('click', switchPage);
messageBtn.addEventListener('click', switchPage);
memberBtn.addEventListener('click', switchPage);


////
const logoutBtn = document.querySelector('.logout');
const logoutController = async() => {
    const response = await fetch('/api/user/logout', {method: "DELETE"});
    const data = await response.json();
    console.log(data)
    if(data['success']){
        window.location = '/';
    }
}
logoutBtn.addEventListener('click', logoutController);


//// hover the icon show icon name
const showIconHint = (e) => {
    const type = e.target.className;
    const target = document.querySelector(`.${type}-title`);
    target.classList.add('show');
}
messageBtn.addEventListener('mouseover', showIconHint);
memberBtn.addEventListener('mouseover', showIconHint);
logoutBtn.addEventListener('mouseover', showIconHint);


//// mouseout od icon hide icon name
const hideIconHint = (e) => {
    const type = e.target.className;
    const target = document.querySelector(`.${type}-title`);
    target.classList.remove('show');
}
messageBtn.addEventListener('mouseout', hideIconHint);
memberBtn.addEventListener('mouseout', hideIconHint);
logoutBtn.addEventListener('mouseout', hideIconHint);