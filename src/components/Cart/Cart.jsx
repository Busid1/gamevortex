import { useSelector } from "react-redux";
import "./cart.css";
import { useState, useEffect } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { removeFromCart } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Payment from "../Payment/Payment";

export default function Cart({ handleRemoveFromCart, inputRef, focusInput }) {
    const [gamesInCart, setGamesInCart] = useState(useSelector(state => state.gamesInCart));
    const [gameCounts, setGameCounts] = useState({}); // Inicialmente, no hay cantidades para ningún juego
    //Accedemos al ultimo array ya que este tendra todos los valores validos de la tarjeta y asi no se duplican los elementos
    const creditCardData = useSelector(state => state.creditCard.slice(-1)[0]);

    const creditCardErrors = useSelector(state => state.creditCardErrors.slice(-1)[0]);

    const creditCardComponent = creditCardData ? (
        <div className="creditCardBox">
            <h3>Card holder: {creditCardData.cardHolder}</h3>
            <h3>Number: {creditCardData.cardNumber}</h3>
            <h3>Expiration: {creditCardData.cardExpirationMonth}/{creditCardData.cardExpirationYear}</h3>
            <h3>CVC: {creditCardData.cardCVC}</h3>
        </div>

    ) : null;

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
        <div key={game.id} className="cart-box bg-secondary shadow rounded d-flex gap-3 my-4">
            <img className="rounded-start" src={game.image} alt={game.title} />
            <div className="d-flex flex-column justify-content-center">
                <Link to={`/${game.title}`} className="gameTitle fs-4 text-warning">
                    {game.title}
                </Link>
                <span>{game.price}</span>
                <div id={game.id} className="d-flex gap-2">
                    <span>Amount:</span>
                    <span id={game.id} onClick={() => increaseCount(game.id)} className="material-symbols-outlined btn btn-dark p-1 fs-6">
                        add
                    </span>
                    {/* Accede al objeto que se le pasa por id, en caso de que dentro de 
                        ese objeto no haya nada pues gameCount sera igual a 0 */}
                    <span id={game.id}>{gameCounts[game.id] || 1}</span>
                    <span onClick={() => decreaseCount(game.id)} className="material-symbols-outlined btn btn-dark p-1 fs-6">
                        remove
                    </span>
                    <button onClick={() => filterDelGame(game.id)} className="material-symbols-outlined btn btn-danger p-1 fs-6">
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

    const [payment, setPayment] = useState(false);
    const [isBuyGame, setIsBuyGame] = useState(false);
    const [isBuyGameBtn, setIsBuyGameBtn] = useState(false);
    const [isSpinner, setIsSpinner] = useState(true);
    const [isBuyGameAlert, setIsBuyGameAlert] = useState(true);

    const spinnerTimeout = () => setTimeout(() => {
        setIsSpinner(false);
    }, 1000);

    const buyGameAlertTimeout = () => setTimeout(() => {
        setIsBuyGameAlert(false);
        window.location.href = 'http://localhost:3000';
    }, 11000);

    const handlePayment = () => {
        if (payment) {
            setPayment(false);
            setIsBuyGameBtn(true);
        }
        else {
            setPayment(true);
        }
    }

    const [counter, setCounter] = useState(11);

    const decreaseCounter = () => {
        if (counter > 0) {
            setCounter(prevCounter => prevCounter - 1);
        }
        else{
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


    return (
        <div className="cart-container d-flex flex-column bg-dark text-white px-4 py-2 w-100">
            <Breadcrumb />
            <div className="d-flex gap-2 justify-content-between">
                <div className="cartGamesBox d-flex flex-column">
                    {gamesAddsInCart}
                </div>
                <div className="bg-secondary rounded py-3 px-3 resumeGamesBox d-flex flex-column align-items-center">
                    <h2>Resume</h2>

                    <div className="d-flex gap-4 mt-3">
                        <div className="d-flex flex-column gap-3">
                            <span className="text-warning">Game</span>
                            {
                                filterGames.map(game => {
                                    return (
                                        <div key={game.id}>
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

                    <button onClick={() => { handlePayment(); focusInput(); }} className="d-flex align-items-center gap-2 fs-5 btn btn-warning shadow mt-3">
                        Add/edit payment
                        <span className="material-symbols-outlined">
                            credit_card
                        </span>
                    </button>
                    {creditCardComponent}

                    {isBuyGameBtn ? (
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
                        payment ? <Payment
                            handlePayment={handlePayment}
                            gameCounts={gameCounts}
                            inputRef={inputRef}
                        /> :
                            null
                    }
                </div>
            </div>
        </div>
    )
}