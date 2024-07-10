import FrontPages from "../FrontPages/FrontPages";
import Games from "../Games/Games";
import "./home.css";

export default function Home({ handleIsTrue, handleAddToCart, handleRemoveFromCart }) {    
    return (
        <div id="home-container" className="d-flex flex-column w-100 align-items-center">
            <FrontPages 
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />
            <Games
                handleIsTrue={handleIsTrue}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />
        </div>

    )
}