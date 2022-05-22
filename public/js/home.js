//// check sigin status to decide first page
const checkSignInController = async () => {
    const response = await fetch('/api/user/');
    const data = await response.json();
    if(data.success === true){
        const userStatus = data.data.userstatus;
        if(userStatus === 0){
            window.location = '/member';
        }else{
            window.location = '/match';
        }
    }
}
checkSignInController();


//// switch signin form and signup form
const signUpContainer = document.querySelector('.sign-up-container');
const signInContainer = document.querySelector('.sign-in-container');
const signUpLink = document.querySelector('.sign-up-link');
const signInLink = document.querySelector('.sign-in-link');
const switchFormController = (e) => {
    const target = e.target.className;
    if(target === 'sign-up-link'){
        signUpContainer.classList.remove('hide-form');
        signInContainer.classList.add('hide-form');
    }else{
        signInContainer.classList.remove('hide-form');
        signUpContainer.classList.add('hide-form');
    }
}
signUpLink.addEventListener('click', switchFormController);
signInLink.addEventListener('click', switchFormController);


//// fetch login api
const signInForm = document.querySelector('.sign-in');
const signInController = async (e) => {
    e.preventDefault();
    const signInEmail = document.querySelector('.sign-in-email').value;
    const signInPassword = document.querySelector('.sign-in-password').value;

    const response = await fetch('/api/user/login', {
        method: "POST",
        body: JSON.stringify({
            "email": signInEmail,
            "password": signInPassword
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();

    if(data.success && data.userStatus === 0) window.location = '/member';
    if(data.success && data.userStatus === 1) window.location = '/match';
}
signInForm.addEventListener('submit', signInController);


//// fetch register api
const signUpForm = document.querySelector('.sign-up');
const signUpController = async (e) => {
    e.preventDefault();
    const signUpName = document.querySelector('.sign-up-name').value;
    const signUpEmail = document.querySelector('.sign-up-email').value;
    const signUpPassword = document.querySelector('.sign-up-password').value;
    const errorMsg = document.querySelector('.error-message');

    const response = await fetch('/api/user/signup', {
        method: "POST",
        body: JSON.stringify({
            "username":signUpName,
            "email": signUpEmail,
            "password": signUpPassword
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();

    if(data.success){
        window.location = '/';
    }else{
        errorMsg.textContent = data.message;
    }
}
signUpForm.addEventListener('submit', signUpController);