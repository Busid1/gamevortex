const express = require('express');
const stripe = require('stripe')('sk_test_51PJC6AJeIz2JibtCoa9wZvfU78VI3qixZqFTHzJ99T01bDulInHGOVLHkFvM149xeWypzS0r4mVbEwegu1kJCCEN00F8yZTss0');
const app = express();
const cors = require("cors")
app.use(express.json());
app.use(cors())


app.post("/api/checkout", async (req, res) => {
  try {
    const { id, amount } = req.body;

    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "videogame/s",
      payment_method: id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    })

    console.log(payment);
    res.send({ message: "Pago realizado correctamente" });
  } catch (error) {

    console.log(error);
    res.json({ message: error });
  }
})


// Puerto del servidor
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

