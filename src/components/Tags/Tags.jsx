import "./tags.css";
import { useEffect, useState, useRef } from "react"
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Game from "../Game/Game";

export default function Tags({ id, handleAddToCart, handleRemoveFromCart, titleLength }) {
    const [gameTag, setGameTag] = useState([])
    const { pathname } = useLocation();
    const { tag } = useParams();
    const URL_BASE = "https://bow-rebel-apartment.glitch.me";

    const [isCurrentTag, setIsCurrentTag] = useState({
        action: false,
        survival: false,
        racing: false,
        sandbox: false,
    });

    useEffect(() => {
        axios.get(`${URL_BASE}/games/${tag}`)
            .then((response) => {
                setGameTag(response.data);
            })
            .catch((err) => {
                setGameTag(false);
                return err;
            })

        //Add a yellow background fixed to the current tag
        setIsCurrentTag({
            [tag]: true,
        });
    }, [pathname, tag])

    useEffect(() => {
        if (location.pathname !== "/") {
            localStorage.setItem(id, JSON.stringify({ [id]: true }));
        }
    }, []);

    return (
        <div className="tag-container">
            <div className="nav-item dropdown text-white d-flex justify-content-evenly align-items-center">
                <div className="d-flex tag-box justify-content-evenly align-items-center col-12">
                    <Link className={`currentTag ${isCurrentTag.action ? 'focused' : ''}`} to={"/games/action"}>Action</Link>
                    <Link className={`currentTag ${isCurrentTag.survival ? 'focused' : ''}`} to={"/games/survival"}>Survival</Link>
                    {/* <Link className={`currentTag ${isCurrentTag.racing ? 'focused' : ''}`} to={"/games/racing"}>Racing</Link> */}
                    <Link className={`currentTag ${isCurrentTag.sandbox ? 'focused' : ''}`} to={"/games/sandbox"}>Sandbox</Link>
                    {/* This function below "handleFocus" clear the current tag */}
                    <div className="d-flex align-items-center btn-group">
                        <span className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Other
                        </span>
                        <ul className="dropdown-menu">
                            <li><Link to={"/games/terror"} className="dropdown-item" href="#">Terror</Link></li>
                            <li><Link to={"/games/RPG"} className="dropdown-item" href="#">RPG</Link></li>
                            <li><Link to={"/games/shooter"} className="dropdown-item" href="#">Shooter</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link to={"/"} className="dropdown-item" href="#">All tags...</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
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
                                <div className="d-flex flex-wrap rounded-0 gap-3 pb-3 justify-content-evenly">
                                    {
                                        gameTag.map(({ id, title, price, description, image, prevGameplay }) => {
                                            return (
                                                <Game
                                                    handleAddToCart={handleAddToCart}
                                                    handleRemoveFromCart={handleRemoveFromCart}
                                                    titleLength={titleLength}
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
                    pathname !== "/" ?
                        (
                            <div id="notFound-box" className="d-flex align-items-center justify-content-center">
                                <h2 className="text-white">Nothing found :(</h2>
                            </div>
                        ) : (null)
            }
        </div>
    )
}
