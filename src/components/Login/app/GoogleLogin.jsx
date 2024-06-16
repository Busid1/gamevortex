import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase.js";
import showMessage from "./showMessage.js";
import { useRef } from "react";
import { loginCheck } from "./loginCheck.js";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../App";

export default function GoogleLogin() {
    const googleButtonRef = useRef(null);
    const [videogames, setVideogames] = useState([]);

    useEffect(() => {
        async function gamesData() {
            try {
                const response = await axios.get(API_URL);
                setVideogames(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        // When the component is mounted the function 'allGames()' will be executed
        gamesData();
    }, []);

    const handleGooglePopup = async () => {
        if (googleButtonRef) {
            const provider = new GoogleAuthProvider();

            try {
                const userCredentials = await signInWithPopup(auth, provider);
                // Hide modal
                const signInModal = document.querySelector("#signinModal");
                const modal = bootstrap.Modal.getInstance(signInModal);
                modal.hide();
                // Message signup successfully
                showMessage("Welcome " + userCredentials.user.displayName);
                // Add collections
                loginCheck(userCredentials.user, videogames);
            } catch (error) {
                console.log(error.code);
                if (error.code === "auth/cancelled-popup-request") {
                    showMessage("Popup was canceled", "error");
                } else if (error.code === "auth/popup-closed-by-user") {
                    showMessage("Popup closed by user", "error");
                } else if (error.code) {
                    showMessage("Something went wrong", "error");
                }
            }
        }
    }

    return (
        <button ref={googleButtonRef} onClick={handleGooglePopup} type="submit" id="registerBtn" className="btn w-100">
            <img id="google-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png" alt="google-logo" />
            <span>Sign in with Google</span>
        </button>
    )
}