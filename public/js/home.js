//// check sigin status
const checkSignInController = async () => {
    const response = await fetch('/api/user/');
    const data = await response.json();
    if(data['data']) window.location = '/member';
}
checkSignInController();


//// switch sign in form and sign up from
const signUpContainer = document.querySelector('.sign-up-container');
const signInContainer = document.querySelector('.sign-in-container');
const signUpLink = document.querySelector('.sign-up-link');
const signInLink = document.querySelector('.sign-in-link');

const switchForm = (e) => {
    const target = e.target.className;
    if(target === 'sign-up-link'){
        signUpContainer.classList.remove('hide-form');
        signInContainer.classList.add('hide-form');
    }else{
        signInContainer.classList.remove('hide-form');
        signUpContainer.classList.add('hide-form');
    }
}

signUpLink.addEventListener('click', switchForm);
signInLink.addEventListener('click', switchForm);


//// fetch login api
const signInForm = document.querySelector('.sign-in');
const signInController = async (e) => {
    e.preventDefault();
    const signInEmail = document.querySelector('.sign-in-email').value;
    const signInPassword = document.querySelector('.sign-in-password').value;
    // console.log(signInEmail, signInPassword)
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
    console.log(data)
    if(data['success']){
        window.location = '/member'
    }
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
    if(data['success']){
        window.location = '/';
    }else{
        errorMsg.textContent = data['message'];
    }
}
signUpForm.addEventListener('submit', signUpController)