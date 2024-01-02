import { Tabs, Tab } from 'react-bootstrap';
import { useState, useEffect, useRef } from "react";
import './payment.css';
import visa from "./images/visa-card.png"
import mastercard from "./images/mastercard-card.png"
import validation from "./validation";
import { useDispatch } from 'react-redux';
import { creditCard, creditCardErrors } from '../../redux/actions';

export default function Payment({ handlePayment, inputRef }) {

    const [isFocused, setIsFocused] = useState({
        cardHolder: false,
        cardNumber: false,
        cardExpiration: false,
        cardCVC: false,
    });

    //Add a blue color to the border-bottom inputs 
    const handleFocusChange = (event) => {
        const { name } = event.target;
        setIsFocused({
            [name]: true,
        });
    };

    //We set errors with this state
    const [errors, setErrors] = useState({});

    //Shows the status errors of inputs
    const [showErrors, setShowErrors] = useState({
        cardHolder: false,
        cardNumber: false,
        cardCVC: false,
    });

    //function thats validate if all fields of inputs are correctly
    function isErrors(obj) {
        let isErrors = Object.keys(errors).length;

        for (let el in obj) {
            if (obj[el] === true && isErrors === 0) {
                return true;
            }

            else {
                return false;
            }
        }
    }

    const [userData, setUserData] = useState({
        cardHolder: "",
        cardNumber: "",
        cardExpirationMonth: "",
        cardExpirationYear: "",
        cardCVC: "",
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(creditCard(userData));
        dispatch(creditCardErrors(errors))
    }, [errors])

    const handleBlur = (event) => {
        const { name } = event.target;
        setShowErrors({
            ...showErrors,
            [name]: true
        }); // Mostrar errores después de desenfocar
        setErrors(validation(userData));
    };

    const handleChange = (event) => {
        let { name, value } = event.target;

        if (name === 'cardHolder' && !/^\D*$/.test(value)) {
            return;
        }

        // Validar solo números en el campo de número de tarjeta
        if (name === 'cardNumber' && !/^\d*$/.test(value)) {
            return;
        }

        if (name === 'cardCVC' && !/^\d*$/.test(value)) {
            return;
        }

        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validation(userData));
    }

    return (
        <div className='vh-100 gradient-custom userLogin-container'>
            <div className="container py-5 h-1005">
                <div className="row d-flex justify-content-center align-items-center w-100 h-100">
                    <div className="col-lg-7 mx-auto">
                        <span onClick={handlePayment}
                            className="material-symbols-outlined d-flex text-white fs-2 border-0 w-100 justify-content-end btn cursor-pointer"
                            id="close-icon">
                            close
                        </span>
                        <div className="bg-white rounded-lg shadow-sm p-5">
                            {/* Credit card form tabs */}
                            <Tabs defaultActiveKey="card" id="payment-tabs" className="nav-pills nav-fill mb-3">
                                <Tab eventKey="card" title="Credit Card">
                                    {/* credit card form content */}
                                    <div className="d-flex justify-content-between tab-pane fade show active">
                                        <form onSubmit={handleSubmit} className='input-container d-flex gap-3 flex-column w-50' action="#">
                                            <div>
                                                <label className='d-flex gap-1' htmlFor='name'>Cardholder
                                                    <span className="material-symbols-outlined">
                                                        credit_card
                                                    </span>
                                                </label>
                                                <input onFocus={handleFocusChange}
                                                    ref={inputRef}
                                                    name='cardHolder'
                                                    onBlur={handleBlur}
                                                    className={`custom-cardInput ${isFocused.cardHolder ? 'focused' : ''}`}
                                                    autoComplete="off"
                                                    onChange={handleChange}
                                                    maxLength={15}
                                                    value={userData.cardHolder} type="text" placeholder='Jhon Travolta' />
                                                {showErrors.cardHolder && errors.cardHolder ? (
                                                    <p className='text-danger'>{errors.cardHolder}</p>
                                                ) : null}
                                            </div>

                                            <div>
                                                <label className='d-flex align-items-center gap-1' htmlFor='name'>Number of card</label>
                                                <input onFocus={handleFocusChange}
                                                    name='cardNumber'
                                                    onBlur={handleBlur}
                                                    className={`custom-cardInput ${isFocused.cardNumber ? 'focused' : ""}`}
                                                    autoComplete="off"
                                                    onChange={handleChange}
                                                    maxLength={16}
                                                    value={userData.cardNumber} type="text" placeholder='7654 3102 9218 4808' />
                                                <div className='d-flex gap-1'>
                                                    <img style={{ width: "30px" }} src={visa} alt="visa-icon" />
                                                    <img style={{ width: "30px" }} src={mastercard} alt="visa-icon" />
                                                </div>
                                                {showErrors.cardNumber && errors.cardNumber ? (
                                                    <p className='text-danger'>{errors.cardNumber}</p>
                                                ) : null}
                                            </div>

                                            <div>
                                                <label htmlFor="expiration">Expiration</label>
                                                <div className='expirationBox'>
                                                    <select name='cardExpirationMonth' onBlur={handleBlur} onChange={handleChange} value={userData.cardExpirationMonth} id="month">
                                                        <option value="10">10</option>
                                                        <option value="11">11</option>
                                                        <option value="12">12</option>
                                                    </select>
                                                    <span className='text-dark'>/</span>
                                                    <select name='cardExpirationYear' onBlur={handleBlur} onChange={handleChange} value={userData.cardExpirationYear} id="year">
                                                        <option value="23">23</option>
                                                        <option value="24">24</option>
                                                        <option value="25">25</option>
                                                        <option value="26">26</option>
                                                        <option value="27">27</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="cvc">CVC</label>
                                                <input onFocus={handleFocusChange}
                                                    name='cardCVC'
                                                    onBlur={handleBlur}
                                                    className={`custom-cardInput ${isFocused.cardCVC ? 'focused' : ''}`}
                                                    autoComplete="off"
                                                    maxLength={3}
                                                    onChange={handleChange}
                                                    value={userData.cardCVC} type="text" placeholder='3 digits' />
                                                {showErrors.cardCVC && errors.cardCVC ? (
                                                    <p className='text-danger'>{errors.cardCVC}</p>
                                                ) : null}
                                            </div>
                                        </form>
                                        <div className='d-flex flex-column justify-content-evenly'>
                                            <div className='d-flex align-items-center gap-2 w-100'>
                                                <input type="checkbox" id="myCheckbox" name="myCheckbox" />
                                                <label htmlFor='myCheckbox' style={{ fontSize: "14px" }} className='text-black'>Save credit card for future purchase</label>
                                            </div>
                                            <button type='submit' onClick={isErrors(showErrors) ? handlePayment : null} className='btn btn-warning shadow'>Add credit card</button>
                                        </div>
                                    </div>

                                </Tab>
                                <Tab eventKey="paypal" title="Paypal">
                                    {/* Paypal form content */}
                                    <div className="paypalContainer tab-pane d-flex flex-column align-items-center justify-content-center">
                                        <form action="#" className="paypalForm d-flex flex-column gap-3">
                                            <img className='paypal-logo' src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg" alt="paypal-logo" />
                                            <div className="d-flex flex-column gap-1">
                                                <div className="input-wrapper">
                                                    <input type="text" className="paypalInput" id="email" required />
                                                    <label htmlFor="email" className="placeholder-label">Email or number phone</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <div className="input-wrapper">
                                                    <input type="password" className="paypalInput" id="password" required />
                                                    <label htmlFor="password" className="placeholder-label">Password</label>
                                                </div>
                                                <a href="#" className="text-primary">Forgot password?</a>
                                            </div>
                                            <button className="logInButton">Log in</button>
                                            <div className='loginSignUpSeparator'>
                                                <span className='textInSeparator'>or</span>
                                            </div>
                                            <button className='signUpButton'>Sign up</button>
                                        </form>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
