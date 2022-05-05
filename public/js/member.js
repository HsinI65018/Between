const nameContainer = document.querySelector('.name-img-container');
const pwdContainer = document.querySelector('.pwd-img-container');

const editUserInfoController = (e) => {
    const actiontype = e.target.className;
    const target = e.target.className.slice(5);
    const editBtn = document.querySelector(`.edit-${target}`);
    const saveBtn = document.querySelector(`.save-${target}`);
    const editContent = document.querySelector(`.edit-user-${target}`);
    const saveContent = document.querySelector(`.save-user-${target}`);

    if(actiontype.includes('edit')){
        editBtn.classList.add('hide');
        saveBtn.classList.remove('hide');
        editContent.classList.add('hide');
        saveContent.classList.remove('hide');
    }else{
        editBtn.classList.remove('hide');
        saveBtn.classList.add('hide');
        editContent.classList.remove('hide');
        saveContent.classList.add('hide');
    }
}
nameContainer.addEventListener('click', editUserInfoController);
pwdContainer.addEventListener('click', editUserInfoController);
