import "./tags.css";
import { useEffect, useState } from "react"
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Game from "../Game/Game";

export default function Tags({ id, handleAddToCart, handleIsTrue, handleRemoveFromCart }) {
    const [gameTag, setGameTag] = useState([])
    const { pathname } = useLocation();
    const { tag } = useParams();
    const URL_BASE = `https://bow-rebel-apartment.glitch.me${HOME_URL}`;

    const [isCurrentTag, setIsCurrentTag] = useState({
        action: false,
        survival: false,
        racing: false,
        sandbox: false,
    });

    useEffect(() => {
        if (tag) {
            axios.get(`${URL_BASE}/games/${tag}`)
                .then((response) => {
                    setGameTag(response.data);
                })
                .catch((err) => {
                    setGameTag(false);
                    return err;
                })

            // Add a yellow background fixed to the current tag
            setIsCurrentTag({
                [tag]: true,
            });
        }
    }, [pathname, tag]);

    useEffect(() => {
        if (location.pathname !== HOME_URL) {
            localStorage.setItem(id, JSON.stringify({ [id]: true }));
        }
    }, []);

    return (
        <div className="tag-container">
            
            {
                gameTag.length > 0 ?
                    (
                        <section className="d-flex flex-column align-items-center gamesTag-container">
                            <div id="tags-games-box" className="d-flex flex-column">
                                <div className="tagTitle-box">
                                    <h2 className="tagTitle">{tag}</h2>
                                    <span id="leftRow-icon" className="material-symbols-outlined">
                                        chevron_right
                                    </span>
                                </div>
                                <div id="tag-games" className="d-flex flex-wrap rounded-0 pb-3 justify-content-evenly">
                                    {
                                        gameTag.map(({ id, title, price, description, image, prevGameplay }) => {
                                            return (
                                                <Game
                                                    handleIsTrue={handleIsTrue}
                                                    handleAddToCart={handleAddToCart}
                                                    handleRemoveFromCart={handleRemoveFromCart}
                                                    key={id}
                                                    id={id}
                                                    title={title}
                                                    price={price}
                                                    description={description}
                                                    image={image}
                                                    prevGameplay={prevGameplay}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </section>

                    ) :
                    (
                        <div id="notFound-box" className="d-flex align-items-center justify-content-center">
                            <h2 className="text-white">Nothing found :(</h2>
                        </div>
                    )
            }
        </div>
    )
}
