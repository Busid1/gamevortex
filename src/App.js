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
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import useFirestore from './components/Login/app/firestore';
import Home from './components/Home/Home';
import { useVideogames } from './contexts/VideogamesContext';
export const HOME_URL = "";
export const API_URL = `https://gamevortex.glitch.me/gamevortex`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
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
    return gameInCart ? gameInCart.isGameInCart : false;
  }

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
        isLoading ?
          <div>
            {
              location.pathname !== `/cart` ?
                <Header cartCount={cartCount} onSearch={onSearch} titleLength={titleLength} handleRemoveFromCart={handleRemoveFromCart} handleAddToCart={handleAddToCart} searchGame={searchGame} />
                :
                (null)
            }
            <Routes>
              <Route path={HOME_URL}
                element={<Home cartCount={cartCount} handleIsTrue={handleIsTrue} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />}>
              </Route>
              <Route path={`/:game`} element={<GameDetails handleIsTrue={handleIsTrue} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />} />
              <Route path={`/wishlist`} element={<Wishlist handleIsTrue={handleIsTrue} />} />
              {
                location.pathname !== "/" ?
                  (<Route
                    path={`/games/:tag`}
                    element={<Tags
                      handleIsTrue={handleIsTrue}
                      handleAddToCart={handleAddToCart}
                      handleRemoveFromCart={handleRemoveFromCart}
                    />}
                  >
                  </Route>)
                  :
                  (null)
              }
              <Route path={`/cart`} element={<Cart handleRemoveFromCart={handleRemoveFromCart} inputRef={inputRef} focusInput={focusInput} />} />
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