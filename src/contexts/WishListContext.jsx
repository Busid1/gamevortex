import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../components/Login/app/firebase';
import useFirestore from '../components/Login/app/firestore';

export const WishlistContext = createContext({
    wishlistVideogames: [],
    handleAddGameToWishlistContext: () => { },
    handleRemoveGameFromWishlistContext: () => { },
    getTotalCoast: () => { },
    deleteAllWishlist: () => { },
});

export const useWishlist = () => {
    return useContext(WishlistContext);
}

export const WishlistProvider = ({ children }) => {
    const { user } = useFirestore();
    const [wishlistVideogames, setWishlistVideogames] = useState([]);

    useEffect(() => {
        async function wishlistGamesData() {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const gamesInWishlist = userData.wishlist || [];
                    setWishlistVideogames(gamesInWishlist);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching wishlist data: ", error);
            }
        }

        if (user?.uid) {
            wishlistGamesData();
        }
    }, [user]);

    function handleAddGameToWishlistContext({ id, title, price, image, description, prevGameplay }) {
        setWishlistVideogames(prevWishlistGames => {
            const filteredGames = prevWishlistGames.filter(game => game.id !== id);

            return [
                ...filteredGames,
                {
                    id: id,
                    title: title,
                    price: price,
                    image: image,
                    description: description,
                    prevGameplay: prevGameplay,
                }
            ];
        });
    }

    function handleRemoveGameFromWishlistContext(id) {
        setWishlistVideogames(wishlistGames => wishlistGames.filter(currentGame => currentGame.id !== id));
    }

    const contextValue = {
        wishlistVideogames: wishlistVideogames,
        handleAddGameToWishlistContext,
        handleRemoveGameFromWishlistContext,
    }

    return (
        <WishlistContext.Provider value={contextValue}>
            {children}
        </WishlistContext.Provider>
    );
};
