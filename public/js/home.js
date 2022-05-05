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