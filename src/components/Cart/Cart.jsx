import { useSelector } from "react-redux";
import "./cart.css";
import { useState, useEffect } from "react";
import { removeFromCart } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Payment from "../Payment/Payment";
import PaymentGateway from "../PaymentGateway/PaymentGateway";
import { HOME_URL } from "../../App";
import randomstring from "randomstring";
import useFirestore from "../Login/app/firestore";
import { useCart } from "../../contexts/CartContext";

export default function Cart({ inputRef, focusInput }) {
    const [gamesInCart, setGamesInCart] = useState(useSelector(state => state.gamesInCart));
    const [gameCounts, setGameCounts] = useState({}); // Inicialmente, no hay cantidades para ningún juego
    //Accedemos al ultimo array ya que este tendra todos los valores validos de la tarjeta y asi no se duplican los elementos
    const creditCardData = useSelector(state => state.creditCard.slice(-1)[0]);
    const creditCardErrors = useSelector(state => state.creditCardErrors.slice(-1)[0]);
    const [lastCreditCard, setLastCreditCard] = useState("");
    const { cartVideogames } = useCart();
    const { handleRemoveGameFromUserCart } = useFirestore();
    const { handleRemoveGameFromCartContext } = useCart();

    const creditCardComponent = creditCardData ? (
        <div className="creditCardBox">
            <h3>Card holder: {lastCreditCard.cardHolder}</h3>
            <h3>Number: {lastCreditCard.cardNumber}</h3>
            <h3>Expiration: {lastCreditCard.cardExpirationMonth}/{lastCreditCard.cardExpirationYear}</h3>
            <h3>CVC: {lastCreditCard.cardCVC}</h3>
        </div>
    ) : (null);

    useEffect(() => {
        // Obtener las claves del objeto gameCounts
        const keys = Object.keys(gameCounts);

        // Crear un nuevo objeto con las claves y valores inicializados en 1
        const initialGameCounts = Object.fromEntries(keys.map(key => [key, 1]));

        // Establecer el objeto inicializado en 1 en el estado
        setGameCounts(initialGameCounts);
    }, []);

    const dispatch = useDispatch();
    const filterGames = cartVideogames.length > 0 ? cartVideogames : gamesInCart.filter((elem, index, arr) => {
        // Usa `findIndex` para encontrar el índice del primer elemento con el mismo ID
        const firstIndex = arr.findIndex((el) => el.id === elem.id);
        // Devuelve `true` solo si el índice actual coincide con el primer índice encontrado
        return firstIndex === index;
    });

    const filterDelGame = (id) => {
        const newGamesInCart = filterGames.filter(game => game.id !== id);
        setGamesInCart(newGamesInCart);
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify({ [id]: true }));
        dispatch(removeFromCart(id));
        handleRemoveGameFromUserCart(id);
        handleRemoveGameFromCartContext(id);
    }

    const gamesAddsInCart = filterGames.map((game) => (
        <div key={game.id} className="cart-box shadow rounded d-flex gap-3">
            <img className="rounded" src={game.image} alt={game.title} />
            <div className="d-flex flex-column justify-content-center">
                <Link to={`${HOME_URL}/${game.title}`} className="gameTitle text-warning">
                    {game.title}
                </Link>
                <span className="gamePrice">{game.price}</span>
                <div id={game.id} className="d-flex gap-1 align-items-center">
                    <span className="gameAmount">Amount:</span>
                    <select name="amount" id="">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <button onClick={() => filterDelGame(game.id)} className="cartBtns material-symbols-outlined btn btn-danger p-1">
                        delete
                    </button>
                </div>
            </div>
        </div>
    ));

    let prices = filterGames.map(game => {
        const roundedPrice = (parseFloat(game.price));
        return parseFloat(roundedPrice);
    });

    if (prices.length < 1) {
        prices = [0];
    }

    let total = prices.reduce((a, b) => a + b);

    const [isBuyGame, setIsBuyGame] = useState(false);
    const [isSpinner, setIsSpinner] = useState(true);
    const [isBuyGameAlert, setIsBuyGameAlert] = useState(false);

    const spinnerTimeout = () => setTimeout(() => {
        setIsSpinner(false);
    }, 1000);

    const buyGameAlertTimeout = () => {
        setIsBuyGameAlert(!isBuyGameAlert);
    };

    const [closePayment, setClosePayment] = useState(false);
    const handleClosePayment = () => {
        setClosePayment(!closePayment);
    }

    const [isPaymentCorrect, setIsPaymentCorrect] = useState(false);
    const handlePaymentCorrect = () => {
        setIsPaymentCorrect(!isPaymentCorrect);
    }

    const [editPayment, setEditPayment] = useState(false);
    const handleEditPayment = () => {
        if (editPayment) {
            setEditPayment(false);
            setClosePayment(false);
        }
        else {
            setEditPayment(true);
            setClosePayment(true);
        }
    }

    const [addPayment, setAddPayment] = useState(false);
    const handleAddPayment = () => {
        if (addPayment) {
            setAddPayment(true);
            setClosePayment(true);
        }
        else {
            handlePaymentCorrect();
            setAddPayment(false);
            setClosePayment(false);
            setLastCreditCard({ ...creditCardData })
        }
    }

    const [isActivateCode, setIsActivateCode] = useState(false);
    const handleBuyGame = () => {
        let isAnyGame = Object.keys(filterGames).length;
        let isErrors = Object.keys(creditCardErrors).length;

        if (isAnyGame > 0 && isErrors === 0) {
            setIsBuyGame(true);
            spinnerTimeout();
            buyGameAlertTimeout();
            setIsActivateCode(true);
        }
        else {
            setIsBuyGame(false);
        }
    }

    const [creditCardValid, setCreditCardValid] = useState(false);

    //function thats validate if all fields of inputs are correctly
    const isErrors = (obj, errors) => {
        let hasErrors = Object.keys(errors).length;

        for (let el in obj) {
            if (obj[el] === true && hasErrors === 0) {
                setCreditCardValid(true);
                return true;
            }

            else {
                setCreditCardValid(false);
                return false;
            }
        }
    }

    return (
        <div className="cart-container text-white pb-4">
            <PaymentGateway
                isPaymentCorrect={creditCardValid}
                isActivateCode={isActivateCode}
            />
            <div className="cartGamesResume-box">
                <div className="cartGamesContainer w-100">
                    <h2>Cart</h2>
                    {
                        gamesInCart.length === 0 && cartVideogames.length === 0 ?
                            <div className="emptyCart-box">
                                <h3>The cart is empty :(</h3>
                            </div>
                            :
                            <div className="cartGamesBox">
                                {gamesAddsInCart}
                            </div>
                    }
                </div>
                <div className="resumeGamesContainer">
                    <h2 className="">Resume</h2>
                    <div className="rounded py-3 resumeGamesBox d-flex flex-column align-items-center">
                        <span>Total: {total.toFixed(2)}$</span>
                        {
                            creditCardValid ?
                                <button id="editPayment" onClick={() => { handleEditPayment(); focusInput(); }} className="d-flex align-items-center gap-2 fs-6 btn btn-info shadow mt-3">
                                    Edit payment
                                    <span className="material-symbols-outlined">
                                        credit_card_gear
                                    </span>
                                </button>
                                :
                                <button onClick={() => { handleClosePayment(); focusInput(); }} className="d-flex align-items-center gap-2 fs- btn btn-warning shadow mt-3">
                                    Add payment
                                    <span className="material-symbols-outlined">
                                        add_card
                                    </span>
                                </button>
                        }

                        {lastCreditCard && creditCardData ? creditCardComponent : null}

                        {creditCardValid ? (
                            <div>
                                <button onClick={handleBuyGame} className="d-flex align-items-center gap-2 fs-5 btn btn-success shadow mt-3">
                                    Buy game/s
                                    <span className="material-symbols-outlined">
                                        payments
                                    </span>
                                </button>
                                {isBuyGameAlert ?
                                    <div style={{ display: isBuyGame ? "flex" : "none" }} className="activationCode-container">
                                        {isSpinner ?
                                            <span className="spinner"></span>
                                            :
                                            <div className="activationCode-box">
                                                <p className="buyGameMessage">
                                                    The purchase was successfully.
                                                    <br></br>
                                                    The game/s code is below this message:
                                                </p>
                                                <div className="d-flex flex-column gap-2">
                                                    {
                                                        filterGames.map(({ title, id }) => (
                                                            <div key={id} className="d-flex justify-content-between gap-3">
                                                                <span className="text-warning" key={id}>{title}</span>
                                                                <span className="text-warning" key={id}>{randomstring.generate({ length: 10, charset: 'alphanumeric' })}</span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <Link to={HOME_URL} className="d-flex justify-content-center mt-3">
                                                    <button className="btn btn-primary">
                                                        Go to home page
                                                    </button>
                                                </Link>
                                            </div>
                                        }
                                    </div>
                                    :
                                    (null)
                                }

                            </div>
                        ) : null}

                        {
                            closePayment ? <Payment
                                handlePaymentCorrect={handlePaymentCorrect}
                                handleClosePayment={handleClosePayment}
                                handleAddPayment={handleAddPayment}
                                creditCardData={creditCardData}
                                inputRef={inputRef}
                                isErrors={isErrors}
                            /> :
                                null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}