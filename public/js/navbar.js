const logoBtn = document.querySelector('.logo');
const messageBtn = document.querySelector('.message');
const memberBtn = document.querySelector('.member');
const logoutBtn = document.querySelector('.logout');

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
logoutBtn.addEventListener('click', switchPage);

const showIconHint = (e) => {
    const type = e.target.className;
    const target = document.querySelector(`.${type}-title`);
    target.classList.add('show');
}
messageBtn.addEventListener('mouseover', showIconHint);
memberBtn.addEventListener('mouseover', showIconHint);
logoutBtn.addEventListener('mouseover', showIconHint);

const hideIconHint = (e) => {
    const type = e.target.className;
    const target = document.querySelector(`.${type}-title`);
    target.classList.remove('show');
}
messageBtn.addEventListener('mouseout', hideIconHint);
memberBtn.addEventListener('mouseout', hideIconHint);
logoutBtn.addEventListener('mouseout', hideIconHint);