import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useState, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import GameDetails from './components/GameDetails/GameDetails';
import Cart from './components/Cart/Cart';
import Tags from './components/Tags/Tags';
import Wishlist from './components/Wishlist/Wishlist';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
export const HOME_URL = "";
export const API_URL = `https://gamevortex.glitch.me/gamevortex`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchGame, setSearchGame] = useState([]);
  const location = useLocation();

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

  const [isGameInCart, setIsGameInCart] = useState([]);

  const handleIsTrue = (id) => {
    const gameInCart = isGameInCart.find(item => item.id === id);
    return gameInCart ? gameInCart.isGameInCart : false;
  }

  const clearLocalStorageOnReload = () => {
    localStorage.clear();
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    clearLocalStorageOnReload();
  }, [location.pathname]);

  return (
    <div>
      {
        isLoading ?
          <div>
            {
              location.pathname !== `/cart` ?
                <Header searchGame={searchGame} />
                :
                (null)
            }
            <Routes>
              <Route path={HOME_URL}
                element={<Home handleIsTrue={handleIsTrue} />}>
              </Route>
              <Route path={`/:game`} element={<GameDetails handleIsTrue={handleIsTrue} />} />
              <Route path={`/wishlist`} element={<Wishlist handleIsTrue={handleIsTrue} />} />
              {
                location.pathname !== "/" ?
                  (<Route
                    path={`/games/:tag`}
                    element={<Tags
                      handleIsTrue={handleIsTrue}
                    />}
                  >
                  </Route>)
                  :
                  (null)
              }
              <Route path={`/cart`} element={<Cart inputRef={inputRef} focusInput={focusInput} />} />
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