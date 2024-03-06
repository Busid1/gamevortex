import "./buttons.css";
import { useState, useEffect } from "react";

export default function Buttons() {
    const [isArrowUp, setIsArrowUp] = useState(false);

    const isScrollY = () => {
        if (window.scrollY > 100) {
            setIsArrowUp(true);
        }
        else {
            setIsArrowUp(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', isScrollY);

        return () => {
            window.removeEventListener('scroll', isScrollY);
        };
    }, []);

    const handleScrollUp = () => {
        document.body.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }

    

    return (
        <div>
            {
                isArrowUp ?
                    <button onClick={handleScrollUp} className="arrowUp-box rounded-circle btn btn-warning material-symbols-outlined">
                        arrow_upward
                    </button>
                    : null
            }
        </div>

    )
}