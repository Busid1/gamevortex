import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import axios from "axios";
import "./gamedetails.css";
import Game from "../Game/Game";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions";
import Carousel from "../Carousel/Carousel";
import Buttons from "../Buttons/Buttons";
import { API_URL } from "../../App";
import Comments from "../Comments/Comments";

export default function GameDetails({ videogames, handleAddToCart, handleRemoveFromCart, titleLength }) {
    const [specificGame, setSpecificGame] = useState([]);
    const [otherVideogames, setOtherVideogames] = useState([]);
    const [isSet, setIsSet] = useState(false);
    const { game } = useParams();
    const { id, title, description, price, image, background, screenshots, gameplay, tags, stock } = specificGame;
    useEffect(() => {
        const filterOtherGames = () => {
            if (videogames) {
                const filterRelatedGames = videogames.filter(otherGame => {
                    return (
                        otherGame.id !== specificGame.id && // Evita que se renderice el mismo juego otra vez
                        otherGame.tags.some(tag => tags.includes(tag))
                    );
                });
                setOtherVideogames(filterRelatedGames);
            }
        }

        async function gameDetails() {
            try {
                const response = await axios.get(`${API_URL}/${game}`)
                setSpecificGame(response.data[0]);
                filterOtherGames();
            }

            catch (err) {
                console.log(err)
            }
        }
        gameDetails()
    }, [game, specificGame.id, videogames]);
    console.log(API_URL);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isSet) {
            setIsSet(true);
            localStorage.setItem(id, JSON.stringify({ [id]: true }));
        }
    }, [id, isSet]);

    const cartBtnRef = useRef(null);
    const delBtnRef = useRef(null);

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
            }
        }, 500)
    };

    const handleIsTrue = (gameId) => {
        const getIsTrue = localStorage.getItem(gameId);
        const parseIstrue = JSON.parse(getIsTrue)
        return parseIstrue && parseIstrue[gameId];
    }

    const [isStock, setIsStock] = useState(false);
    const [logoStock, setLogoStock] = useState("");
    const platformRef = useRef();
    const handlePlatformValue = () => {
        const selectedLauncher = platformRef.current.value;
        const hasStock = stock && stock.some(({ units, platform, logo }) => {
            setLogoStock(logo);
            return units === 0 && platform === selectedLauncher
        });
        stock && stock.some(({ platform, logo }) => {
            setLogoStock(logo);
            return platform === selectedLauncher
        });
        setIsStock(!hasStock);
    }

    useEffect(() => {
        handlePlatformValue();
    }, [title]);

    const [cartBtnBottom, setCartBtnBottom] = useState(false);
    const handleCartBtnBottom = () => {
        if (window.scrollY > 400) {
            setCartBtnBottom(true);
        }
        else {
            setCartBtnBottom(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleCartBtnBottom);

        return () => {
            window.removeEventListener('scroll', handleCartBtnBottom);
        };
    }, []);

    return (
        <div className="gameDetails-container">
            <div className="gameBackgroundContainer">
                <img className="gameBackground" src={background} alt={title} />
                <div className="gradient-overlay"></div>
            </div>
            <div className="gameDetails-box text-white">
                <div className="gameOptions-container">
                    <img className="gameFrontPage rounded shadow" src={image} alt={title} />
                    <div className="gameOptions-box">
                        <div className="d-flex justify-content-between w-100">
                            <h3 className="gameTitle text-warning fs-3 m-0">{title}</h3>
                            <span className="fs-5">{price}</span>
                        </div>
                        <div className="d-flex justify-content-between w-100 gap-3">
                            <div className="d-flex flex-column gap-2 w-50">
                                <span>Launcher</span>
                                <select onChange={handlePlatformValue} ref={platformRef} name="platform" id="platformChoice">
                                    {
                                        stock && stock.map(({ platform }, index) => (
                                            <option key={index} value={platform}>{platform}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="d-flex flex-column align-items-center gap-2">
                                <span>Stock</span>
                                <div className="d-flex gap-2">
                                    <img className="logoStock" src={logoStock} />
                                    <div className="d-flex align-items-center">
                                        <span className={"fs-3 material-symbols-outlined " + (isStock ? "text-success" : "text-danger")}>
                                            {isStock ? "check" : "close"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center w-100">
                            <button
                                className="btn btn-danger"
                                onClick={() => handleRemoveFav(title)}>
                                <i className="fas fa-heart"></i>
                            </button>
                            <button ref={cartBtnRef} onClick={() => handleFalseCart(id)}
                                className="w-100 btn btn-warning d-flex justify-content-center align-items-center gap-2">
                                Add to cart
                                <span className="material-symbols-outlined">
                                    add_shopping_cart
                                </span>
                            </button>
                        </div>
                        <div className="d-flex gap-2">
                            <span>Tags:</span>
                            <div className="d-flex flex-wrap gap-2">
                                {
                                    tags && tags.map((tag, index) => (
                                        <span className="gameTag" key={index}>#{tag}</span>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="description-box d-flex flex-column gap-2 w-100">
                    <h3 className="text-warning">Description</h3>
                    <p className="fs-5">{description}</p>
                </div>
                <div className="w-100 gap-2 d-flex flex-column align-items-center">
                    <h3 className="text-warning align-left-left w-100">Gameplay</h3>
                    <div className="gameplay-box">
                        <iframe controls className="rounded" src={gameplay}></iframe>
                    </div>
                </div>
                <div className="screenshots-box gap-3 d-flex flex-column align-items-center w-100">
                    <h3 className="text-warning align-self-left w-100">Screenshots</h3>
                    {
                        !!screenshots ? (
                            <Carousel screenshots={screenshots} title={title} />
                        ) : (null)
                    }
                </div>
                <Comments />
            </div>
            {
                isStock && cartBtnBottom ?
                    <div id="detailBtns-box" className="d-flex align-items-center gap-3">
                        {
                            handleIsTrue(id) ? (
                                <button id="detailCart-btn" ref={cartBtnRef} onClick={() => handleFalseCart(id)} className="btn btn-warning d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined">
                                        add_shopping_cart
                                    </span>
                                </button>
                            ) : (
                                <button id="detailDelete-btn" ref={delBtnRef} onClick={() => handleTrueCart(id)} className="btn btn-danger d-flex align-items-center gap-2">
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            )
                        }
                    </div>
                    :
                    null
            }
            <div id="otherGames-container" className="d-flex flex-column">
                <h3 className="text-left text-warning mt-3">Related games</h3>
                <div id="otherGames-box" className="pb-3 d-flex w-100 flex-wrap rounded-0 justify-content-evenly">
                    {
                        otherVideogames.map(otherGame => {
                            return (
                                <Game
                                    handleAddToCart={handleAddToCart}
                                    handleRemoveFromCart={handleRemoveFromCart}
                                    titleLength={titleLength}
                                    key={otherGame.id}
                                    id={otherGame.id}
                                    title={otherGame.title}
                                    price={otherGame.price}
                                    description={otherGame.description}
                                    image={otherGame.image}
                                    prevGameplay={otherGame.prevGameplay}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <Buttons />
        </div >
    )
}