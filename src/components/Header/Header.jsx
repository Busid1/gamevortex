import "./header.css";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/actions";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import { HOME_URL } from "../../App";

export default function Header({ cartCount, onSearch, searchGame, videogames, handleRemoveFromCart }) {
    const [cartGamesPrev, setCartGamesPrev] = useState([]);
    const cartHeaderRef = useRef();
    const [isScrollY, setIsScrollY] = useState(false);
    const reduxGamesInCart = useSelector(state => state.gamesInCart);
    const dispatch = useDispatch();

    useEffect(() => {
        // Actualiza gamesInCart cuando state.gamesInCart cambie
        setCartGamesPrev(reduxGamesInCart);
    }, [reduxGamesInCart]); // Este efecto se ejecuta cada vez que reduxGamesInCart cambie

    // Si gamesInCart está vacío, muestra un mensaje de depuración
    if (cartGamesPrev.length === 0) {
        console.log("cart empty...");
    }

    const [isPrevClose, setIsPrevClose] = useState(false);
    const handleClosePrevGames = () => {
        setIsPrevClose(!isPrevClose);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el elemento pulsado no es el cartHeader o uno de sus descendientes
            if (cartHeaderRef.current && !cartHeaderRef.current.contains(event.target)) {
                setIsPrevClose(false);
                // Aquí puedes realizar las acciones que desees cuando el cartHeader no sea pulsado
            }
        };

        // Agregamos el event listener al documento para detectar clics fuera del cartHeader
        document.addEventListener('mousedown', handleClickOutside);

        // Es importante limpiar el event listener al desmontar el componente
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filterDelGame = (id) => {
        const newGamesInCart = cartGamesPrev.filter(game => game.id !== id)
        setCartGamesPrev(newGamesInCart);
        handleRemoveFromCart();
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify({ [id]: true }));
        dispatch(removeFromCart(id));
    }

    const handleScrollY = () => {
        if (window.scrollY > 10) {
            setIsScrollY(true);
        }
        else {
            setIsScrollY(false);
        }
    }

    useEffect(() => {
        if (cartCount >= 1) {
            setIsPrevClose(true);
        }

        window.addEventListener('scroll', handleScrollY);

        return () => {
            window.removeEventListener('scroll', handleScrollY);
        };
    }, [cartCount]);

    return (
        <header className={isScrollY ? "headerBackground" : ""}>
            <nav>
                <div>
                    <Link to={`/${HOME_URL}`} className="navbar-brand logo-box text-black">
                        <img src="https://cdn.glitch.global/2c9253f6-1a6e-48eb-a381-f462c9c635d5/gameVortexLogo-yellow.png?v=1707151175584" alt={"gameVortex-logo"} />
                    </Link>
                    <SearchBar onSearch={onSearch} searchGame={searchGame} videogames={videogames} />
                    <div ref={cartHeaderRef} className="cartHeader-container text-warning">
                        <Link to={`/${HOME_URL}/cart`} className="d-flex cartIcon-box text-warning">
                            <div className="material-symbols-outlined position-relative" id="cart-icon">
                                shopping_cart_checkout
                                <span id="push-cart"
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartCount}
                                </span>
                            </div>
                        </Link>
                        {
                            isPrevClose ?
                                <ul className="cartGamesPrev-box"
                                    style={{
                                        overflowY: cartGamesPrev.length > 3 ? "scroll" : "hidden",
                                    }}>
                                    <h3 className="cartPrev-title">Cart preview</h3>
                                    {
                                        cartGamesPrev.length !== 0 ?
                                            cartGamesPrev.map(game => (
                                                <li className="cartGamePrev-item" key={game.id}>
                                                    <div>
                                                        <img className="shadow" src={game.image} alt={game.title} />
                                                        <div className="cartPrev-body d-flex flex-column w-75">
                                                            <Link to={`/${HOME_URL}/${game.title}`} onClick={handleClosePrevGames} className="text-warning">
                                                                {game.title}
                                                            </Link>
                                                            <div className="cartPrev-bottom d-flex align-items-center justify-content-between">
                                                                <span className="text-white">{game.price}</span>
                                                                <button
                                                                    onClick={() => filterDelGame(game.id)}
                                                                    className="p-1 bg-transparent border-0 cursor-pointer">
                                                                    <i className="fas fa-trash-alt text-danger" aria-hidden="true"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr className="separator" />
                                                </li>
                                            ))
                                            :
                                            <li className="emptyCart-box">Empty cart...
                                                <span className="fs-5 text-white material-symbols-outlined">
                                                    shopping_cart_off
                                                </span>
                                            </li>
                                    }
                                </ul> : null
                        }
                        {
                            isPrevClose ?
                                <span className="startDeploy-icon material-symbols-outlined">
                                    change_history
                                </span> : null
                        }
                        <span onClick={handleClosePrevGames} className="deployPrevGames-icon text-warning material-symbols-outlined">
                            {isPrevClose ? 'arrow_drop_down' : 'arrow_drop_up'}
                        </span>
                    </div>
                    <Link to={`/${HOME_URL}/favorites`}>
                        <button id="favoriteHeader-btn">
                            <i className="fas fa-heart"></i>
                        </button>
                    </Link>
                </div>
            </nav>
        </header>
    )
}