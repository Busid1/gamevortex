import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../components/Login/app/firebase';
const VideogamesContext = createContext();

export const useVideogames = () => {
    return useContext(VideogamesContext);
};

export const VideogamesProvider = ({ children }) => {
    const [videogames, setVideogames] = useState([]);
    
    useEffect(() => {
        async function gamesData() {
            try {
                const gamesCollection = collection(db, "games");
                const gamesSnapshot = await getDocs(gamesCollection);
                const gamesList = gamesSnapshot.docs.map(doc => doc.data());
                setVideogames(gamesList);
            } catch (error) {
                console.error(error);
            }
        }
        gamesData();
    }, []);
    
    return (
        <VideogamesContext.Provider value={videogames}>
            {children}
        </VideogamesContext.Provider>
    );
};
