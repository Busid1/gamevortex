const cardHolder = /^\D{5,15}$/;
const cardNumber = /^\d{16}$/;
const cardCVC = /^\d{3}$/;

const validation = (userData) => {
    let errors = {};

    if(!cardHolder.test(userData.cardHolder)){
        errors.cardHolder = "The name is required!!"
    }

    if(!cardNumber.test(userData.cardNumber)){
        errors.cardNumber = "Must contain 16 digits!!"
    }

    if(!cardCVC.test(userData.cardCVC)){
        errors.cardCVC = "Must contain 3 digits!!"
    }

    return errors;
}

export default validation;