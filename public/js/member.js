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
        const response = await fetch('/api/user/profile/edit', {
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
const uploadFile = document.querySelector('input[type="file"]');
const uploadFileController = async () => {
    const [fileName, path] = userEmail.textContent.split('@');
    let fileData = new FormData();
    fileData.append('file', uploadFile.files[0], `${fileName}.jpg`);

    const response = await fetch('/api/user/profile/upload', {
        method: "POST",
        body: fileData
    });
    const data = await response.json();
    const userImage = document.querySelector('.upload-image');
    userImage.src = data.imgURL;
    userImage.classList.add('upload');
    console.log(data)
}
uploadFile.addEventListener('change', uploadFileController)


//// click edit btn show profile form
const editProfileBtn = document.querySelector('.edit-profile');
const profileContainer = document.querySelector('.profile-container');
const showProfileController = () => {
    editProfileBtn.classList.add('hide');
    profileContainer.classList.remove('hide');
}
editProfileBtn.addEventListener('click', showProfileController);



//// fetch profile update API
const fetchUpdateAPI = async (typeValue) => {
    const location = document.querySelector('.location-value').value;
    const introduction = document.querySelector('.intro-value').value;
    const condition = document.querySelector('.condition-value').value;

    const response = await fetch('/api/user/profile/update', {
        method: "POST",
        body: JSON.stringify({
            "location": location,
            "introduction": introduction,
            "type": typeValue,
            "sex": sexValue,
            "condition": condition
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    
    if(data.success === true){
        window.location = '/member'
    }
}


//// profile form controller [Fix]
const profileForm = document.querySelector('form');
const saveProfileController = async (e) => {
    e.preventDefault();
    let  typeValue = [...new Set(typeList)].join('');

    const response = await fetch('/api/user/profile/');

    if(response.ok === false){
        fetchUpdateAPI(typeValue);
    }

    const data = await response.json();
    const profileData = data.data;
    
    if(profileData.location === location && profileData.introduction === introduction && profileData.searchCondition === condition && typeValue === '' && sexValue === undefined){
        editProfileBtn.classList.remove('hide');
        profileContainer.classList.add('hide');
    }else{
        if(typeValue === ''){ typeValue = profileData.type };
        if(sexValue === undefined){ sexValue = profileData.sex };

        fetchUpdateAPI(typeValue);
    }
}
profileForm.addEventListener('submit', saveProfileController);


////
let typeList = [];
const typeE = document.querySelector('.type-E');
const typeI = document.querySelector('.type-I');
const typeOneController  = (e)=> {
    const target = e.target.className;
    if(target.includes('type-E')){
        typeList = typeList.filter((item) => item !== 'I')
        typeList.push('E');
        typeE.classList.add('select');
        typeI.classList.remove('select')
    }else{
        typeList = typeList.filter((item) => item !== 'E')
        typeList.push('I');
        typeE.classList.remove('select');
        typeI.classList.add('select')
    }
    
}
typeE.addEventListener('click', typeOneController);
typeI.addEventListener('click', typeOneController);

const typeS = document.querySelector('.type-S');
const typeN = document.querySelector('.type-N');
const typeTwoController  = (e)=> {
    const target = e.target.className;
    if(target.includes('type-S')){
        typeList = typeList.filter((item) => item !== 'N')
        typeList.push('S');
        typeS.classList.add('select');
        typeN.classList.remove('select')
    }else{
        typeList = typeList.filter((item) => item !== 'S')
        typeList.push('N');
        typeS.classList.remove('select');
        typeN.classList.add('select')
    }
    
}
typeS.addEventListener('click', typeTwoController);
typeN.addEventListener('click', typeTwoController);

const typeT = document.querySelector('.type-T');
const typeF = document.querySelector('.type-F');
const typeThreeController  = (e)=> {
    const target = e.target.className;
    if(target.includes('type-T')){
        typeList = typeList.filter((item) => item !== 'F')
        typeList.push('T');
        typeT.classList.add('select');
        typeF.classList.remove('select')
    }else{
        typeList = typeList.filter((item) => item !== 'T')
        typeList.push('F');
        typeT.classList.remove('select');
        typeF.classList.add('select')
    }
    
}
typeT.addEventListener('click', typeThreeController);
typeF.addEventListener('click', typeThreeController);

const typeJ = document.querySelector('.type-J');
const typeP = document.querySelector('.type-P');
const typeFourController  = (e)=> {
    const target = e.target.className;
    if(target.includes('type-J')){
        typeList = typeList.filter((item) => item !== 'P')
        typeList.push('J');
        typeJ.classList.add('select');
        typeP.classList.remove('select')
    }else{
        typeList = typeList.filter((item) => item !== 'J')
        typeList.push('P');
        typeJ.classList.remove('select');
        typeP.classList.add('select')
    }
    
}
typeJ.addEventListener('click', typeFourController);
typeP.addEventListener('click', typeFourController);


/////
let sexValue;
const male = document.querySelector('.sex-M');
const female = document.querySelector('.sex-F');
const bisexual = document.querySelector('.sex-B');
const sexController = (e) => {
    const target = e.target.className;
    if(target.includes('sex-M')){
        sexValue = 'Male';
        male.classList.add('click-btn');
        female.classList.remove('click-btn');
        bisexual.classList.remove('click-btn');
    }else if(target.includes('sex-F')){
        sexValue = 'Female';
        male.classList.remove('click-btn');
        female.classList.add('click-btn');
        bisexual.classList.remove('click-btn');
    }else{
        sexValue = 'Bisexual';
        male.classList.remove('click-btn');
        female.classList.remove('click-btn');
        bisexual.classList.add('click-btn');
    }
}
male.addEventListener('click', sexController);
female.addEventListener('click', sexController);
bisexual.addEventListener('click', sexController);