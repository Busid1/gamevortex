const stripe = require('stripe')('sk_test_51PJC6AJeIz2JibtCoa9wZvfU78VI3qixZqFTHzJ99T01bDulInHGOVLHkFvM149xeWypzS0r4mVbEwegu1kJCCEN00F8yZTss0');

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

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
}