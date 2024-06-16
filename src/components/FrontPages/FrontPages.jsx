import { useEffect, useState } from "react";
import FrontPage from "../FrontPage/FrontPage";
import "./frontpages.css";
import { useVideogames } from "../../contexts/VideogamesContext";

export default function FrontPages({ handleIsTrue, handleAddToCart, handleRemoveFromCart }) {
    const videogames = useVideogames();
    const frontPageGames = videogames.filter(game => game.id > 18 && game.id < 24)
    console.log(frontPageGames);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleSlideChange = (direction) => {
        if (direction === 'right') {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % frontPageGames.length);
        } else {
            setCurrentSlide((prevSlide) => (prevSlide - 1 + frontPageGames.length) % frontPageGames.length);
        }
    };

    // useEffect(() => {
    //     setTimeout(() => {
    //         setCurrentSlide(currentSlide + 1);
    //     }, 10000)
    // }, [currentSlide])

    return (
        <div className="frontPage-container">
            <div className="frontPage-box">
                {
                    frontPageGames.map((game, index) => (
                        <div key={index} className={`frontPageCarousel-item ${index === currentSlide ? 'show' : ''}`}>
                            <FrontPage
                                currentSlide={currentSlide}
                                handleIsTrue={handleIsTrue}
                                handleAddToCart={handleAddToCart}
                                handleRemoveFromCart={handleRemoveFromCart}
                                key={game.id}
                                id={game.id}
                                title={game.title}
                                price={game.price}
                                description={game.description}
                                image={game.image}
                                background={game.background}
                                frontPageImage={game.frontPageImage}
                            />
                        </div>
                    )

                    )
                }
                <div className="frontPageCarouselBtn-box">
                    <button onClick={() => handleSlideChange('left')} className="material-symbols-outlined chevron-left">
                        chevron_left
                    </button>
                    <button onClick={() => handleSlideChange('right')} className="material-symbols-outlined chevron-right">
                        chevron_right
                    </button>
                </div>
            </div>
        </div>
    )
}