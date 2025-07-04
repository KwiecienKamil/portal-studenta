import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Completion = () => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const googleId = localStorage.getItem("googleId");

    if (!googleId) {
      console.warn("Brak googleId w localStorage – użytkownik niezalogowany?");
      return;
    }

    console.log("Fetching user premium status...");

    fetch(`${import.meta.env.VITE_SERVER_URL}/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-google-id": googleId,
      },
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status}`);
        }
        return res.json();
      })
      .then((user) => {
        console.log("User data received:", user);
        if (user?.is_premium) {
          setIsPremium(true);
          console.log("✅ User is premium");
        } else {
          console.log("User is not premium");
        }
      })
      .catch((err) => {
        console.error("❌ Błąd podczas sprawdzania premium:", err);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">
        {isPremium
          ? "✅ PAYMENT COMPLETED – You are now PREMIUM!"
          : "⏳ Payment completed. Waiting for confirmation..."}
      </h1>
      <Link to="/" className="text-blue-600 hover:underline">
        Back to homepage
      </Link>
    </div>
  );
};

export default Completion;
