import { signOut } from "firebase/auth";
import { auth } from "./firebase.js";
import { useRef } from "react";

export default function Logout() {
    
    const handleLogout = async () => {
        await signOut(auth);
        console.log("logout");
    }

    return (
        <li onClick={handleLogout}><a href="#" className="dropdown-item">Logout</a></li>
    )
}
