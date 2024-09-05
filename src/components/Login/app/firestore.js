import { doc, getDoc, updateDoc, increment, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";

export default function useFirestore() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  async function handleAddGameToUserCart({ id, title, price, image }) {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          let existingCart = userDocSnap.data().cart || [];
          // Si existingCart no es un array, inicialízalo como un array vacío
          if (!Array.isArray(existingCart)) {
            existingCart = [];
          }
          // Fusionar el nuevo objeto con el array existente
          const updatedCart = [...existingCart, { id, title, price, image }];
          const filterDuplicateGames = updatedCart.filter((elem, index, arr) => {
            // Usa `findIndex` para encontrar el índice del primer elemento con el mismo ID
            const firstIndex = arr.findIndex((el) => el.id === elem.id);
            // Devuelve `true` solo si el índice actual coincide con el primer índice encontrado
            return firstIndex === index;
          });

          // Actualizar el documento con el nuevo array de objetos
          await updateDoc(userDocRef, { cart: filterDuplicateGames });
        } else {
          await setDoc(doc(db, "users", user.uid), {
            cart: [],
          });
        }
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  }

  async function handleRemoveGameFromUserCart(id) {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = (await getDoc(userDocRef)).data().cart;
        const updatedCart = userDocSnap.filter(game => game.id !== id);
        await updateDoc(userDocRef, { cart: updatedCart });
      } catch (e) {
        console.error("Error deleting field: ", e);
      }
    }
  }

  async function handleDeleteAllGamesFromUserCart() {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { cart: [] });
      } catch (e) {
        console.error("Error deleting all cart: ", e);
      }
    }
  }

  async function handleAddGameToUserWishlist({ id, title, price, image, description, prevGameplay }) {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          let existingWishlist = userDocSnap.data().wishlist || [];
          // Si existingCart no es un array, inicialízalo como un array vacío
          if (!Array.isArray(existingWishlist)) {
            existingWishlist = [];
          }
          // Fusionar el nuevo objeto con el array existente
          const updatedWishlist = [...existingWishlist, { id, title, price, image, description, prevGameplay }];
          const filterDuplicateGames = updatedWishlist.filter((elem, index, arr) => {
            // Usa `findIndex` para encontrar el índice del primer elemento con el mismo ID
            const firstIndex = arr.findIndex((el) => el.id === elem.id);
            // Devuelve `true` solo si el índice actual coincide con el primer índice encontrado
            return firstIndex === index;
          });

          // Actualizar el documento con el nuevo array de objetos
          await updateDoc(userDocRef, { wishlist: filterDuplicateGames });
        } else {
          await setDoc(doc(db, "users", user.uid), {
            wishlist: [],
          });
        }
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  }

  async function handleRemoveGameFromUserWishlist(id) {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = (await getDoc(userDocRef)).data().wishlist;
        const updatedWishlist = userDocSnap.filter(game => game.id !== id);
        await updateDoc(userDocRef, { wishlist: updatedWishlist });
      } catch (e) {
        console.error("Error deleting field: ", e);
      }
    }
  }

  async function handleAddCommentToUserGame(id, gameComment) {
    if (user) {
      try {
        const userDocRef = doc(db, "comments", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let updatedComments;

        if (userDocSnap.exists()) {
          let existingData = userDocSnap.data();
          let existingComments = existingData.gameComments || [];

          // Si existingComments no es un array, inicialízalo como un array vacío
          if (!Array.isArray(existingComments)) {
            existingComments = [];
          }

          // Encontrar el índice del comentario existente por id
          const existingIndex = existingComments.findIndex((comment) => comment.id === id);

          if (existingIndex !== -1) {
            // Si el comentario ya existe, añade el nuevo comentario al array de gameComment
            existingComments[existingIndex].gameComment.push(gameComment);
          } else {
            // Si el comentario no existe, añade un nuevo objeto de comentario
            existingComments.push({
              id: id,
              gameComment: [gameComment]
            });
          }

          updatedComments = existingComments;
        } else {
          // Si el documento no existe, crea un nuevo array de comentarios
          updatedComments = [{
            id: id,
            gameComment: [gameComment]
          }];
        }

        await setDoc(userDocRef, {
          userCommentPhoto: user.photoURL,
          gameComments: updatedComments,
          uid: user.uid,
        }, { merge: true }); // Merge para mantener otros campos del documento

      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  }

  async function handleRemoveCommentFromUserGame(id, commentIndex) {
    if (user) {
      try {
        const userDocRef = doc(db, "comments", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          let existingData = userDocSnap.data();
          let existingComments = existingData.gameComments || [];

          // Encontrar el videojuego por id
          const gameIndex = existingComments.findIndex(game => game.id === id);

          if (gameIndex !== -1) {
            // Eliminar el comentario en el índice especificado
            existingComments[gameIndex].gameComment.splice(commentIndex, 1);

            // Guardar los datos actualizados
            await updateDoc(userDocRef, {
              gameComments: existingComments,
            }, { merge: true });
          }
        } else {
          console.error("No se encontró el documento.");
        }
      } catch (e) {
        console.error("Error deleting comment: ", e);
      }
    }
  }

  async function handleEditCommentFromUserGame(id, commentIndex, editedComment) {
    if (user) {
      try {
        const userDocRef = doc(db, "comments", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          let existingData = userDocSnap.data();
          let existingComments = existingData.gameComments || [];

          // Encontrar el videojuego por id
          const gameIndex = existingComments.findIndex(game => game.id === id);

          if (gameIndex !== -1) {
            // Eliminar el comentario en el índice especificado
            existingComments[gameIndex].gameComment.splice(commentIndex, 1, editedComment);

            // Guardar los datos actualizados
            await updateDoc(userDocRef, {
              gameComments: existingComments,
            }, { merge: true });
          }
        } else {
          console.error("No se encontró el documento.");
        }
      } catch (e) {
        console.error("Error editing comment: ", e);
      }
    }
  }

  async function handleAddGameToUserPurchases(cartVideogames) {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          let existingPurchases = userDocSnap.data().purchases || [];

          // Asegurarse de que existingPurchases es un array
          if (!Array.isArray(existingPurchases)) {
            existingPurchases = [];
          }

          // Añadir cada videojuego del carrito individualmente
          cartVideogames.forEach((game) => {
            // Verificar si el juego ya está en las compras
            const isGameAlreadyPurchased = existingPurchases.some((purchasedGame) => purchasedGame.id === game.id);

            // Solo añadir si no está en las compras
            if (!isGameAlreadyPurchased) {
              existingPurchases.push(game);
            }
          });

          // Actualizar el documento con el array aplanado de objetos
          await updateDoc(userDocRef, { purchases: existingPurchases });
        } else {
          await setDoc(doc(db, "users", user.uid), {
            purchases: cartVideogames, // Si es la primera vez, simplemente añade los juegos
          });
        }
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  }

  return {
    user,
    handleAddGameToUserCart,
    handleRemoveGameFromUserCart,
    handleDeleteAllGamesFromUserCart,
    handleAddGameToUserWishlist,
    handleRemoveGameFromUserWishlist,
    handleAddCommentToUserGame,
    handleRemoveCommentFromUserGame,
    handleEditCommentFromUserGame,
    handleAddGameToUserPurchases,
  };
}
