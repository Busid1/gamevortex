import "./games.css"
import Game from "../Game/Game";
import FrontPage from "../FrontPage/FrontPage";

export default function Games({ videogames, handleAddToCart, handleRemoveFromCart, titleLength}) {
    return (
        <section className="d-flex flex-column w-100 align-items-center">
            <div id="cards-games-box" className="bg-dark pb-3 d-flex w-100 flex-wrap rounded-0 justify-content-evenly">
                {
                    videogames.map(game => {
                        if (game.id === 1) {
                            return (
                                <FrontPage
                                    handleAddToCart={handleAddToCart}
                                    handleRemoveFromCart={handleRemoveFromCart}
                                    key={game.id}
                                    id={game.id}
                                    title={game.title}
                                    price={game.price}
                                    description={game.description}
                                    image={game.image}
                                />
                            )
                        }
                        return (
                            <Game
                                handleAddToCart={handleAddToCart}
                                handleRemoveFromCart={handleRemoveFromCart}
                                titleLength={titleLength}
                                key={game.id}
                                id={game.id}
                                title={game.title}
                                price={game.price}
                                description={game.description}
                                image={game.image}
                                prevGameplay={game.prevGameplay}
                            />
                        )
                    })
                }
            </div>
        </section>
    )
}