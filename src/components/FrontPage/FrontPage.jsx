import "./frontpage.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { HOME_URL } from "../../App";

export default function FrontPage({ id, title, price, description, image, frontPageImage, handleIsTrue, handleAddToCart, handleRemoveFromCart }) {
    const location = useLocation();
    const dispatch = useDispatch();
    const cartBtnRef = useRef(null);
    const delBtnRef = useRef(null);
    const changeFocus = useRef(null);
    const [cartAlert, setCartAlert] = useState(false);
    const [delAlert, setDelAlert] = useState(false);

    useEffect(() => {
        if (location.pathname !== `/${HOME_URL}`) {
            localStorage.setItem(id, JSON.stringify({ [id]: true }));
        }
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
        }, 700)
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
        }, 700)
    };

    return (
        <div className="frontPage-container">
            <Link to={`${HOME_URL}/${title}`} className="frontPageImage-box d-flex align-items-center justify-content-end">
                <img src={frontPageImage} alt={title} />
                <div className="frontPage-gradient"></div>
            </Link>
            <div className="card-body-main d-flex flex-column justify-content-center align-items-start">
                <div className="navbar-brand text-white d-flex flex-column gap-2">
                    <div className="d-flex flex-column">
                        <Link to={`${HOME_URL}/${title}`} className="card-title-main text-warning">
                            {title}
                        </Link>
                        <span ref={changeFocus} className="frontPageCard-price">{price}</span>
                    </div>
                    <div id="frontPageBtns-box" className="d-flex w-100 gap-3">
                        {
                            handleIsTrue(id) ? (
                                <button id="cart-btn" ref={cartBtnRef} onClick={() => handleFalseCart(id)} 
                                    className="btn btn-warning d-flex align-items-center gap-2">
                                    Add to cart
                                    <span className="material-symbols-outlined">
                                        add_shopping_cart
                                    </span>
                                </button>
                            ) : (
                                <button id="delete-btn" ref={delBtnRef} onClick={() => handleTrueCart(id)} 
                                    className="btn btn-danger d-flex align-items-center gap-2">
                                    Delete from cart
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            )
                        }
                    </div>
                </div>
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
    )
}