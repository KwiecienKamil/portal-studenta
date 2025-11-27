import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { setUser } from "../features/auth/authSlice";

const Completion = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.google_id) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_SERVER_URL}/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-google-id": user.google_id,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error(`Network response was not ok: ${res.status}`);
        return res.json();
      })
      .then((userData) => {
        const isUserPremium = !!userData?.is_premium;
        setIsPremium(isUserPremium);

        if (userData && userData.google_id) {
          dispatch(setUser(userData));
          localStorage.setItem("currentUser", JSON.stringify(userData));
        }
        window.location.reload();
      })
      .catch((err) => {
        console.error("Błąd podczas sprawdzania premium:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-4">Ładowanie statusu płatności</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full text-center">
        <h1
          className={`text-3xl font-bold mb-6 ${
            isPremium ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {isPremium
            ? "Płatność zakończona – jesteś teraz PREMIUM!"
            : "Płatność zakończona. Oczekiwanie na potwierdzenie"}
        </h1>
        <Link
          to="/"
          className="inline-block mt-4 text-blue-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          Powrót na stronę główną
        </Link>
      </div>
    </div>
  );
};

export default Completion;
