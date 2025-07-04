import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const Payment = () => {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/config`).then(
      async (response) => {
        const { publishableKey } = await response.json();
        setStripePromise(loadStripe(publishableKey));
      }
    );
  }, []);

  useEffect(() => {
    const googleId = user?.google_id;

    if (!googleId) return;

    fetch(`${import.meta.env.VITE_SERVER_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ googleId }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Błąd płatności:", errorData);
          return;
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      })
      .catch((err) => {
        console.error("Błąd fetcha:", err);
      });
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {stripePromise && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#1A73E8",
                borderRadius: "6px",
              },
            },
          }}
        >
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
