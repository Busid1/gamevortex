import "./footer.css";
import React, { useState } from "react";
import validation from "./validation";

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
                <div className="d-flex w-75 align-items-center justify-content-between">
                    <a className="navbar-brand fs-3" href="#!">VG Store</a>
                    <span className="fs-5">© 2023 Copyright: VG Store</span>
                </div>
                <hr className="w-75 m-2" />
            </div>
            <div className="d-flex flex-column align-items-center py-4" style={{ backgroundColor: "#121212" }}>
                <div className="d-flex justify-content-between w-75">
                    <form onSubmit={handleSubmit} className="input-container d-flex flex-column gap-2 w-50">
                        <h2 className="text-white fs-3 text-decoration-underline">Contact me!!</h2>
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

                        <button type="submit" className="btn btn-primary d-flex align-self-center justify-content-center py-2 border-0 w-50" >Send</button>
                    </form>
                    <div className="d-flex flex-column">
                        <h2 className="text-white text-decoration-underline fs-3">My social webs</h2>
                        <ul className="navbar d-flex flex-column gap-5 mt-4">
                            <li className="footerNav-item"><a href="#"><i className="fab fa-instagram text-danger shadow"></i><span>Instagram</span></a></li>
                            <li className="footerNav-item"><a href="https://github.com/Busid1"><i className="fab fa-github shadow text-dark"></i><span>Github</span></a></li>
                            <li className="footerNav-item"><a href="#"><i className="fab fa-linkedin text-primary shadow"></i><span>Linkedin</span></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
