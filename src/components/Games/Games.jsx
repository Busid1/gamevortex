import "./games.css";
import Buttons from "../Buttons/Buttons";
import CartPreview from "../CartPreview/CartPreview";
import HomeGames from "./HomeGames";
import PopularGames from "./PopularGames";
import OfferGames from "./OfferGames";

export default function Games({ handleAddToCart, handleRemoveFromCart }) {
    return (
        <section className="d-flex flex-column w-100 align-items-center">
            <CartPreview handleRemoveFromCart={handleRemoveFromCart} />
            <div id="cardGames-container">
                <HomeGames handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />
                <PopularGames handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />
                <OfferGames handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart}/>
            </div>
            <Buttons />
        </section>
    )
}