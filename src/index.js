import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import store from './redux/store';
import { VideogamesProvider } from './contexts/VideogamesContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishListContext';
import { CommentsProvider } from './contexts/CommentsContext';
import { PurchasesProvider } from './contexts/PurchasesContext';
const stripePromise = loadStripe('pk_test_51PJC6AJeIz2JibtC32QxNpQqNVtPQ06sAJOfLd7CvEkux2WEKekyYZmCaT2gHCLGJSiXIxmWCU6iMwXeZstZAeWG00utnMfqhT');
const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <Elements stripe={stripePromise}>
    <VideogamesProvider>
      <CartProvider>
        <PurchasesProvider>
          <WishlistProvider>
            <CommentsProvider>
              <Provider store={store}>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </Provider>
            </CommentsProvider>
          </WishlistProvider>
        </PurchasesProvider>
      </CartProvider>
    </VideogamesProvider>
  </Elements>
);

