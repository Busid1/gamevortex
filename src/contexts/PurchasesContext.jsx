import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../components/Login/app/firebase';
import useFirestore from '../components/Login/app/firestore';

export const PurchasesContext = createContext({
    purchases: [],
});

export const usePurchases = () => {
    return useContext(PurchasesContext);
};

export const PurchasesProvider = ({ children }) => {
    const { user } = useFirestore();
    const [purchases, setPurchases] = useState([]);
    
    useEffect(() => {
        async function purchasesGamesData() {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const gamesInPurchases = userData.purchases || [];                    
                    setPurchases(gamesInPurchases);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching purchases data: ", error);
            }
        }

        if (user?.uid) {
            purchasesGamesData();
        }
    }, [user]);

    const contextValue = {
        purchases: purchases
    }
    
    return (
        <PurchasesContext.Provider value={contextValue}>
            {children}
        </PurchasesContext.Provider>
    );
};
