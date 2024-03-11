import "./games.css";
import Game from "../Game/Game";
import FrontPage from "../FrontPage/FrontPage";
import Buttons from "../Buttons/Buttons";

export default function Games({ handleIsTrue, videogames, handleAddToCart, handleRemoveFromCart }) {
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
            <div id="cardGames-container">
                <div className="homeFilter-box">
                    <div className="homeTitle-box">
                        <h2 className="homeTitle">Home</h2>
                        <span id="leftRow-icon" className="material-symbols-outlined">
                            chevron_right
                        </span>
                    </div>
                    <button id="filter-btn">
                        Filter
                        <span className="text-warning material-symbols-outlined">
                            tune
                        </span>
                    </button>
                </div>
                <div id="cardGames-box" className="d-flex flex-wrap justify-content-evenly">
                    {
                        videogames.map(game => {
                            if (game.id !== 1) {
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
                                )
                            }
                        })
                    }
                </div>
            </div>
            <Buttons />
        </section>
    )
}