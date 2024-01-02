import "./searchbar.css";
import { searchGame } from "../../redux/actions";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SearchBar({ onSearch, searchGame, videogames }) {
    const [searchTitle, setSearchTitle] = useState("");
    const [styles, setStyles] = useState({});

    const handleOpenSearch = () => {
        setStyles({
            display: true,
            searchBarBoxWidth: "280px",
            searchBarWidth: "100%",
            opacity: 1
        })
    }

    const handleCloseSearch = () => {
        setStyles({
            display: false,
            searchBarBoxWidth: "40px",
            searchBarWidth: 0,
            opacity: 0
        })
    }

    const handleInput = (event) => {
        setSearchTitle(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTitle);
        setSearchTitle("");
    }

    const handleSearchGame = () => {
        document.addEventListener("keyup", e => {

            if (e.target.matches(".search-bar")) {

                if (e.key === "Escape") e.target.value = ""

                document.querySelectorAll(".gameSearched-link").forEach(game => {

                    game.textContent.toLowerCase().includes(e.target.value.toLowerCase())
                        ? game.classList.remove("filter")
                        : game.classList.add("filter")
                })

            }

        })
    }

    handleSearchGame();

    const disableSearchBox = () => {
        setStyles({
            display: false
        })
    }

    const titleLength = (title) => {
        if(title.length > 20){
            let ellipsisTitle = title.slice(0, 24) + "...";
            console.log(ellipsisTitle);
            return ellipsisTitle;
        }
        else{
            return title;
        }
    }

    return (
        <div className="searchBar-container">
            <div className="d-flex align-items-center fs-4 searchBar-box">
                <form onSubmit={handleSubmit}>
                    {
                        styles.display ? (
                            <button style={{}} className="fa fa-search bg-transparent border-0 mx-2" type="submit"></button>
                        ) : (null)
                    }
                </form>
                {
                    styles.display ?
                        (
                            <div className="d-flex align-items-center" style={{ width: styles.searchBarBoxWidth }}>
                                <input autoFocus onChange={handleInput} value={searchTitle} style={{ width: styles.searchBarWidth, opacity: styles.opacity }} className="search-bar rounded-pill border-0 px-2" placeholder="Minecraft, Valheim..."
                                    type="text" />

                                <span id="close-searchBar" onClick={handleCloseSearch} style={{ opacity: styles.opacity }}
                                    className="material-symbols-outlined fs-2">
                                    close
                                </span>
                            </div>
                        ) :
                        (
                            <i id="search-icon" onClick={handleOpenSearch} className="fas fa-search position-absolute start-50"></i>
                        )
                }

            </div>
            {
                styles.display ?
                    (
                        <div className="gameSearched-box" style={{display: styles.display ? "block" : "none"}}>
                            <ul className="p-0 w-100">
                                {
                                    videogames.map(game => {
                                        if(game.id < 6){
                                            return (
                                                <li onClick={disableSearchBox} className="gameSearched-item w-100 my-1" key={game.id}>
                                                    <Link className="gameSearched-link w-100 px-3 py-2 lh-lg" to={`${game.title}`}>
                                                        {titleLength(game.title)}
                                                    </Link>
                                                </li>
                                            )
                                        }
                                    })
                                }
                            </ul>
                        </div>
                    ) :
                    (null)
            }
        </div>
    )
}