import { useSelector } from "react-redux";
import Game from "../Game/Game";
import "./wishlist.css";
import { useWishlist } from "../../contexts/WishListContext";

export default function Wishlist() {
    const reduxfavorites = useSelector(state => state.favGames);
    const { wishlistVideogames } = useWishlist();
    const favorites = reduxfavorites.filter((elem, index, arr) => {
        // Usa `findIndex` para encontrar el índice del primer elemento con el mismo ID
        const firstIndex = arr.findIndex((el) => el.id === elem.id);
        // Devuelve `true` solo si el índice actual coincide con el primer índice encontrado
        return firstIndex === index;
    });
    const gamesToRender = wishlistVideogames.length > 0 ? wishlistVideogames : favorites;

    return (
        <section className="wishlist-container">
            <h1 className="text-white mt-3">Wishlist</h1>
            <div className="wishlist-box">
                {gamesToRender.length > 0 ?
                    gamesToRender.map(game => {
                        return (
                            <Game
                                key={game.id}
                                id={game.id}
                                title={game.title}
                                price={game.price}
                                image={game.image}
                                description={game.description}
                                prevGameplay={game.prevGameplay}
                            />
                        )
                    })
                    :
                    <p className="text-white fs-4 mt-5">There are still no games on the wishlist :(</p>
                }
            </div>
        </section>
    )
}