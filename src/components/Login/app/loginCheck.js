import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import showMessage from "./showMessage";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export const loginCheck = async user => {
    if (user) {
        try {
            const docRef = doc(db, "usersData", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Welcome");
            } else {
                await setDoc(doc(db, "users", user.uid), {
                    ...user.providerData[0]
                });
                await setDoc(doc(db, "usersData", user.uid), {
                    cart: [],
                    cartCount: 0,
                    whislist: [],
                });
            }
            console.log(user);
        } catch (error) {
            await signOut(auth);
            console.error("Error getting documents: ", error);
            showMessage("Something went wrong", "error");
        }
    }
}
