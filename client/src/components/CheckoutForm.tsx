import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occured.");
    }
    setIsProcessing(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-4 bg-white shadow-md rounded-lg"
    >
      <PaymentElement id="payment-element" />

      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
          isProcessing || !stripe || !elements
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <span id="button-text">
          {isProcessing ? "Processing ..." : "Pay now"}
        </span>
      </button>

      {message && (
        <div id="payment-message" className="text-red-500 text-sm">
          {message}
        </div>
      )}
    </form>
  );
}
