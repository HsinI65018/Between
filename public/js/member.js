//// get EDIT and SAVE element
const getUserInfoElement = (target) => {
    const editBtn = document.querySelector(`.edit-${target}`);
    const saveBtn = document.querySelector(`.save-${target}`);
    const editContent = document.querySelector(`.edit-user-${target}`);
    const saveContent = document.querySelector(`.save-user-${target}`);
    return {"editBtn": editBtn, "saveBtn": saveBtn, "editContent": editContent, "saveContent": saveContent}
}


//// EDIT button controller
const editNameBtn = document.querySelector('.edit-username');
const editPasswordBtn = document.querySelector('.edit-password');
const editUserInfoController = (e) => {
    const target = e.target.className.slice(5);
    const {editBtn, saveBtn, editContent, saveContent} = getUserInfoElement(target);

    editBtn.classList.add('hide');
    saveBtn.classList.remove('hide');
    editContent.classList.remove('hide');
    saveContent.classList.add('hide');
}
editNameBtn.addEventListener('click', editUserInfoController);
editPasswordBtn.addEventListener('click', editUserInfoController);


//// SAVE button controller
const saveNameBtn = document.querySelector('.save-username');
const savePasswordBtn = document.querySelector('.save-password');
const userEmail = document.querySelector('.save-user-email');
const saveUserInfoController = async (e) => {
    const target = e.target.className.slice(5);
    const {editBtn, saveBtn, editContent, saveContent} = getUserInfoElement(target);

    if(editContent.value !== ''){
        const response = await fetch('/api/user/edit', {
            method: "POST",
            body: JSON.stringify({
                "type": target,
                "data": editContent.value,
                "email": userEmail.textContent
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
    
        const data = await response.json();
        const updateUserName = document.querySelector('.save-user-username');
        if(data['success'] === true & target === 'username') updateUserName.textContent = editContent.value;
    }

    editContent.value = '';
    editBtn.classList.remove('hide');
    saveBtn.classList.add('hide');
    editContent.classList.add('hide');
    saveContent.classList.remove('hide');
}
saveNameBtn.addEventListener('click', saveUserInfoController);
savePasswordBtn.addEventListener('click', saveUserInfoController);

//// upload photo




//// click edit btn show profile form
const editProfileBtn = document.querySelector('.edit-profile');
const profileContainer = document.querySelector('.profile-container');
const showProfileController = () => {
    editProfileBtn.classList.add('hide');
    profileContainer.classList.remove('hide');
}
editProfileBtn.addEventListener('click', showProfileController);


//// profile form controller
const profileForm = document.querySelector('form');
const saveProfileController = (e) => {
    e.preventDefault();
    editProfileBtn.classList.remove('hide');
    profileContainer.classList.add('hide');
}
profileForm.addEventListener('submit', saveProfileController);