import { useEffect, useState, } from "react";
import { useSelector } from "react-redux";
import Game from "../Game/Game";
import "./favorites.css"

export default function Favorites() {
    const reduxfavorites = useSelector(state => state.favGames);
    const favorites = reduxfavorites.filter((elem, index, arr) => {
        // Usa `findIndex` para encontrar el índice del primer elemento con el mismo ID
        const firstIndex = arr.findIndex((el) => el.id === elem.id);
        // Devuelve `true` solo si el índice actual coincide con el primer índice encontrado
        return firstIndex === index;
    });
    return (
        <section className="favorites-container">
            <div className="favorites-box">
                {
                    favorites.map(game => {
                        return (
                            <Game
                                titleLength={game.titleLength}
                                handleAddToCart={game.handleAddToCart}
                                handleRemoveFromCart={game.handleRemoveFromCart}
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