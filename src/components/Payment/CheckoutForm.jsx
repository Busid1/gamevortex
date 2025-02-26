import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import useFirestore from '../Login/app/firestore';
import { useCart } from '../../contexts/CartContext';
import Swal from 'sweetalert2';
import randomstring from "randomstring";

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleDeleteAllGamesFromUserCart, handleAddGameToUserPurchases } = useFirestore();
  const { handleDeleteAllGamesFromCartContext, cartVideogames } = useCart();

  const clearAfterBuyGame = () => {
    handleDeleteAllGamesFromUserCart();
    handleDeleteAllGamesFromCartContext();
    const modal = bootstrap.Modal.getInstance(document.getElementById('creditCardModal'));
    modal.hide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      setIsLoading(false);
    }
    else {
      const cartVideogamesWithCodes = cartVideogames.map(game => ({
        ...game,
        activationCode: randomstring.generate({ length: 10, charset: 'alphanumeric' })
      }));
      handleAddGameToUserPurchases(cartVideogamesWithCodes)
      setIsLoading(true);
    }

    if (!error) {
      const { id } = paymentMethod;

      try {
        const response = await axios.post(`https://ndmy1qx0yl.execute-api.eu-west-3.amazonaws.com/checkout`, {
          id,
          amount: total.toFixed(2) * 100,
        })
        if (response.status === 200) {
          setTimeout(() => {
            clearAfterBuyGame();
          }, 2000)
          setTimeout(() => {
            Swal.fire({
              title: "Successful payment",
              text: "Thanks for the purchase!!",
              icon: "success",
              showDenyButton: true,
              confirmButtonText: "See the game codes",
              denyButtonText: "Close"
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/purchases"
              }
              else if (result.isDenied || result.isDismissed) {
                window.location.href = "/"
              }
            })
          }, 3200);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#ffc107',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
        iconColor: '#fff'
      },
      invalid: {
        color: '#dc3545',
        iconColor: '#dc3545',
      },
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-100 d-flex gap-4 flex-column' action="#">
      <CardElement options={CARD_ELEMENT_OPTIONS} className='p-3 text-white bg-dark rounded' />
      {errorMessage && <div>{errorMessage}</div>}
      <button type="submit" className="btn btn-success" disabled={!stripe}>
        {
          isLoading ?
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            :
            "Pay game/s"
        }
      </button>
    </form>
  );
};

export default CheckoutForm;
