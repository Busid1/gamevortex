import "./footer.css";
import React, { useState } from "react";
import validation from "./validation";
import gameVortexLogo from "../../images/gamevortexlogo.png"

export default function Footer() {
    const [isFocused, setIsFocused] = useState({
        name: false,
        email: false,
        message: false
    });

    const handleFocusChange = (event) => {
        const { name } = event.target;
        setIsFocused((prevState) => ({
            ...prevState,
            [name]: !prevState[name]
        }));
    };

    const [errors, setErrors] = useState({});

    const [userData, setUserData] = useState({
        name: "",
        email: "",
    });

    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        })

        setErrors(validation({
            ...userData,
            [event.target.name]: event.target.value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(validation(userData))
    }

    return (
        <footer className="footer d-flex flex-column w-100 bg-warning">
            <div className="d-flex flex-column align-items-center py-3">
                <div className="d-flex align-items-center justify-content-evenly">
                    <span className="copyright">© 2024 Copyright:</span>
                    <a className="footerLogo-box" href="#"><img className="gameVortex-logo" src={gameVortexLogo} alt="gameVortex-logo" /></a>
                </div>
                <hr className="w-50 m-2" />
            </div>
            <div id="contactSocial-box" className="py-4" style={{ backgroundColor: "#121212" }}>
                <div id="contact-box" className="d-flex justify-content-evenly">
                    <form onSubmit={handleSubmit} className="input-container d-flex flex-column gap-2">
                        <h2 className="text-white fs-6 text-decoration-underline">Contact me!!</h2>
                        <input
                            type="text"
                            name="name"
                            className={`custom-input ${isFocused.name ? 'focused' : ''}`}
                            placeholder="Your name"
                            onFocus={handleFocusChange}
                            onBlur={handleFocusChange}
                            autoComplete="off"
                            onChange={handleChange}
                            value={userData.name}
                        />
                        {
                            errors.name ?
                                (
                                    <p className="text-danger m-0">{errors.name}</p>
                                ) :
                                (null)
                        }

                        <input
                            type="text"
                            name="email"
                            className={`custom-input ${isFocused.email ? 'focused' : ''}`}
                            placeholder="Your email"
                            onFocus={handleFocusChange}
                            onBlur={handleFocusChange}
                            autoComplete="off"
                            onChange={handleChange}
                            value={userData.email}
                        />
                        {
                            errors.email ?
                                (
                                    <p className="text-danger m-0">{errors.email}</p>
                                ) :
                                (null)
                        }

                        <textarea
                            name="message"
                            className={`custom-input ${isFocused.message ? 'focused' : ''}`}
                            placeholder="Write a message..."
                            onFocus={handleFocusChange}
                            onBlur={handleFocusChange}
                            autoComplete="off"

                        />

                        <button type="submit" className="btn btn-primary d-flex align-self-center justify-content-center py-2 border-0" >Send</button>
                    </form>
                </div>
                <div id="socialWebs-box" className="d-flex flex-column">
                    <h2 className="text-white text-decoration-underline fs-6">My social webs</h2>
                    <ul className="navbar gap-5 mt-3">
                        <li className="footerNav-item"><a href="#"><i className="fab fa-instagram text-danger shadow"></i><span>Instagram</span></a></li>
                        <li className="footerNav-item"><a href="https://github.com/Busid1"><i className="fab fa-github shadow text-dark"></i><span>Github</span></a></li>
                        <li className="footerNav-item"><a href="#"><i className="fab fa-linkedin text-primary shadow"></i><span>Linkedin</span></a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
