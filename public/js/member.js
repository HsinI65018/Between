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
const saveUserInfoController = async (e) => {
    const target = e.target.className.slice(5);
    const {editBtn, saveBtn, editContent, saveContent} = getUserInfoElement(target);

    if(editContent.value !== ''){
        const response = await fetch('/api/user/profile/edit', {
            method: "POST",
            body: JSON.stringify({
                "type": target,
                "data": editContent.value,
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
    saveBtn.classList.add('hide');
    editBtn.classList.remove('hide');
    editContent.classList.add('hide');
    saveContent.classList.remove('hide');
}
saveNameBtn.addEventListener('click', saveUserInfoController);
savePasswordBtn.addEventListener('click', saveUserInfoController);


//// upload photo
const userEmail = document.querySelector('.save-user-email');
const uploadFile = document.querySelector('input[type="file"]');
const uploadFileController = async () => {
    const [ fileName, path ] = userEmail.textContent.split('@');
    let fileData = new FormData();
    fileData.append('file', uploadFile.files[0], `${fileName}.jpg`);

    const response = await fetch('/api/user/profile/upload', {
        method: "POST",
        body: fileData,
    });

    const data = await response.json();
    const userImage = document.querySelector('.upload-image');

    userImage.src = data.imgURL;
    userImage.classList.add('upload');
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
    // const condition = document.querySelector('.condition-value').value;

    const response = await fetch('/api/user/profile/update', {
        method: "POST",
        body: JSON.stringify({
            "location": location,
            "introduction": introduction,
            "type": typeValue,
            "sex": sexValue,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    if(data.success === true) window.location = '/member';
}


//// profile form controller
const profileForm = document.querySelector('form');
const errorContainer = document.querySelector('.error-container');
const saveProfileController = async (e) => {
    e.preventDefault();
    const location = document.querySelector('.location-value').value;
    const introduction = document.querySelector('.intro-value').value;
    let typeValue = [...new Set(typeList)].join('');

    const response = await fetch('/api/user/profile/');
    const data = await response.json();
    const profileData = data.data;

    if(profileData.location === null && profileData.introduction === null && profileData.type === null && profileData.sex === null){
        if(typeValue.length < 4 || sexValue === undefined){
            errorContainer.classList.remove('hide');
            return
        }
        let prevType = [];
        for(let i = 0; i < typeValue.length; i++){
            if(typeValue[i] === 'E' || typeValue[i] === 'I'){
                prevType[0] = typeValue[i]
            }else if(typeValue[i] === 'S' || typeValue[i] === 'N'){
                prevType[1] = typeValue[i]
            }else if(typeValue[i] === 'T' || typeValue[i] === 'F'){
                prevType[2] = typeValue[i]
            }else if(typeValue[i] === 'J' || typeValue[i] === 'P'){
                prevType[3] = typeValue[i]
            }
        }
        typeValue = prevType.join('');
        // console.log(typeValue)
        console.log('first')
        fetchUpdateAPI(typeValue);
    }else{
        if(profileData.location === location && profileData.introduction === introduction && typeValue === '' && sexValue === undefined){
            editProfileBtn.classList.remove('hide');
            profileContainer.classList.add('hide');
        }else{
            if(sexValue === undefined) sexValue = profileData.sex;
            if(typeValue === '') typeValue = profileData.type;
    
            let prevType = [...profileData.type];
            for(let i = 0; i < typeValue.length; i++){
                if(typeValue[i] === 'E' || typeValue[i] === 'I'){
                    prevType[0] = typeValue[i]
                }else if(typeValue[i] === 'S' || typeValue[i] === 'N'){
                    prevType[1] = typeValue[i]
                }else if(typeValue[i] === 'T' || typeValue[i] === 'F'){
                    prevType[2] = typeValue[i]
                }else if(typeValue[i] === 'J' || typeValue[i] === 'P'){
                    prevType[3] = typeValue[i]
                }
            }
            typeValue = prevType.join('');
            // console.log(typeValue)
            console.log('second')
            fetchUpdateAPI(typeValue);
        }
    }
}
profileForm.addEventListener('submit', saveProfileController);


//// switch personality type controller
let typeList = [];
const typeE = document.querySelector('.type-E');
const typeI = document.querySelector('.type-I');
const typeS = document.querySelector('.type-S');
const typeN = document.querySelector('.type-N');
const typeT = document.querySelector('.type-T');
const typeF = document.querySelector('.type-F');
const typeJ = document.querySelector('.type-J');
const typeP = document.querySelector('.type-P');
const personalityController = (e)=> {
    const target = e.target.className;
    let removeItem;
    if(target === 'type-E') removeItem = 'type-I';
    if(target === 'type-I') removeItem = 'type-E';

    if(target === 'type-S') removeItem = 'type-N';
    if(target === 'type-N') removeItem = 'type-S';

    if(target === 'type-T') removeItem = 'type-F';
    if(target === 'type-F') removeItem = 'type-T';

    if(target === 'type-J') removeItem = 'type-P';
    if(target === 'type-P') removeItem = 'type-J';

    try {
        typeList = typeList.filter((item) => item !== removeItem[5])
        typeList.push(target[5]);

        const selectType = document.querySelector(`.${target}`);
        const removeType = document.querySelector(`.${removeItem}`);

        selectType.classList.add('select');
        removeType.classList.remove('select');
    } catch (error) {
        console.log('HI')
    }
}
typeE.addEventListener('click', personalityController);
typeI.addEventListener('click', personalityController);
typeS.addEventListener('click', personalityController);
typeN.addEventListener('click', personalityController);
typeT.addEventListener('click', personalityController);
typeF.addEventListener('click', personalityController);
typeJ.addEventListener('click', personalityController);
typeP.addEventListener('click', personalityController);


//// switch sex btn controller
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