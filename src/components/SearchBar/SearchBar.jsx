import "./searchbar.css";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function SearchBar({ onSearch, videogames }) {
    const [searchTitle, setSearchTitle] = useState("");
    const [styles, setStyles] = useState({});

    const handleInput = (event) => {
        setSearchTitle(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTitle);
        setSearchTitle("");
    }

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
        setGameList(filterGamesTitle)
    }

    const disableSearchBox = () => {
        setStyles({
            display: false
        })
        setSearchTitle("");
        setGameList(false);
    }

    const titleLength = (title) => {
        if (title.length > 14) {
            let ellipsisTitle = title.slice(0, 14) + "...";
            return ellipsisTitle;
        }
        else {
            return title;
        }
    }

    return (
        <div className="searchBar-container d-flex">
            <form onSubmit={handleSubmit} className="d-flex">
                <input ref={inputList} onKeyUp={handleSearchGame} autoFocus 
                    onChange={handleInput} 
                    value={searchTitle} 
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
                    ? gameList.map(game => {
                        return (
                            <li
                                onClick={disableSearchBox}
                                className="gameSearched-item my-1 px-2 py-1"
                                key={game.id}
                            >
                                <Link className="gameSearched-link lh-lg" to={`/${game.title}`}>
                                    <img src={game.image} alt={game.title} />
                                    {titleLength(game.title)}
                                </Link>
                            </li>
                        );
                    })
                    : null}
            </ul>


        </div>
    )
}