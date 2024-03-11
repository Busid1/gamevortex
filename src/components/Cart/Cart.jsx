import { useSelector } from "react-redux";
import "./cart.css";
import { useState, useEffect } from "react";
import { removeFromCart } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Payment from "../Payment/Payment";
import PaymentGateway from "../PaymentGateway/PaymentGateway";
import { HOME_URL } from "../../App";

export default function Cart({ handleRemoveFromCart, inputRef, focusInput, titleLength }) {
    const [gamesInCart, setGamesInCart] = useState(useSelector(state => state.gamesInCart));
    const [gameCounts, setGameCounts] = useState({}); // Inicialmente, no hay cantidades para ningún juego
    //Accedemos al ultimo array ya que este tendra todos los valores validos de la tarjeta y asi no se duplican los elementos
    const creditCardData = useSelector(state => state.creditCard.slice(-1)[0]);
    const creditCardErrors = useSelector(state => state.creditCardErrors.slice(-1)[0]);
    const [lastCreditCard, setLastCreditCard] = useState("");
    console.log(gamesInCart);
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
    }, [])

    const dispatch = useDispatch();

    const increaseCount = (gameId) => {
        setGameCounts((prevCounts) => ({
            // Hace una copia de lo que haya anteriormente
            ...prevCounts,
            // Se pasa por parametro el id del juego, despues determina si hay algo en el id 
            // pasado por parametro en caso de no haber nada se establece en 0 y se suma 1.
            [gameId]: (prevCounts[gameId] || 1) + 1,
        }));
    };

    const decreaseCount = (gameId) => {
        setGameCounts((prevCounts) => ({
            ...prevCounts,
            // Esto es similar a lo otro solo que aqui se usa esta funcion 'Math.max()' para
            // impedir que se llegue a numeros negativos.
            [gameId]: Math.max((prevCounts[gameId] || 1) - 1, 1),
        }));
    };

    const filterGames = gamesInCart.filter((elem, index, arr) => {
        // Usa `findIndex` para encontrar el índice del primer elemento con el mismo ID
        const firstIndex = arr.findIndex((el) => el.id === elem.id);
        // Devuelve `true` solo si el índice actual coincide con el primer índice encontrado
        return firstIndex === index;
    });

    const filterDelGame = (id) => {
        const newGamesInCart = filterGames.filter(game => game.id !== id)
        setGamesInCart(newGamesInCart);
        handleRemoveFromCart();
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify({ [id]: true }));
        dispatch(removeFromCart(id));
    }

    const gamesAddsInCart = filterGames.map((game) => (
        <div key={game.id} className="cart-box bg-secondary shadow rounded d-flex gap-3">
            <img className="rounded-start" src={game.image} alt={game.title} />
            <div className="d-flex flex-column justify-content-center">
                <Link to={`${HOME_URL}/${game.title}`} className="gameTitle text-warning">
                    {game.title}
                </Link>
                <span className="gamePrice">{game.price}</span>
                <div id={game.id} className="d-flex gap-1 align-items-center">
                    <span className="gameAmount">Amount:</span>
                    <span id={game.id} onClick={() => increaseCount(game.id)} className="cartBtns material-symbols-outlined btn btn-dark p-1">
                        add
                    </span>
                    {/* Accede al objeto que se le pasa por id, en caso de que dentro de 
                        ese objeto no haya nada pues gameCount sera igual a 0 */}
                    <span className="cartBtns" id={game.id}>{gameCounts[game.id] || 1}</span>
                    <span onClick={() => decreaseCount(game.id)} className="cartBtns material-symbols-outlined btn btn-dark p-1">
                        remove
                    </span>
                    <button onClick={() => filterDelGame(game.id)} className="cartBtns material-symbols-outlined btn btn-danger p-1">
                        delete
                    </button>
                </div>
            </div>
        </div>
    ));

    let prices = filterGames.map(game => {
        const roundedPrice = (parseFloat(game.price) * gameCounts[game.id]).toFixed(2);
        return parseFloat(roundedPrice);
    });

    if (prices.length < 1) {
        prices = [0];
    }

    let total = prices.reduce((a, b) => a + b);

    const [isBuyGame, setIsBuyGame] = useState(false);
    const [isSpinner, setIsSpinner] = useState(true);
    const [isBuyGameAlert, setIsBuyGameAlert] = useState(true);

    const spinnerTimeout = () => setTimeout(() => {
        setIsSpinner(false);
    }, 1000);

    const buyGameAlertTimeout = () => setTimeout(() => {
        setIsBuyGameAlert(false);
        window.location.href = 'http://localhost:3000';
    }, 11000);

    const [closePayment, setClosePayment] = useState(false);
    const handleClosePayment = () => {
        if (closePayment) {
            setClosePayment(false);
        }
        else {
            setClosePayment(true);
        }
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
            setAddPayment(false);
            setClosePayment(false);
            setLastCreditCard({ ...creditCardData })
        }
    }

    const [counter, setCounter] = useState(11);

    const decreaseCounter = () => {
        if (counter > 0) {
            setCounter(prevCounter => prevCounter - 1);
        }
        else {
            setCounter(0);
        }
    }

    const handleBuyGame = () => {
        let isAnyGame = Object.keys(filterGames).length;
        let isErrors = Object.keys(creditCardErrors).length;

        if (isAnyGame > 0 && isErrors === 0) {
            setIsBuyGame(true);
            spinnerTimeout();
            buyGameAlertTimeout();
            setInterval(decreaseCounter, 1000);
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
            <PaymentGateway />
            <div className="cartGamesResume-box">
                <div className="cartGamesBox d-flex flex-column">
                    {gamesAddsInCart}
                </div>
                <div className="bg-secondary rounded py-3 resumeGamesBox d-flex flex-column align-items-center">
                    <h2 className="m-0">Resume</h2>

                    <div className="d-flex gap-4 mt-2">
                        <div className="d-flex flex-column gap-3">
                            <span className="text-warning">Game</span>
                            {
                                filterGames.map(game => {
                                    return (
                                        <div className="resumeGameTitle-box" key={game.id}>
                                            <span>{game.title}</span>
                                            <hr className="my-2" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="d-flex flex-column gap-3">
                            <span className="text-warning">Amount</span>
                            {
                                filterGames.map(game => {
                                    return (
                                        <div key={game.id}>
                                            {
                                                gameCounts[game.id] ?
                                                    (<span>{gameCounts[game.id]}</span>) :
                                                    (<span>{gameCounts[game.id] = 1}</span>)
                                            }

                                            <hr className="my-2" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="d-flex flex-column gap-3">
                            <span className="text-warning">Price</span>
                            {
                                filterGames.map(game => {
                                    return (
                                        <div key={game.id}>
                                            {
                                                gameCounts[game.id] ? (<span>{(parseFloat(game.price) * gameCounts[game.id]).toFixed(2)}$</span>
                                                ) : (<span>{game.price}$</span>)
                                            }
                                            <hr className="my-2" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
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
                                <div style={{ display: isBuyGame ? "flex" : "none" }} className="buyGameAlert alert alert-success" role="alert">
                                    {isSpinner ?
                                        <span className="spinner"></span>
                                        :
                                        <div>
                                            <p className="buyGameMessage">La compra se ha realizado satisfactoriamente.
                                            </p>
                                            <p>Revise el correo que le acabamos de mandar con las claves de los juegos comprados:)</p>
                                            <span className="material-symbols-outlined">
                                                send
                                            </span>
                                            <span className="material-symbols-outlined">
                                                mark_email_unread
                                            </span>
                                            <p>Sera redirigido a la pagina principal en {counter} segundos.</p>
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
    )
}