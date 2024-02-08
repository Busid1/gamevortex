import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import axios from "axios";
import "./gamedetails.css";
import Game from "../Game/Game";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions";
import Carousel from "../Carousel/Carousel";
import Buttons from "../Buttons/Buttons";

export default function GameDetails({ videogames, handleAddToCart, handleRemoveFromCart, titleLength }) {
    const [specificGame, setSpecificGame] = useState([]);
    const [otherVideogames, setOtherVideogames] = useState([]);
    const [isSet, setIsSet] = useState(false);
    const { game } = useParams();

    useEffect(() => {
        const filterOtherGames = () => {
            if (videogames) {
                const filterOtherGames = videogames.filter(otherGame => otherGame.id !== id)
                setOtherVideogames(filterOtherGames);
            }
        }

        async function gameDetails() {
            try {
                const response = await axios.get(`https://bow-rebel-apartment.glitch.me/${game}`)
                setSpecificGame(response.data[0]);
                filterOtherGames();
            }

            catch (err) {
                console.log(err)
            }
        }
        gameDetails()
    }, [game, specificGame.id, videogames])

    const { id, title, description, price, image, background, screenshots, gameplay } = specificGame;

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

    return (
        <div className="gameDetails-container">
            <div className="gameBackgroundContainer">
                <img className="gameBackground" src={background} alt={title} />
                <div className="gradient-overlay"></div>
                <div className="gameFrontPageContainer d-flex justify-content-center align-items-center">
                    <img className="gameFrontPage rounded shadow mt-3" src={image} alt={title} />
                </div>
            </div>
            <div className="gameDetails-box text-white">
                <div className="d-flex flex-column justify-content-between align-items-center w-100 gap-2">
                    <h3 className="w-100 text-warning fs-3 m-0">{title}</h3>
                    <span className="fs-5">{price}</span>
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
                <div className="screenshots-box d-flex flex-column align-items-center w-100">
                    <h3 className="text-warning align-self-left w-100">Screenshots</h3>
                    {
                        !!screenshots ? (
                            <Carousel screenshots={screenshots} title={title} />
                        ) : (null)
                    }
                </div>
            </div>
            <div id="otherGames-container" className="d-flex flex-column align-items-center">
                <h3 className="text-left text-warning mt-3">Other games</h3>
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
        </div>
    )
}