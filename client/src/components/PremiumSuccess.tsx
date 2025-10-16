import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type SubscriptionStatus = "loading" | "success" | "error";

const PremiumSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<SubscriptionStatus>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const checkSubscription = async () => {
      if (!sessionId) {
        setStatus("error");
        setMessage("Brak session_id w URL.");
        return;
      }

      try {
        const res = await fetch(`/check-subscription/${sessionId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Nieznany błąd.");
        }

        if (data.success) {
          setStatus("success");
          setMessage("Subskrypcja zakończona sukcesem! Masz dostęp premium.");
        } else {
          setStatus("error");
          setMessage("Subskrypcja nie została aktywowana.");
        }
      } catch (error: any) {
        console.error("Błąd:", error.message);
        setStatus("error");
        setMessage("Wystąpił błąd podczas sprawdzania subskrypcji.");
      }
    };

    checkSubscription();
  }, [sessionId]);

  return (
    <div className="max-w-xl mx-auto text-center p-8">
      {status === "loading" && <p>Sprawdzanie statusu subskrypcji...</p>}
      {status === "success" && (
        <p className="text-green-600 text-xl">{message}</p>
      )}
      {status === "error" && <p className="text-red-600 text-xl">{message}</p>}
    </div>
  );
};

export default PremiumSuccess;
