import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HOME_URL } from "../../App";
import { removeFromCart } from "../../redux/actions";
import "./cartPreview.css";
import { useCart } from "../../contexts/CartContext";
import useFirestore from "../Login/app/firestore";

export default function CartPreview() {
    const reduxGamesInCart = useSelector(state => state.gamesInCart);
    const dispatch = useDispatch();
    const { cartVideogames, handleRemoveGameFromCartContext } = useCart();
    const { handleRemoveGameFromUserCart } = useFirestore();

    const filterDelGame = (id) => {
        handleRemoveGameFromCartContext(id);
        handleRemoveGameFromUserCart(id);
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify({ [id]: true }));
        dispatch(removeFromCart(id));
    }

    const navigate = useNavigate();

    return (
        <div>
            <div className="offcanvas offcanvas-end cartGamesPrev-box" tabIndex="-1" id="offcanvasResponsive" aria-labelledby="offcanvasResponsiveLabel">
                <div className="offcanvas-header d-flex justify-content-between">
                    <h5 className="offcanvas-title cartPrev-title" id="offcanvasResponsiveLabel">Cart preview</h5>
                    <button type="button" className="material-symbols-outlined cart-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close">
                        close
                    </button>
                </div>
                <ul className="offcanvas-body pt-2">
                    {
                        cartVideogames.length !== 0 ?
                            cartVideogames.map(game => (
                                <li className="cartGamePrev-item mb-3" key={game.id}>
                                    <div>
                                        <img className="shadow" src={game.image} alt={game.title} />
                                        <div className="cartPrev-body d-flex flex-column w-100">
                                            <Link data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" onClick={() => navigate(`${HOME_URL}/${game.title}`)} className="text-warning">
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
                                </li>
                            ))
                            :
                            <li className="emptyCartPrev-box text-white mb-3">Empty cart...
                                <span className="fs-5 text-white material-symbols-outlined">
                                    shopping_cart_off
                                </span>
                            </li>
                    }
                    <Link data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" onClick={() => navigate("/cart")} className="icon-link btn btn-primary">
                        Go to cart
                        <span className="material-symbols-outlined">
                            arrow_right_alt
                        </span>
                    </Link>
                </ul>
            </div>
        </div>
    )
}