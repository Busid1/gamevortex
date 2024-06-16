import "./footer.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import validation from "./validation";
import { HOME_URL } from "../../App";

export default function Footer() {
    return (
        <footer className="footer d-flex flex-column w-100 py-3">
            <hr className="text-white w-75 mx-auto" />
            <div className="d-flex justify-content-between px-3">
                <div className="d-flex align-items-center gap-1">
                    <Link className="footerLogo-box" to={`/${HOME_URL}`}>
                        <img className="gameVortex-logo" src="https://cdn.glitch.global/2c9253f6-1a6e-48eb-a381-f462c9c635d5/gameVortex-favicon.png?v=1707151017649" alt="gameVortex-logo" />
                    </Link>
                    <span className="copyright">© 2024 GameVortex</span>
                </div>
                <ul className="d-flex gap-2 p-0 m-0">
                    <li className="footerNav-item"><a href="#"><i className="fab fa-instagram shadow"></i></a></li>
                    <li className="footerNav-item"><a href="#"><i className="fab fa-github shadow"></i></a></li>
                    <li className="footerNav-item"><a href="#"><i className="fab fa-linkedin shadow"></i></a></li>
                </ul>
            </div>
        </footer>
    );
}
