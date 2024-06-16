import "./game.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from 'react-spring';
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart, addToFav, removeFromFav } from "../../redux/actions";
import { useLocation } from "react-router-dom";
import { HOME_URL } from "../../App";
import showMessage from "../Login/app/showMessage";
import useFirestore from "../Login/app/firestore";

export default function Game({ id, title, price, description, image, prevGameplay, handleAddToCart, handleRemoveFromCart }) {
    const location = useLocation();
    const popoverList = useRef();
    const dispatch = useDispatch();
    const cartBtnRef = useRef(null);
    const delBtnRef = useRef(null);
    const changeFocus = useRef(null);
    const { user } = useFirestore();

    // State and effect for game in cart
    const [isInCart, setIsInCart] = useState(false);
    useEffect(() => {
        const getIsTrue = localStorage.getItem(id);
        const parseIsTrue = JSON.parse(getIsTrue);
        if (parseIsTrue && parseIsTrue[id]) {
            setIsInCart(true);
        } else {
            setIsInCart(false);
        }
    }, [id]);

    // Function to add game to cart
    const handleTrueCart = () => {
        setIsInCart(true);
        handleAddToCart(id, title, price, image, false);
        localStorage.setItem(id, JSON.stringify({ [id]: true }));
        dispatch(addToCart({ id, title, price, description, image }));
    };

    // Function to remove game from cart
    const handleFalseCart = () => {
        handleRemoveFromCart(id);
        localStorage.removeItem(id);
        setIsInCart(false);
        dispatch(removeFromCart(id));
    };

    useEffect(() => {
        // Verificar si title tiene un valor definido
        if (title) {
            const popover = new bootstrap.Popover(popoverList.current, {
                title: title,
                content: description,
                trigger: "focus"
            });
        }
    }, []);

    // Play and pause the prevGameplay
    const videoRef = useRef(null);
    const handleMouseOver = () => {
        if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {
                console.log("Relax brother");
            });
        }
    };

    const handleMouseOut = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const [cartAnimation, setCartAnimation] = useState(false);
    const [cartCoordinates, setCartCoordinates] = useState({ top: 0, left: 0 });
    const [currentCartCoordinates, setCurrentCartCoordinates] = useState({ top: 0, left: 0 });

    const handleAnimAddToCart = () => {
        const cartIcon = document.getElementById('cart-icon');
        const cartIconCoordinates = cartIcon.getBoundingClientRect();
        setCartCoordinates({
            top: cartIconCoordinates.top,
            left: cartIconCoordinates.left,
        });
        setCartAnimation(true);

        setTimeout(() => {
            setCartAnimation(false);
        }, 800);
    };

    const handleMouseMove = (event) => {
        setCurrentCartCoordinates({
            top: event.clientY,
            left: event.clientX,
        });
    };

    const animationProps = useSpring({
        top: cartAnimation ? cartCoordinates.top : currentCartCoordinates.top,
        left: cartAnimation ? `${cartCoordinates.left - 30}px` : `${currentCartCoordinates.left}px`, // Utilizamos template literals para asegurar que el valor sea un string
        opacity: cartAnimation ? 1 : 0,
        scale: cartAnimation ? 0.6 : 1,
    });

    const [isFav, setIsFav] = useState(false);
    useEffect(() => {
        const getIsTrue = localStorage.getItem(title);
        const parseIsTrue = JSON.parse(getIsTrue);
        if (parseIsTrue && parseIsTrue[title]) {
            setIsFav(true);
        } else {
            setIsFav(false);
        }
    }, [title]);

    const handleAddFav = () => {
        if (user) {
            localStorage.setItem(title, JSON.stringify({ [title]: true }));
            setIsFav(true);
            dispatch(addToFav({ id, title, price, description, image, prevGameplay, handleAddToCart, handleRemoveFromCart }));
        }
        else {
            showMessage("You must be logged", "error");
        }
    };

    const handleRemoveFav = () => {
        localStorage.removeItem(title);
        setIsFav(false);
        dispatch(removeFromFav(id));
    };

    useEffect(() => {
        if (location.pathname === HOME_URL) {
            localStorage.setItem(id, JSON.stringify({ [id]: true }));
        }

        window.scrollTo(0, 0);
    }, []);

    return (
        <div id="card-item_game" className="card rounded-3 my-3 d-flex align-items-center border-0">
            <div to={`${HOME_URL}/${title}`} className="navbar-brand text-white card-body">
                <Link to={`${HOME_URL}/${title}`} className="img-games-box">
                    <img className="img-games" src={image} alt={title} />
                    <video ref={videoRef} autoPlay={false} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} playsInline loop muted preload="none" className="prevGameplay" src={prevGameplay}></video>
                </Link>
                {
                    isFav ?
                        <button onClick={() => handleRemoveFav(title)} id="favoriteFill-btn">
                            <i className="fas fa-heart"></i>
                        </button>
                        :
                        <button onClick={() => handleAddFav(title)} id="favorite-btn">
                            <span className="material-symbols-outlined">
                                favorite
                            </span>
                        </button>
                }
                <div className="card-body-bottom">
                    <div className="titlePrice-box">
                        <Link className="card-title" to={`${HOME_URL}/${title}`}>
                            {title}
                        </Link>
                        <button ref={popoverList} type="button"
                            data-bs-custom-class="custom-popover" id="info-btn"
                            className="btn text-white d-flex align-items-center"
                            data-container="body">
                            <i className="fas fa-info-circle"></i>
                        </button>
                    </div>
                    <div className="btns-box">
                        <span ref={changeFocus} className="card-price">{price}</span>
                        {
                            isInCart ?
                                (
                                    <button id="delete-btn" ref={delBtnRef} onClick={() => handleFalseCart(id)}
                                        className="d-flex align-items-center gap-2">
                                        Delete
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                )
                                :
                                (
                                    <button
                                        id="cart-btn"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvasResponsive"
                                        aria-controls="offcanvasResponsive"
                                        ref={cartBtnRef}
                                        onClick={() => handleTrueCart(id)}
                                        className="d-flex align-items-center gap-2">
                                        Add to cart
                                        <span className="material-symbols-outlined">
                                            add_shopping_cart
                                        </span>
                                    </button>
                                )
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}