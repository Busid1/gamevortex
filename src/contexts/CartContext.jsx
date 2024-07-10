import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../components/Login/app/firebase';
import useFirestore from '../components/Login/app/firestore';

export const CartContext = createContext({
    cartVideogames: [],
    handleAddGameToCartContext: () => { },
    handleRemoveGameFromCartContext: () => { },
    getTotalCoast: () => { },
    deleteAllCart: () => { },
});

export const useCart = () => {
    return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
    const { user } = useFirestore();
    const [cartVideogames, setCartVideogames] = useState([]);

    useEffect(() => {
        async function cartGamesData() {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const gamesInCart = userData.cart || [];
                    setCartVideogames(gamesInCart);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching cart data: ", error);
            }
        }

        if (user?.uid) {
            cartGamesData();
        }
    }, [user]);

    function handleAddGameToCartContext({ id, title, price, image }) {
        setCartVideogames(prevCartGames => {
            const filteredGames = prevCartGames.filter(game => game.id !== id);

            return [
                ...filteredGames,
                {
                    id: id,
                    title: title,
                    price: price,
                    image: image
                }
            ];
        });
    }

    function handleRemoveGameFromCartContext(id) {
        setCartVideogames(cartGames => cartGames.filter(currentGame => currentGame.id !== id));
    }

    const contextValue = {
        cartVideogames: cartVideogames,
        handleAddGameToCartContext,
        handleRemoveGameFromCartContext,
    }

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
