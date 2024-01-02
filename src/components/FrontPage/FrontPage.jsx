import "./frontpage.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function FrontPage({ id, title, price, description, image, handleAddToCart, handleRemoveFromCart }) {
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

    const handleIsTrue = (gameId) => {
        const getIsTrue = localStorage.getItem(gameId);
        const parseIstrue = JSON.parse(getIsTrue)
        return parseIstrue && parseIstrue[gameId];
    }

    useEffect(() => {
        const popover = new bootstrap.Popover(popoverList.current, {
            title: title,
            content: description,
            trigger: "focus"
        })
    }, []);

    return (
        <div className="d-flex flex-column align-items-center front-page">
            <div className="front-page-image d-flex align-items-center justify-content-center">
                <div className="gradiente-izquierdo"></div>
                <div className="gradiente-arriba"></div>
                <img src={image} alt={title} />
                <div className="gradiente-derecho"></div>
                <div className="gradiente-abajo"></div>
            </div>
            <div className="card-body-principal d-flex flex-column justify-content-center align-items-start">
                <div className="navbar-brand text-white">
                    <Link to={`/${title}`}>
                        <h3 className="card-title-main text-warning">{title}</h3>
                    </Link>
                    <span ref={changeFocus} className="card-price fs-6">{price}</span>
                    <div id="btn-box" className="d-flex w-100 gap-3">
                        <button type="button" ref={popoverList} data-bs-custom-class="custom-popover" id="info-btn" className="btn btn-secondary d-flex align-items-center gap-2" data-container="body">
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
                </div>
            </div>
            <Breadcrumb />
            {
                cartAlert ?
                    <div className="addGameAlert-box">
                        <div id="addGameCart-alert" className="alert alert-success alert-dismissible p-1" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="m-0 px-2">El juego se agrego al carrito</p>
                            </div>
                        </div>
                    </div>
                    : null
            }

            {
                delAlert ?
                    <div className="delGameAlert-box" >
                        <div id="delGameCart-alert" className="alert alert-warning alert-dismissible p-1" role="alert">
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="m-0 px-2">El juego se elimino del carrito</p>
                            </div>
                        </div>
                    </div>
                    : null
            }
        </div>
    )
}