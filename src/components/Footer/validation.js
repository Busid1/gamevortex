const nameRegex = /^[a-zA-Z]{3,}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validation = (userData) => {
    let errors = {};

    if(!nameRegex.test(userData.name)){
        errors.name = "Invalid name!!"
    }

    if(!emailRegex.test(userData.email)){
        errors.email = "Invalid email!!"
    }

    return errors;
}

export default validation;