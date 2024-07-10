import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { VideogamesProvider } from './contexts/VideogamesContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishListContext';
import { CommentsProvider } from './contexts/CommentsContext';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <VideogamesProvider>
    <CartProvider>
      <WishlistProvider>
        <CommentsProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
        </CommentsProvider>
      </WishlistProvider>
    </CartProvider>
  </VideogamesProvider>
);

