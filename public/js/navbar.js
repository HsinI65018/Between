//// switch the page throw the icon
const logoBtn = document.querySelector('.logo');
const messageBtn = document.querySelector('.message');
const memberBtn = document.querySelector('.member');
const switchPageController = (e) => {
    const target = e.target.className;
    if(target === 'logo'){
        window.location = '/match';
    }else{
        window.location = `/${target}`;
    }
}
logoBtn.addEventListener('click', switchPageController);
messageBtn.addEventListener('click', switchPageController);
memberBtn.addEventListener('click', switchPageController);


//// logout
const logoutBtn = document.querySelector('.logout');
const logoutController = async() => {
    const response = await fetch('/api/user/logout', {method: "DELETE"});
    const data = await response.json();
    if(data.success) window.location = '/';
}
logoutBtn.addEventListener('click', logoutController);


//// hover the icon show icon name
const showIconHintController = (e) => {
    const type = e.target.className;
    const target = document.querySelector(`.${type}-title`);
    target.classList.add('show');
}
messageBtn.addEventListener('mouseover', showIconHintController);
memberBtn.addEventListener('mouseover', showIconHintController);
logoutBtn.addEventListener('mouseover', showIconHintController);


//// mouseout the icon hide icon name
const hideIconHintController = (e) => {
    const type = e.target.className;
    const target = document.querySelector(`.${type}-title`);
    target.classList.remove('show');
}
messageBtn.addEventListener('mouseout', hideIconHintController);
memberBtn.addEventListener('mouseout', hideIconHintController);
logoutBtn.addEventListener('mouseout', hideIconHintController);


////
const closeBtn = document.querySelector('.btn');
const errorContainer = document.querySelector('.error-container');
const closeErrorController = () => {
    errorContainer.classList.add('hide');
}
closeBtn.addEventListener('click', closeErrorController)