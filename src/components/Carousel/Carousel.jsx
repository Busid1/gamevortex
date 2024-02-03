import React, { useState } from 'react';
import './carousel.css';
import './carouselResponsive.css';

export default function Carousel({ screenshots, title }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [zoomActive, setZoomActive] = useState(false);

    const handleZoomIn = () => {
        setZoomActive(true);
        document.body.style.overflowY = 'hidden';
    };

    const handleZoomOut = () => {
        setZoomActive(false);
        document.body.style.overflowY = 'scroll';
    };

    const handleSlideChange = (direction) => {
        if (direction === 'right') {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % screenshots.length);
        } else {
            setCurrentSlide((prevSlide) => (prevSlide - 1 + screenshots.length) % screenshots.length);
        }
    };

    return (
        <div className={`carousel-container ${zoomActive ? 'zoomActive' : ''}`}>
            <div className="zoomBtn-box">
                <button className="material-symbols-outlined zoom" onClick={handleZoomIn}></button>
            </div>
            <div className="closeBtn-box">
                <button className={zoomActive ? "material-symbols-outlined close" : "d-none"} onClick={handleZoomOut}>close</button>
            </div>

            {screenshots.map((screenshot, index) => (
                //Only the first item can have the class show
                <div key={index} className={`carousel-box ${index === currentSlide ? 'show' : ''}`}>
                    <img src={screenshot} alt={title} />
                </div>
            ))}

            <div className="carouselBtn-box">
                <button onClick={() => handleSlideChange('left')} className="material-symbols-outlined chevron-left">
                    keyboard_double_arrow_left
                </button>
                <button onClick={() => handleSlideChange('right')} className="material-symbols-outlined chevron-right">
                    keyboard_double_arrow_right
                </button>
            </div>
        </div>
    );
};
