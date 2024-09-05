import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../components/Login/app/firebase';
import useFirestore from '../components/Login/app/firestore';

export const CommentsContext = createContext({
    commentsVideogames: [],
    photoURLComment: [],
    handleAddGameToCommentsContext: () => { },
    handleRemoveGameFromCommentsContext: () => { },
    getTotalCoast: () => { },
    deleteAllComments: () => { },
});

export const useComments = () => {
    return useContext(CommentsContext);
}

export const CommentsProvider = ({ children }) => {
    const { user } = useFirestore();
    const [commentsInVideogames, setCommentsInVideogames] = useState([]);
    const [photoURLComment, setPhotoURLComment] = useState([]);

    useEffect(() => {
        async function commentsGamesData() {
            try {
                const userDocRef = collection(db, "comments");
                const userDoc = await getDocs(userDocRef);
                const comments = userDoc.docs.map(doc => doc.data())
                if(comments[0] !== undefined){
                    setCommentsInVideogames(comments);
                }
            } catch (error) {
                console.error("Error fetching comments data: ", error);
            }
        }
        commentsGamesData();
    }, []);

    function handleAddGameToCommentsContext({ id, title, price, image }) {
        setCommentsInVideogames(prevCommentsGames => {
            const filteredGames = prevCommentsGames.filter(game => game.id !== id);

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

    function handleRemoveGameFromCommentsContext(id) {
        setCommentsInVideogames(commentsGames => commentsGames.filter(currentGame => currentGame.id !== id));
    }

    const contextValue = {
        commentsInVideogames,
        photoURLComment,
        handleAddGameToCommentsContext,
        handleRemoveGameFromCommentsContext,
    }

    return (
        <CommentsContext.Provider value={contextValue}>
            {children}
        </CommentsContext.Provider>
    );
};
