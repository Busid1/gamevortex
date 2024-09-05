import { doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import showMessage from "./showMessage";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export const loginCheck = async (user) => {
    if (user) {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                console.log("Welcome");
            } else {
                await setDoc(doc(db, "users", user.uid), {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    wishlist: [],
                    cart: [],
                });
            }
        } catch (error) {
            await signOut(auth);
            console.error("Error getting documents: ", error);
            showMessage("Something went wrong", "error");
        }
    }
}

