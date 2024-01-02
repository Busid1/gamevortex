import "./header.css";
import Login from "../Login/Login";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";

export default function Header({ cartCount, onSearch, searchGame, videogames }) {
    //Shows and disable user login form
    const [showLogin, setShowLogin] = useState("none");

    const handleOpenLogin = () => {
        setShowLogin("block");
        document.body.style.overflow = "hidden";
    }

    const handleCloseLogin = () => {
        setShowLogin("none");
        document.body.style.overflow = "visible";
    }

    return (
        <header className="header">
            <Login showLogin={showLogin} handleCloseLogin={handleCloseLogin} />
            <nav className="navbar navbar-expand-md navbar-dark bg-warning px-4">
                <div className="container-fluid">
                    <Link to={"/"} className="navbar-brand text-black">
                        VG Store
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-end bg-dark" tabIndex="-1" id="offcanvasNavbar">
                        <div className="offcanvas-header">
                            <h3 className="offcanvas-title text-black" id="offcanvasNavbarLabel">VG Store</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body d-flex flex-wrap justify-content-between align-items-center">
                            <ul className="navbar-nav d-flex gap-4 align-items-center">
                                <li className="nav-item d-flex align-items-center">
                                    <a className="nav-link text-black" href="#">Popular</a>
                                    <i className="fas fa-fire text-danger"></i>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <a className="nav-link text-black" href="#">Offers</a>
                                    <i className="fas fa-tag text-success"></i>
                                </li>
                                <SearchBar onSearch={onSearch} searchGame={searchGame} videogames={videogames} />
                            </ul>
                            <div className="d-flex align-items-center gap-5 fs-4">
                                <Link to={'cart'} className="d-flex text-black">
                                    <div className="material-symbols-outlined position-relative fs-3" id="cart-icon">
                                        shopping_cart_checkout
                                        <span id="push-cart"
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {cartCount}
                                        </span>
                                    </div>
                                </Link>
                                <span id="user-icon" className="material-symbols-outlined fs-2" onClick={handleOpenLogin}>
                                    account_circle
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

    )
}