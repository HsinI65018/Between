//// edit user register info
const nameContainer = document.querySelector('.name-img-container');
const pwdContainer = document.querySelector('.pwd-img-container');
const editUserInfoController = (e) => {
    const actiontype = e.target.className.slice(0,4);
    const target = e.target.className.slice(5);
    const editBtn = document.querySelector(`.edit-${target}`);
    const saveBtn = document.querySelector(`.save-${target}`);
    const editContent = document.querySelector(`.edit-user-${target}`);
    const saveContent = document.querySelector(`.save-user-${target}`);

    if(actiontype === 'edit'){
        editBtn.classList.add('hide');
        saveBtn.classList.remove('hide');
        editContent.classList.remove('hide');
        saveContent.classList.add('hide');
    }else{
        editBtn.classList.remove('hide');
        saveBtn.classList.add('hide');
        editContent.classList.add('hide');
        saveContent.classList.remove('hide');
    }
}
nameContainer.addEventListener('click', editUserInfoController);
pwdContainer.addEventListener('click', editUserInfoController);

//// click edit btn to show profile form
const editProfileBtn = document.querySelector('.edit-profile');
const profileContainer = document.querySelector('.profile-container');
const showProfile = () => {
    editProfileBtn.classList.add('hide');
    profileContainer.classList.remove('hide');
}
editProfileBtn.addEventListener('click', showProfile);

//// profile form controller
const profileForm = document.querySelector('form');
const saveProfileController = (e) => {
    e.preventDefault();
    editProfileBtn.classList.remove('hide');
    profileContainer.classList.add('hide');
}
profileForm.addEventListener('submit', saveProfileController);