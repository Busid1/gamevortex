import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
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

  async function handleUpdateFirestoreField(id, title, price, image, isGameInCartValue) {
    if (user) {
      try {
        const userDocRef = doc(db, "games", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          let existingCart = userDocSnap.data().cart || [];
          // Si existingCart no es un array, inicialízalo como un array vacío
          if (!Array.isArray(existingCart)) {
            existingCart = [];
          }
          // Fusionar el nuevo objeto con el array existente
          const updatedCart = [...existingCart, { id, title, price, image, isGameInCart: isGameInCartValue }];

          const filterDuplicateGames = updatedCart.filter((elem, index, arr) => {
            // Usa `findIndex` para encontrar el índice del primer elemento con el mismo ID
            const firstIndex = arr.findIndex((el) => el.id === elem.id);
            // Devuelve `true` solo si el índice actual coincide con el primer índice encontrado
            return firstIndex === index;
          });

          // Actualizar el documento con el nuevo array de objetos
          await updateDoc(userDocRef, { cart: filterDuplicateGames, cartCount: filterDuplicateGames.length });
        } else {
          await setDoc(doc(db, "games", user.uid), {
            cart: [],
            cartCount: 0,
            whislist: [],
          });
        }
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  }

  async function handleDeleteFirestoreField(id, cartCount) {
    if (user) {
      const updatedCartCount = Math.max(0, cartCount - 1); // Asegura que el contador no sea menor que 0

      try {
        const userDocRef = doc(db, "games", user.uid);
        const userDocSnap = (await getDoc(userDocRef)).data().cart;
        const updatedCart = userDocSnap.filter(game => game.id !== id);
        await updateDoc(userDocRef, { cart: updatedCart, cartCount: updatedCartCount });
      } catch (e) {
        console.error("Error deleting field: ", e);
      }
    }

  }


  return { user, handleUpdateFirestoreField, handleDeleteFirestoreField };
}