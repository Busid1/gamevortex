import "./cart.css";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { removeFromCart } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Payment from "../Payment/Payment";
import PaymentGateway from "../PaymentGateway/PaymentGateway";
import { HOME_URL } from "../../App";
import useFirestore from "../Login/app/firestore";
import { useCart } from "../../contexts/CartContext";

export default function Cart({ focusInput }) {
    const [gamesInCart, setGamesInCart] = useState(useSelector(state => state.gamesInCart));
    const [gameCounts, setGameCounts] = useState({}); // Inicialmente, no hay cantidades para ningún juego
    //Accedemos al ultimo array ya que este tendra todos los valores validos de la tarjeta y asi no se duplican los elementos
    const creditCardData = useSelector(state => state.creditCard.slice(-1)[0]);
    const creditCardErrors = useSelector(state => state.creditCardErrors.slice(-1)[0]);
    const [lastCreditCard, setLastCreditCard] = useState("");
    const { cartVideogames } = useCart();
    const { handleRemoveGameFromUserCart, handleDeleteAllGamesFromUserCart } = useFirestore();
    const { handleRemoveGameFromCartContext, handleDeleteAllGamesFromCartContext } = useCart();

    const creditCardComponent = creditCardData ? (
        <div className="creditCardBox">
            <h3>Card holder: {lastCreditCard.cardHolder}</h3>
            <h3>Number: {lastCreditCard.cardNumber}</h3>
            <h3>Expiration: {lastCreditCard.cardExpirationMonth}/{lastCreditCard.cardExpirationYear}</h3>
            <h3>CVC: {lastCreditCard.cardCVC}</h3>
        </div>
    ) : (null);

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

    useEffect(() => {
        // Get the keys of the filterGames object
        const keys = filterGames.map(game => game.id);

        // Create a new object with keys and values initialized to 1
        const initialGameCounts = Object.fromEntries(keys.map(key => [key, 1]));

        // Set the initialized object to state
        setGameCounts(initialGameCounts);
    }, []);

    const handleAmountValue = (e, gameId) => {
        setGameCounts((prevCounts) => ({
            ...prevCounts,
            [gameId]: Number(e.target.value),
        }));
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
                    <select className="rounded me-1" name="amount" onChange={(e) => handleAmountValue(e, game.id)}>
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
        const count = gameCounts[game.id] || 1;
        const roundedPrice = (parseFloat(game.price) * count).toFixed(2);
        return parseFloat(roundedPrice);
    });

    if (prices.length < 1) {
        prices = [0];
    }

    let total = prices.reduce((a, b) => a + b, 0);

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
                                <Payment total={total} />
                        }

                        {lastCreditCard && creditCardData ? creditCardComponent : null}
                    </div>
                </div>
            </div>
        </div>
    )
}