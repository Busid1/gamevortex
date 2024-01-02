import "./game.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions";
import { useLocation } from "react-router-dom";

export default function Game({ id, title, price, description, image, prevGameplay, handleAddToCart, handleRemoveFromCart, titleLength }) {
    const location = useLocation();
    const popoverList = useRef();
    const dispatch = useDispatch();
    const cartBtnRef = useRef(null);
    const delBtnRef = useRef(null);
    const changeFocus = useRef(null);
    const [cartAlert, setCartAlert] = useState(false);
    const [delAlert, setDelAlert] = useState(false);

    useEffect(() => {
        if (location.pathname !== "/") {
            localStorage.setItem(id, JSON.stringify({ [id]: true }));
        }

        window.scrollTo(0, 0);
    }, []);

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

    const handleIsTrue = (gameId) => {
        const getIsTrue = localStorage.getItem(gameId);
        const parseIstrue = JSON.parse(getIsTrue);
        return parseIstrue && parseIstrue[gameId];
    }

    useEffect(() => {
        const popover = new bootstrap.Popover(popoverList.current, {
            title: title,
            content: description,
            trigger: "focus"
        })
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

    return (
        <div id="card-item_game" className="card my-3 rounded-3 d-flex align-items-center border-0">
            <div className="navbar-brand text-white card-body">
                <div className="img-games-box">
                    <img className="img-games" src={image} alt={title} />
                    <video ref={videoRef} autoPlay={false} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} playsInline loop muted preload="none" className="prevGameplay" src={prevGameplay}></video>
                </div>
                <div className="card-body-bottom">
                    <div className="titlePrice-box">
                        <Link className="card-title" to={`/${title}`}>
                            {titleLength(title)}
                        </Link>
                        <span ref={changeFocus} className="card-price mx-2 border border-dark badge bg-danger rounded-pill">{price}</span>
                    </div>
                    <div id="btn-box" className="d-flex w-100 justify-content-evenly">
                        <button ref={popoverList} type="button" data-bs-custom-class="custom-popover" id="info-btn" className="btn btn-secondary d-flex align-items-center gap-2" data-container="body">
                            Info
                            <i className="fas fa-info-circle"></i>
                        </button>
                        {
                            handleIsTrue(id) ? (
                                <button id="cart-btn" ref={cartBtnRef} onClick={() => handleFalseCart(id)} className="btn btn-warning d-flex align-items-center gap-2">Cart
                                    <span className="material-symbols-outlined">
                                        add_shopping_cart
                                    </span>
                                </button>
                            ) : (
                                <button id="delete-btn" ref={delBtnRef} onClick={() => handleTrueCart(id)} className="btn btn-danger d-flex align-items-center gap-2">Delete
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            )
                        }
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
        </div>

    )
}