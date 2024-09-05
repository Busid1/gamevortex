import { signOut } from "firebase/auth";
import { auth } from "./firebase.js";

export default function Logout() {
    
    const handleLogout = async () => {
        await signOut(auth);
        window.location.reload();
        console.log("logout");
    }

    return (
        <li onClick={handleLogout}><a href="#" className="dropdown-item">Logout</a></li>
    )
}
