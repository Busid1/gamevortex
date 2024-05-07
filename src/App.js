import './App.css';
import Games from './components/Games/Games';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useState, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import axios from "axios";
import GameDetails from './components/GameDetails/GameDetails';
import Cart from './components/Cart/Cart';
import Tags from './components/Tags/Tags';
import Wishlist from './components/Wishlist/Wishlist';
import Login from './components/Login/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './components/Login/app/firebase';
import { doc, getDoc } from 'firebase/firestore';
import useFirestore from './components/Login/app/firestore';

export const HOME_URL = "/gamevortex";
export const API_URL = `https://gamevortex.glitch.me${HOME_URL}`;

function App() {
  const [videogames, setVideogames] = useState([]);
  const [searchGame, setSearchGame] = useState([]);
  const location = useLocation();
  const { user, handleUpdateFirestoreField, handleDeleteFirestoreField } = useFirestore();

  // Crea una referencia
  const inputRef = useRef(null);
  // Función para enfocar el input
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  useEffect(() => {
    async function gamesData() {
      try {
        const response = await axios.get(API_URL);
        setVideogames(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    // When the component is mounted the function 'allGames()' will be executed
    gamesData();
  }, []);

  const [cartCount, setCartCount] = useState(0);
  const [isGameInCart, setIsGameInCart] = useState([]);

  const handleAddToCart = (id, title, price, image, isGameInCartValue) => {
    setCartCount(prevCount => prevCount + 1);
    handleUpdateFirestoreField(id, title, price, image, isGameInCartValue);
  }

  const handleRemoveFromCart = (id) => {
    setCartCount(prevCount => Math.max(prevCount - 1, 0));
    handleDeleteFirestoreField(id, cartCount);
  }

  const handleIsTrue = (id) => {
    const gameInCart = isGameInCart.find(item => item.id === id);
    console.log(gameInCart);
    return gameInCart ? gameInCart.isGameInCart : false;
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "usersData", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const cartCountFS = docSnap.data().cartCount;
            const isGameInCart = docSnap.data().cart;
            setIsGameInCart(isGameInCart);

            if (cartCountFS < 0) {
              setCartCount(0);
            }
            else {
              setCartCount(cartCountFS);
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting documents: ", error);
        }
      }
    })

    return () => unsubscribe();
  }, [cartCount]);

  const onSearch = (title) => {
    axios(`${API_URL}/${title}`)
      .then(response => {
        setSearchGame(response.data[0]);
      })

      .catch(err => {
        console.log(err);
      })
  }

  const titleLength = (title, value) => {
    if (typeof title === 'string' && title.length > value) {
      let ellipsisTitle = title.slice(0, value) + "...";
      return ellipsisTitle;
    }
    else {
      return title;
    }
  }


  return (
    <div>
      {
        videogames.length === 23 ?
          <div>
            {
              location.pathname !== `${HOME_URL}/cart` ?
                <Header cartCount={cartCount} onSearch={onSearch} videogames={videogames} titleLength={titleLength} handleRemoveFromCart={handleRemoveFromCart} handleAddToCart={handleAddToCart} searchGame={searchGame} />
                :
                (null)
            }
            <Routes>
              <Route path={HOME_URL}
                element={<Games cartCount={cartCount} handleIsTrue={handleIsTrue} videogames={videogames} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />}></Route>
              <Route path={`${HOME_URL}/:game`} element={<GameDetails handleIsTrue={handleIsTrue} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} videogames={videogames} />} />
              <Route path={`${HOME_URL}/wishlist`} element={<Wishlist handleIsTrue={handleIsTrue} />} />
              {
                location.pathname !== `${HOME_URL}` ?
                  (<Route
                    path={`${HOME_URL}/games/:tag`}
                    element={<Tags videogames={videogames}
                      handleIsTrue={handleIsTrue}
                      handleAddToCart={handleAddToCart}
                      handleRemoveFromCart={handleRemoveFromCart}
                    />}
                  >
                  </Route>)
                  :
                  (null)
              }
              <Route path={`${HOME_URL}/cart`} element={<Cart handleRemoveFromCart={handleRemoveFromCart} inputRef={inputRef} focusInput={focusInput} />} />
            </Routes>
            <Login />
            <Footer />
          </div>
          :
          (
            <div className="spinner-container">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )
      }
    </div >
  )
}

export default App;