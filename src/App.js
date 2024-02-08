import './App.css';
import Games from './components/Games/Games';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from 'react-router';
import axios from "axios";
import GameDetails from './components/GameDetails/GameDetails';
import Cart from './components/Cart/Cart';
import Tags from './components/Tags/Tags';

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

  const apiUrl = 'https://bow-rebel-apartment.glitch.me';

  useEffect(() => {
    async function gamesData() {
      try {
        const response = await axios(apiUrl);
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

  const URL_BASE = "https://bow-rebel-apartment.glitch.me";

  const onSearch = (title) => {
    axios(`${URL_BASE}/${title}`)
      .then(response => {
        setSearchGame(response.data[0]);
      })

      .catch(err => {
        console.log(err);
      })
  }


  const titleLength = (title, value) => {
    if (title.length > value) {
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
        location.pathname !== "/cart" ?
          <Header cartCount={cartCount} onSearch={onSearch} videogames={videogames} titleLength={titleLength} handleRemoveFromCart={handleRemoveFromCart} searchGame={searchGame} />
          :
          (null)
      }
      {
        location.pathname === "/" ? (<Tags />) : (null)
      }
      <Routes>
        <Route path='/' element={<Games videogames={videogames} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} titleLength={titleLength} />}></Route>
        <Route path='/:game' element={<GameDetails handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} videogames={videogames} titleLength={titleLength} />} />
        {
          location.pathname !== "/" ? (<Route path='/games/:tag' element={<Tags videogames={videogames} titleLength={titleLength} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />}></Route>) : (null)
        }
        <Route path='/cart' element={<Cart titleLength={titleLength} handleRemoveFromCart={handleRemoveFromCart} inputRef={inputRef} focusInput={focusInput} />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;