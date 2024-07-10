import "./frontpage.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { HOME_URL } from "../../App";
import { useCart } from "../../contexts/CartContext";
import useFirestore from "../Login/app/firestore";

export default function FrontPage({ id, title, price, description, image, background, currentSlide }) {
    const location = useLocation();
    const dispatch = useDispatch();
    const cartBtnRef = useRef(null);
    const delBtnRef = useRef(null);
    const changeFocus = useRef(null);
    const { handleAddGameToUserCart, handleRemoveGameFromUserCart } = useFirestore();
    const { cartVideogames, handleAddGameToCartContext, handleRemoveGameFromCartContext } = useCart();

    const handleToggleButtonCart = (gameId) => {
        const isInCart = cartVideogames.some(
            (games) => games.id === gameId
        )
        return isInCart
    }

    useEffect(() => {
        if (location.pathname !== `/${HOME_URL}`) {
            localStorage.setItem(id, JSON.stringify({ [id]: true }));
        }
    }, []);

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
        handleAddGameToCartContext({ id, title, price, image })
        handleAddGameToUserCart({ id, title, price, image });
        localStorage.setItem(id, JSON.stringify({ [id]: true }));
        dispatch(addToCart({ id, title, price, image }));
    };

    // Function to remove game from cart
    const handleFalseCart = () => {
        localStorage.removeItem(id);
        setIsInCart(false);
        handleRemoveGameFromCartContext(id);
        handleRemoveGameFromUserCart(id);
        dispatch(removeFromCart(id));
    };

    return (
        <>
            <div className="frontPageImage-box d-flex align-items-center justify-content-end">
                <img src={background} alt={title} />
            </div>
            <div className="frontPage-content">
                <div className="navbar-brand text-white d-flex flex-column gap-2">
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to={`${HOME_URL}/${title}`} className="frontPageCard-title text-warning">
                                {title}
                            </Link>
                        </div>
                        <p className="frontPage-description">{description}</p>
                    </div>
                    <div id="frontPageBtns-box" className="d-flex align-items-center w-100 gap-3">
                        {
                            handleToggleButtonCart(id) ?
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
                        <span ref={changeFocus} className="frontPageCard-price">{price}</span>
                    </div>
                </div>
                <div className="carousel-indicators">
                    {
                        Array.from({ length: 5 }).map((_, index) => (
                            <button key={index} type="button" data-bs-target=".frontPageCarousel-item" data-bs-slide-to={currentSlide}
                                className={`${index === currentSlide ? 'active' : 'inactive'}`} aria-current="true" aria-label="Slide 1"></button>
                        ))
                    }
                </div>
            </div>
        </>
    )
}