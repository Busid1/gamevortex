import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase.js";
import showMessage from "./showMessage.js";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { loginCheck } from "./loginCheck.js";

export default function SignupForm() {
    const signupFormRef = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        if (signupFormRef.current) {
            e.preventDefault();

            try {
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                // Hide the modal
                const signupModal = document.querySelector("#signupModal");
                const modal = bootstrap.Modal.getInstance(signupModal);
                modal.hide();
                // Message signup successfully
                showMessage("Welcome " + userCredentials.user.email);
                // Clear the inputs after signup
                setEmail("");
                setPassword("");
            } catch (error) {
                console.log(error);
                if (error.code === "auth/invalid-email") {
                    showMessage("Invalid email", "error");
                } else if (error.code === "auth/email-already-in-use") {
                    showMessage("Email already in use", "error");
                } else if (error.code === "auth/invalid-email") {
                    showMessage("Invalid email", "error");
                } else if (error.code === "auth/weak-password") {
                    showMessage("Password is too weak", "error");
                } else if (error.code) {
                    showMessage("Something went wrong", "error");
                }
            }
        }
    };

    return (
        <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5 text-white" id="exampleModalLabel">Signup</h1>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form ref={signupFormRef} id="signup-form" onSubmit={handleSignupSubmit}>
                            <label htmlFor="email" className="form-label text-white">Email:</label>
                            <input type="email" id="signup-email"
                                className="form-control mb-3"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="password" className="form-label text-white">Password</label>
                            <input type="password" id="signup-password"
                                className="form-control mb-3"
                                placeholder="******"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary">Register</button>
                        </form>
                        <div className="d-flex align-items-center gap-2 mt-3">
                            <p className="text-white m-0">Do you already have an account?</p>
                            <Link data-bs-toggle="modal" data-bs-target="#signinModal">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

