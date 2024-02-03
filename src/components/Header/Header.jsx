import "./header.css";
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import gameVortexLogo from "../../images/gamevortexlogo.png"

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
        <header className="header px-3 bg-warning">
            <nav className="navbar navbar-expand-md">
                <div className="container-fluid d-flex align-items-center justify-content-around">
                    <Link to={"/"} className="navbar-brand logo-box text-black">
                        <img src={gameVortexLogo} alt={"gameVortex-logo"} />
                    </Link>
                    <SearchBar onSearch={onSearch} searchGame={searchGame} videogames={videogames} />
                    <Link to={'cart'} className="d-flex text-black">
                        <div className="material-symbols-outlined position-relative fs-3" id="cart-icon">
                            shopping_cart_checkout
                            <span id="push-cart"
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartCount}
                            </span>
                        </div>
                    </Link>                    
                </div>
            </nav>
        </header>

    )
}