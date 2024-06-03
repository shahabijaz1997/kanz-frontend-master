export const hasLowerCase = (text: string) => {
    let lowerCaseLetters = /[a-z]/g;
    return text.match(lowerCaseLetters);
};
export const hasUpperCase = (text: string) => {
    let upperCaseLetters = /[A-Z]/g;
    return text.match(upperCaseLetters);
};
export const hasNumbers = (text: string) => {
    let numbers = /[0-9]/g;
    return text.match(numbers);
};
export const hasSpecialCharacters = (text: string) => {
    let specials = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/;
    return text.match(specials);
};
export const isValidEmail = (email: string) => {
    let emailValidator = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/i;
    return email.match(emailValidator);
};
export const isValidUrl = (url: string) => {
    const urlValidator = /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return urlValidator.test(url);
};