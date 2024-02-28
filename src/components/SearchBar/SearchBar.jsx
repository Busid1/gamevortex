import "./searchbar.css";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function SearchBar({ videogames }) {
    const gameListBox = useRef();
    const inputList = useRef();
    const [gameList, setGameList] = useState(false);
    const handleSearchGame = () => {
        const filterGamesTitle = videogames.filter(game => {
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
        if(e.target.value === ""){
            setGameList(false);
        }
    }

    const disableSearchBox = () => {
        setGameList(false);
    }

    return (
        <div className="searchBar-container d-flex">
            <form className="d-flex">
                <input ref={inputList} onKeyUp={handleSearchGame} 
                    onChange={handleOnChange}
                    className="w-100 search-bar px-2"
                    placeholder="Minecraft, Valheim..."
                    type="search" />
            </form>
            <ul
                ref={gameListBox}
                className="gameSearched-box p-0"
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
                                    <span>{ title }</span>
                                </Link>
                            </li>
                        );
                    })
                    : null}
            </ul>


        </div>
    )
}