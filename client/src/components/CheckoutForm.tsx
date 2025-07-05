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
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-5 ">
      <PaymentElement id="payment-element" />
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition duration-300 ${
          isProcessing || !stripe || !elements
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-dark hover:bg-accent hover:text-dark shadow-md cursor-pointer"
        }`}
      >
        <span id="button-text">
          {isProcessing ? "Przetwarzanie płatności..." : "Zapłać teraz"}
        </span>
      </button>

      {message && (
        <div
          id="payment-message"
          className="text-red-500 text-center text-sm font-medium"
        >
          {message}
        </div>
      )}
    </form>
  );
}
