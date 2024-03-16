import "./game.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSpring, animated } from 'react-spring';
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart, addToFav, removeFromFav } from "../../redux/actions";
import { useLocation } from "react-router-dom";
import { HOME_URL } from "../../App";

export default function Game({ id, title, price, description, image, prevGameplay, handleIsTrue, handleAddToCart, handleRemoveFromCart }) {
    const location = useLocation();
    const popoverList = useRef();
    const dispatch = useDispatch();
    const cartBtnRef = useRef(null);
    const delBtnRef = useRef(null);
    const changeFocus = useRef(null);
    const [cartAlert, setCartAlert] = useState(false);
    const [delAlert, setDelAlert] = useState(false);

    const handleTrueCart = (gameId) => {
        const localId = localStorage.getItem(gameId);

        setTimeout(() => {
            if (localId) {
                localStorage.removeItem(gameId);
                localStorage.setItem(id, JSON.stringify({ [gameId]: true }))
                handleRemoveFromCart();
                dispatch(removeFromCart(id));
            }
            else {
                localStorage.setItem(id, JSON.stringify({ [gameId]: true }))
            }

            if (delBtnRef && delBtnRef.current) {
                delBtnRef.current.blur();
                setDelAlert(true);
                changeFocus.current.focus();

                setTimeout(() => {
                    setDelAlert(false);
                }, 1000);
            }
        }, 500)
    };

    const handleFalseCart = (gameId) => {
        const localId = localStorage.getItem(gameId);

        setTimeout(() => {
            if (localId) {
                localStorage.removeItem(gameId);
                localStorage.setItem(id, JSON.stringify({ [gameId]: false }))
                handleAddToCart();
                dispatch(addToCart({ id, title, price, description, image }));
            }
            else {
                localStorage.setItem(id, JSON.stringify({ [gameId]: true }))
            }

            if (cartBtnRef && cartBtnRef.current) {
                cartBtnRef.current.blur();
                setCartAlert(true);
                changeFocus.current.focus();

                setTimeout(() => {
                    setCartAlert(false);
                }, 1000);
            }
        }, 500)
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
        localStorage.setItem(title, JSON.stringify({ [title]: true }));
        setIsFav(true);
        dispatch(addToFav({ id, title, price, description, image, prevGameplay, handleAddToCart, handleRemoveFromCart }));
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
        <div id="card-item_game" className="card rounded-3 my-3 bg-black d-flex align-items-center border-0">
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
                        <span ref={changeFocus} className="card-price border border-dark badge bg-danger rounded-pill">{price}</span>
                    </div>

                    {
                        cartAlert ?
                            <div id="addGameCart-alert" className="alert alert-success alert-dismissible p-1" role="alert">
                                <p className="m-0 px-2">The game was added to cart</p>
                            </div>
                            : null
                    }

                    {
                        delAlert ?
                            <div id="delGameCart-alert" className="alert alert-warning alert-dismissible p-1" role="alert">
                                <p className="m-0 px-2">The game was remove from cart</p>
                            </div>
                            : null
                    }
                </div>
            </div>
            <div id="btns-box" className="d-flex w-100 justify-content-evenly">
                <button ref={popoverList} type="button" data-bs-custom-class="custom-popover" id="info-btn" className="btn btn-secondary d-flex align-items-center gap-2" data-container="body">
                    <i className="fas fa-info-circle"></i>
                </button>
                {
                    handleIsTrue(id) ? (
                        <button
                            onMouseMove={handleMouseMove}
                            id="cart-btn"
                            ref={cartBtnRef}
                            onClick={() => { handleFalseCart(id); handleAnimAddToCart() }}
                            className="btn btn-warning d-flex align-items-center gap-2">
                            <span className="material-symbols-outlined">
                                add_shopping_cart
                            </span>
                            {cartAnimation && (
                                <animated.img
                                    src={image}
                                    style={{
                                        ...animationProps,
                                        position: 'fixed',
                                        width: '80px',
                                        height: '50px',
                                        borderRadius: '10px'
                                    }}
                                ></animated.img>
                            )}
                        </button>
                    ) : (
                        <button id="delete-btn" ref={delBtnRef} onClick={() => handleTrueCart(id)} className="btn btn-danger d-flex align-items-center gap-2">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    )
                }
            </div>
        </div>

    )
}