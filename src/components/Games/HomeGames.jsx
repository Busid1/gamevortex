import { useRef } from "react";
import Game from "../Game/Game";
import { useVideogames } from "../../contexts/VideogamesContext";

export default function HomeGames({ handleAddToCart, handleRemoveFromCart }) {
    const videogames = useVideogames();
    const cardGamesContentRef = useRef(null);

    const scrollLeft = () => {
        cardGamesContentRef.current.scrollBy({
            left: -440, // Ajusta la cantidad de desplazamiento según sea necesario
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        cardGamesContentRef.current.scrollBy({
            left: 440, // Ajusta la cantidad de desplazamiento según sea necesario
            behavior: 'smooth'
        });
    };

    return (
        <div id="cardGames-box" className="px-3">
            <div className="homeFilter-box">
                <h2 className="text-white m-0">Home</h2>
            </div>
            <div className="cardGames-container">
                <button className="material-symbols-outlined cardGamesBtn-left"
                    onClick={scrollLeft}>
                    chevron_left
                </button>
                <div className="cardGames-content" ref={cardGamesContentRef}>
                    {
                        videogames.map(game => {
                            if (game.id >= 1 && game.id <= 6) {
                                return (
                                    <Game
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
                <button className="material-symbols-outlined cardGamesBtn-right"
                    onClick={scrollRight}>
                    chevron_right
                </button>
            </div>
        </div>
    )
}