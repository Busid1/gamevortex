import { Link, useLocation, useParams } from "react-router-dom";
import "./breadcrumb.css";
import { useState, useEffect } from "react";

export default function Breadcrumb() {
    const { game } = useParams();
    const { tag } = useParams();
    const { pathname } = useLocation();
    const [pathName, setPathname] = useState(false)

    const handlePathname = () => {
        if (pathname === "/cart") {
            setPathname(true)
        }
        else {
            setPathname(false);
        }
    }

    useEffect(() => {
        handlePathname()
    }, [pathName])

    return (
        <div className="breadcrumb-container d-flex align-items-center col-md-5 mt-3 rounded">
            <nav aria-label="breadcrumb">
                <ol className="m-0 breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to={"/"} className="text-warning rounded-start">
                            VG Store
                        </Link>
                    </li>

                    {
                        pathName ? (
                            <li className="breadcrumb-item">
                                <a href="#" className="text-warning py-1 px-2">
                                    Cart
                                </a>
                            </li>
                        ) : pathname === `/games/${tag}` ? (
                            <>
                                <li className="breadcrumb-item">
                                    <a href="#" className="text-warning py-1 px-2">
                                        Tags
                                    </a>
                                </li>
                                <li className="breadcrumb-item">
                                    <a href="#" className="text-warning py-1 px-2">
                                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                    </a>
                                </li>
                            </>
                        ) : (
                            < li className="breadcrumb-item">
                                <a href="#" className="text-warning py-1 px-2">
                                    {game}
                                </a>
                            </li>
                        )
                    }
                </ol>
            </nav>
        </div >
    )
}