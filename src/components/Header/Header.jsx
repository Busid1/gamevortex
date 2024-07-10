import "./header.css";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/actions";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import { HOME_URL } from "../../App";
import Logout from "../Login/app/Logout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Login/app/firebase";
import { useCart } from "../../contexts/CartContext";

export default function Header() {
    const cartHeaderRef = useRef();
    const [isScrollY, setIsScrollY] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [pfp, setPfp] = useState("");
    const { cartVideogames } = useCart();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLogin(true);
                if (user.photoURL) {
                    setPfp(user.photoURL);
                }
                else {
                    setPfp("https://i.pinimg.com/564x/5d/2a/d1/5d2ad10c1f4e6b0136e8abddb6205102.jpg");
                }
            }
            else {
                setIsLogin(false);
            }
        })
    }, [pfp]);

    const handleScrollY = () => {
        if (window.scrollY > 200) {
            setIsScrollY(true);
        }
        else {
            setIsScrollY(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScrollY);

        return () => {
            window.removeEventListener('scroll', handleScrollY);
        };
    }, []);

    const [searchBarDeploy, setSearchBarDeploy] = useState(true);
    const [searchBarFocus, setSearchBarFocus] = useState(false);
    const handleSearchBarDeploy = () => {
        setSearchBarDeploy(!searchBarDeploy);
        setSearchBarFocus(!searchBarFocus);
    }

    return (
        <header className={isScrollY ? "headerBackground" : ""}>
            <nav>
                {
                    searchBarDeploy ?
                        <Link to={`${HOME_URL}`} className="navbar-brand logo-box text-black">
                            <img src="https://cdn.glitch.global/2c9253f6-1a6e-48eb-a381-f462c9c635d5/gameVortexLogo-yellow.png?v=1707151175584" alt={"gameVortex-logo"} />
                        </Link>
                        :
                        null
                }
                <span id="search-icon"
                    onClick={handleSearchBarDeploy}
                    className="text-white material-symbols-outlined">
                    {searchBarDeploy ? "search" : "close"}
                </span>
                <SearchBar searchBarFocus={searchBarFocus} handleSearchBarDeploy={handleSearchBarDeploy} searchBarDeploy={searchBarDeploy}/>
                {
                    searchBarDeploy ?
                        <div ref={cartHeaderRef} className="cartHeader-container">
                            <Link to={`${HOME_URL}/cart`} className="d-flex cartIcon-box text-white">
                                <div className="material-symbols-outlined position-relative" id="cart-icon">
                                    shopping_cart_checkout
                                    <span id="push-cart"
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartVideogames.length}
                                    </span>
                                </div>
                            </Link>
                            {
                                isLogin ?
                                    (
                                        <ul className="m-0 p-0">
                                            <li className="nav-item dropdown">
                                                <button className="nav-link dropdown-toggle text-white" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <img className="user-profile" src={pfp} alt="profile-picture" />
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <Logout />
                                                    <li>
                                                        <Link className="dropdown-item" to={`${HOME_URL}/wishlist`}>
                                                            Wishlist
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    )
                                    :
                                    (
                                        <button data-bs-toggle="modal" data-bs-target="#signupModal" className="btn p-0 material-symbols-outlined text-white">
                                            account_circle
                                        </button>
                                    )
                            }
                        </div>
                        :
                        null
                }
            </nav>
        </header>
    )
}