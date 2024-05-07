import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase.js";
import showMessage from "./showMessage.js";
import { useRef, useState } from "react";
import GoogleLogin from "./GoogleLogin.jsx";
import { Link } from "react-router-dom";
import { loginCheck } from "./loginCheck.js";

export default function SigninForm() {
    const signinFormRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSigninSubmit = async (e) => {
        e.preventDefault();
        
        if (signinFormRef) {
            try {
                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                console.log(userCredentials);

                // Hide modal
                const signInModal = document.querySelector("#signinModal");
                const modal = bootstrap.Modal.getInstance(signInModal);
                modal.hide();
                // Message login successfully
                showMessage("Welcome " + userCredentials.user.email);
                // Clear the inputs after login
                setEmail("");
                setPassword("");
                // Add collections
                loginCheck(userCredentials.user);
            } catch (error) {
                console.log(error);
                if (error.code === "auth/invalid-email") {
                    showMessage("Invalid email", "error");
                } else if (error.code === "auth/missing-password") {
                    showMessage("Password empty", "error");
                } else if (error.code === "auth/invalid-credential") {
                    showMessage("Password/email incorrect", "error");
                } else if (error.code) {
                    showMessage("Something went wrong", "error");
                }
            }
        }
    }

    return (
        <div className="modal fade" id="signinModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5 text-white" id="exampleModalLabel">Signin</h1>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form ref={signinFormRef} onSubmit={handleSigninSubmit} id="login-form">
                            <label htmlFor="email" className="form-label text-white">Email:</label>
                            <input type="email" id="login-email"
                                className="form-control mb-3"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="password" className="form-label text-white">Password</label>
                            <input type="password" id="login-password"
                                className="form-control mb-3"
                                placeholder="*********"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
                            <GoogleLogin />
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <p className="text-white m-0">Don´t you already have an account?</p>
                                <Link data-bs-toggle="modal" data-bs-target="#signupModal">Register</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}