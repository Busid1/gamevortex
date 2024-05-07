import "./games.css";
import { useState, useEffect } from "react";
import Game from "../Game/Game";
import FrontPage from "../FrontPage/FrontPage";
import Buttons from "../Buttons/Buttons";
import { Link } from "react-router-dom";
import { HOME_URL } from "../../App";

export default function Games({ cartCount, handleIsTrue, videogames, handleAddToCart, handleRemoveFromCart }) {
    const [isCategories, setIsCategories] = useState(true);
    const handleToggleCategories = () => {
        setIsCategories(!isCategories);
    }

    const [savedTags, setSavedTags] = useState([]);
    const [isTagSelected, setIsTagSelected] = useState({});
    const handleAddTag = (tagId, tagName) => {
        setIsTagSelected(prevState => ({
            ...prevState,
            [tagId]: !prevState[tagId],
        }));
        setSavedTags(prevSavedTags => [
            ...prevSavedTags,
            { id: tagId, name: tagName }
        ]);
    };

    const [gamesFilteredByTag, setGamesFilteredByTag] = useState([]);
    const handleFilterGameTags = () => {
        if (videogames) {
            const filterGameTags = videogames.filter(videogame => {
                return savedTags.every(tag => videogame.tags.includes(tag.name));
            });
            setGamesFilteredByTag(filterGameTags);
        }
    }

    const delDupSavedTags = savedTags.filter((elem, index, arr) => {
        // Usa `findIndex` para encontrar el índice del primer elemento con el mismo ID
        const firstIndex = arr.findIndex((el) => el.id === elem.id);
        // Devuelve `true` solo si el índice actual coincide con el primer índice encontrado
        return firstIndex === index;
    });

    const handleDelTag = (tagId) => {
        const newSavedTags = delDupSavedTags.filter(tag => tag.id !== tagId);
        setGamesFilteredByTag(newSavedTags);
        setSavedTags(newSavedTags);
        setIsTagSelected(prevState => ({
            ...prevState,
            [tagId]: !prevState[tagId],
        }));
    };

    useEffect(() => {
        handleFilterGameTags();
    }, [savedTags]);

    const [isShowTags, setIsShowTags] = useState(true);
    const handleShowTags = () => {
        setIsShowTags(!isShowTags);
    }
    
    const [isShowPlatform, setIsShowPlatform] = useState(true);
    const handleShowPlatform = () => {
        setIsShowPlatform(!isShowPlatform);
    }

    const gameTagsArray = ["action", "adventure", "strategy", "rol", "sports", "simulation", "puzzle", "music", "racing", "sandbox", "platformer", "fighting", "stealth", "multiplayer", "indie", "horror", "survival", "shooter", "arcade", "RPG", "casual"];
    const gamePlatformArray = ["playstation 4", "playstation 5", "xbox one", "xbox one series x|s", "personal computer (PC)", "nintendo switch"];

    return (
        <section id="home-container" className="d-flex flex-column w-100 align-items-center">
            {
                videogames.map(game => {
                    if (game.id === 1) {
                        return (
                            <FrontPage
                                handleIsTrue={handleIsTrue}
                                handleAddToCart={handleAddToCart}
                                handleRemoveFromCart={handleRemoveFromCart}
                                key={game.id}
                                id={game.id}
                                title={game.title}
                                price={game.price}
                                description={game.description}
                                image={game.image}
                                frontPageImage={game.frontPageImage}
                            />
                        )
                    }
                })
            }
            <div className="homeFilter-box">
                <div className="homeLinks-box">
                    <Link to={`${HOME_URL}`} className="homeLink">Home</Link>
                    <Link to={`${HOME_URL}/popular`} className="homeLink noActive">Popular</Link>
                    <Link to={`${HOME_URL}/offers`} className="homeLink noActive">Offers</Link>
                </div>
                <div className="filter-container">
                    <button id="filter-btn" onClick={handleToggleCategories}>
                        Filter
                        <span className="text-warning material-symbols-outlined">
                            tune
                        </span>
                    </button>
                    <div className={isCategories ? "categories-container" : "categories-container show"}>
                        <div className="d-flex w-100">
                            <span className="text-white mx-auto">Filter by</span>
                            <span className="text-danger material-symbols-outlined">
                                close
                            </span>
                        </div>
                        {
                            isShowTags ?
                                <div className="categories-menu" onClick={handleShowTags}>
                                    <span className="text-warning" tabIndex="0">Tags</span>
                                    <span className="text-white material-symbols-outlined">
                                        chevron_right
                                    </span>
                                </div>
                                :
                                <div className="tag-container">
                                    <div>
                                        <span className="text-white material-symbols-outlined" onClick={handleShowTags}>
                                            chevron_left
                                        </span>
                                        <span className="text-warning mx-auto" tabIndex="0">Tags</span>
                                    </div>
                                    <ul className="tag-box">
                                        {
                                            gameTagsArray.map((tag, index) => {
                                                return isTagSelected[index] ?
                                                    <li key={index} className="gameTags-list" onClick={() => handleDelTag(index)}>
                                                        <button id={index} className="text-primary ml-2 material-symbols-outlined">
                                                            check_box
                                                        </button>
                                                        <span className="vr text-white mx-1"></span>
                                                        <span className="badge">{tag}</span>
                                                    </li>
                                                    :
                                                    <li key={index} className="gameTags-list" onClick={() => handleAddTag(index, tag)}>
                                                        <button id={index} className="material-symbols-outlined">
                                                            check_box_outline_blank
                                                        </button>
                                                        <span className="vr text-white mx-1"></span>
                                                        <span className="text-white">{tag}</span>
                                                    </li>
                                            })
                                        }
                                    </ul>
                                </div>
                        }

                        {
                            isShowPlatform ?
                                <div className="categories-menu" onClick={handleShowPlatform}>
                                    <span className="text-warning" tabIndex="0">Platform</span>
                                    <span className="text-white material-symbols-outlined">
                                        chevron_right
                                    </span>
                                </div>
                                :
                                <div className="platform-container">
                                    <div>
                                        <span className="text-white material-symbols-outlined" onClick={handleShowPlatform}>
                                            chevron_left
                                        </span>
                                        <span className="text-warning mx-auto" tabIndex="0">Platform</span>
                                    </div>
                                    <ul className="platform-box">
                                        {
                                            gamePlatformArray.map((tag, index) => {
                                                return isTagSelected[index] ?
                                                    <li key={index} className="gameTags-list" onClick={() => handleDelTag(index)}>
                                                        <button id={index} className="text-primary ml-2 material-symbols-outlined">
                                                            check_box
                                                        </button>
                                                        <span className="vr text-white mx-1"></span>
                                                        <span className="badge">{tag}</span>
                                                    </li>
                                                    :
                                                    <li key={index} className="gameTags-list" onClick={() => handleAddTag(index, tag)}>
                                                        <button id={index} className="material-symbols-outlined">
                                                            check_box_outline_blank
                                                        </button>
                                                        <span className="vr text-white mx-1"></span>
                                                        <span className="text-white">{tag}</span>
                                                    </li>
                                            })
                                        }
                                    </ul>
                                </div>
                        }
                        <button onClick={() => { handleToggleCategories(); handleFilterGameTags() }} className="btn btn-primary px-4">
                            Apply filters
                        </button>
                    </div>
                    <div className="savedTags-box">
                        {
                            delDupSavedTags.map((tag) => (
                                <div key={tag.id} className="savedTags-list" onClick={() => { handleDelTag(tag.id); handleFilterGameTags(tag.id) }}>
                                    <span className="badge">{tag.name}</span>
                                    <span className="vr text-white mx-1"></span>
                                    <button id={tag.id} className="material-symbols-outlined">
                                        cancel
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div id="cardGames-container">
                <div id="cardGames-box">
                    {
                        savedTags.length > 0 ?
                            gamesFilteredByTag.map(game => {
                                return (
                                    <Game
                                        cartCount={cartCount}
                                        handleIsTrue={handleIsTrue}
                                        handleAddToCart={handleAddToCart}
                                        handleRemoveFromCart={handleRemoveFromCart}
                                        key={game.id}
                                        id={game.id}
                                        title={game.title}
                                        price={game.price}
                                        description={game.description}
                                        image={game.image}
                                        prevGameplay={game.prevGameplay}
                                    />
                                );
                            })
                            :
                            videogames.map(game => {
                                if (game.id !== 1) {
                                    return (
                                        <Game
                                            cartCount={cartCount}
                                            handleIsTrue={handleIsTrue}
                                            handleAddToCart={handleAddToCart}
                                            handleRemoveFromCart={handleRemoveFromCart}
                                            key={game.id}
                                            id={game.id}
                                            title={game.title}
                                            price={game.price}
                                            description={game.description}
                                            image={game.image}
                                            prevGameplay={game.prevGameplay}
                                        />
                                    );
                                }
                            })
                    }
                </div>
                {/* <h3 className="text-white w-100 mt-5">New</h3>
                <div id="cardGames-box">
                    {
                        videogames.map(game => {
                            if (game.new) {
                                return (
                                    <Game
                                        handleIsTrue={handleIsTrue}
                                        handleAddToCart={handleAddToCart}
                                        handleRemoveFromCart={handleRemoveFromCart}
                                        key={game.id}
                                        id={game.id}
                                        title={game.title}
                                        price={game.price}
                                        description={game.description}
                                        image={game.image}
                                        prevGameplay={game.prevGameplay}
                                    />
                                );
                            }
                        })
                    }
                </div> */}
            </div>
            <Buttons />
        </section>
    )
}