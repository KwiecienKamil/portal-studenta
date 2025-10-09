import { useState } from "react";

const StripeCheckoutButton = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ id: "basic-plan" }], 
        }),
      });

      const session = await response.json();
      window.location.href = session.url;
    } catch (error) {
      console.error("Stripe checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {loading ? "Redirecting..." : "Pay with Stripe"}
    </button>
  );
};

export default StripeCheckoutButton;
