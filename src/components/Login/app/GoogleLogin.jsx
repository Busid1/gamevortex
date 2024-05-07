import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase.js";
import showMessage from "./showMessage.js";
import { useRef } from "react";
import { loginCheck } from "./loginCheck.js";

export default function GoogleLogin() {
    const googleButtonRef = useRef(null);

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
                loginCheck(userCredentials.user);
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
        <button ref={googleButtonRef} onClick={handleGooglePopup} type="submit" id="googleLogin"
            className="btn btn-info">Google
        </button>
    )
}