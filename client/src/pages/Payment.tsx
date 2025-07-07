import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import logo from "../assets/logo_OT.png";
import { Link } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
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
    <Wrapper>
      <Sidebar />
      <div className="p-4 flex-1 bg-smokewhite text-dark rounded-xl max-h-full overflow-y-scroll">
        <div className="max-w-lg w-full bg-dark  rounded-2xl shadow-lg p-8 space-y-6 mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <img src={logo} alt="logo Ogarnijto" className="max-w-[200px]" />
            <h1 className="text-2xl font-bold text-white">
              Opłać dostęp Premium
            </h1>
            <p className="text-sm text-gray-200 mt-1">
              Twoje dane są bezpieczne i szyfrowane.
            </p>
          </div>

          {stripePromise && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "flat",
                  variables: {
                    colorPrimary: "#fff",
                    borderRadius: "6px",
                  },
                },
              }}
            >
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Payment;
