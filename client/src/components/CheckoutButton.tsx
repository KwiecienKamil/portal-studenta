// CheckoutButton.jsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_yourPublicKey'); // Replace with your public key

const CheckoutButton = ({ cartItems }) => {
  const handleClick = async () => {
    const response = await fetch('http://localhost:4242/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await response.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: data.url.split('/').pop() }); // or use data.sessionId if you return it directly
  };

  return <button onClick={handleClick}>Checkout</button>;
};

export default CheckoutButton;
