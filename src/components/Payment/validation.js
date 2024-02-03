const cardHolder = /^\D{5,15}$/;
const cardNumber = /^\d{16}$/;
const cardExpirationMonth = /^[01]\d|1[0-2]$/;
const cardExpirationYear = /^2[4-9]|[3-9]\d$/;
const cardCVC = /^\d{3}$/;

const validation = (userData) => {
    let errors = {};

    if(!cardHolder.test(userData.cardHolder)){
        errors.cardHolder = "The name is required!!";
    }

    if(!cardNumber.test(userData.cardNumber)){
        errors.cardNumber = "Must contain 16 digits!!";
    }

    if(!cardExpirationMonth.test(userData.cardExpirationMonth)){
        errors.cardExpirationMonth = "Chose month expiration!!"
    }

    if(!cardExpirationYear.test(userData.cardExpirationYear)){
        errors.cardExpirationYear = "Chose year expiration!!";
    }

    if(!cardCVC.test(userData.cardCVC)){
        errors.cardCVC = "Must contain 3 digits!!";
    }

    return errors;
}

export default validation;