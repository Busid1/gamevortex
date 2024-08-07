import "./searchbar.css";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { HOME_URL } from "../../App";
import { useVideogames } from "../../contexts/VideogamesContext";

export default function SearchBar({ searchBarDeploy, searchBarFocus }) {
    const gameListBox = useRef();
    const inputList = useRef();
    const [gameList, setGameList] = useState([]);
    const videogames = useVideogames();

    const handleSearchGame = () => {
        const filterGamesTitle = videogames.filter(game => {
            console.log(game);
            const lowGameTitle = game.title.toLowerCase();
            const currentInputValue = inputList.current.value.toLowerCase();
            if (currentInputValue === "") {
                return false;
            }
            else if (lowGameTitle.includes(currentInputValue)) {
                return game;
            }
        });
        setGameList(filterGamesTitle);
    }

    const handleOnChange = (e) => {
        if (e.target.value === "") {
            setGameList(false);
        }
    }

    useEffect(() => {
        if (searchBarFocus) {
            inputList.current.focus();
        }
    }, [searchBarFocus])

    const disableSearchBox = () => {
        setGameList(false);
    }

    return (
        <div className={searchBarDeploy ? "searchBar-container" : "searchBar-container searchBarDeploy-container"}>
            <form className="d-flex">
                <input ref={inputList} onKeyUp={handleSearchGame}
                    onChange={handleOnChange}
                    className="w-100 search-bar"
                    placeholder="Minecraft, Valheim..."
                    type="search"
                />
            </form>

            <ul
                ref={gameListBox}
                className={"gameSearched-box"}
                style={{
                    overflowY: gameList.length > 8 ? "scroll" : "hidden",
                    maxHeight: "230px"
                }}
            >
                {gameList
                    ? gameList.map(({ title, id, image }) => {
                        return (
                            <li
                                onClick={disableSearchBox}
                                className="gameSearched-item my-1 px-2 py-1"
                                key={id}
                            >
                                <Link className="gameSearched-link lh-lg" to={`/${title}`}>
                                    <img src={image} alt={title} />
                                    <span>{title}</span>
                                </Link>
                            </li>
                        );
                    })
                    : null}
            </ul>
        </div>
    )
}