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
import Favorite from './components/Favorites/Favorites';

function App() {
  const [videogames, setVideogames] = useState([]);
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
  })

  const HOME_URL = "GameVortex";
  const API_URL = `https://bow-rebel-apartment.glitch.me/${HOME_URL}`;

  useEffect(() => {
    async function gamesData() {
      try {
        const response = await axios(API_URL);
        console.log(response);

        setVideogames(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    // When the component is mounted the function 'allGames()' will be executed
    gamesData();
  }, []);

  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  }

  const handleRemoveFromCart = () => {
    if (cartCount < 1) {
      setCartCount(0);
    }
    else {
      setCartCount(cartCount - 1);
    }
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
        location.pathname !== `/${HOME_URL}/cart` ?
          <Header cartCount={cartCount} onSearch={onSearch} videogames={videogames} titleLength={titleLength} handleRemoveFromCart={handleRemoveFromCart} searchGame={searchGame} />
          :
          (null)
      }
      {
        location.pathname === HOME_URL ? (<Tags />) : (null)
      }
      <Routes>
        <Route path={`/${HOME_URL}`} element={<Games videogames={videogames} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} titleLength={titleLength} />}></Route>
        <Route path={`/${HOME_URL}/:game`} element={<GameDetails handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} videogames={videogames} titleLength={titleLength} />} />
        <Route path={`/${HOME_URL}/favorites`} element={<Favorite titleLength={titleLength} />} />
        {
          location.pathname !== `/${HOME_URL}` ? (<Route path={`/${HOME_URL}/games/tag`} element={<Tags videogames={videogames} titleLength={titleLength} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />}></Route>) : (null)
        }
        <Route path={`/${HOME_URL}/cart`} element={<Cart titleLength={titleLength} handleRemoveFromCart={handleRemoveFromCart} inputRef={inputRef} focusInput={focusInput} />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;