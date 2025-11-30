import { useEffect, useState } from "react";
import TermsModal from "../TermsModal";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";

interface user {
  name: string;
  email: string;
  picture: string;
  google_id: string;
  terms_accepted: boolean;
  is_premium?: boolean;
  isBetaTester?: boolean;
  isProfilePublic?: boolean;
}

interface TermsAcceptProps {
  user: user | null;
  authToken: string;
}

const TermsAccept: React.FC<TermsAcceptProps> = ({ user, authToken }) => {
  const [showTerms, setShowTerms] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setShowTerms(!user.terms_accepted);
    }
  }, [user]);

  const acceptTerms = async () => {
    if (!user) return;

    const googleUserHeader = JSON.stringify({
      sub: user.google_id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accept-terms`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "X-Google-User": googleUserHeader,
          },
          body: JSON.stringify({ google_id: user.google_id }),
        }
      );

      if (!res.ok) throw new Error("Błąd akceptacji regulaminu");

      const userRes = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/${user.google_id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "X-Google-User": googleUserHeader,
          },
        }
      );
      if (!userRes.ok) throw new Error("Nie udało się pobrać użytkownika");
      const updatedUser: user = await userRes.json();
      dispatch(setUser(updatedUser));
      setShowTerms(false);
    } catch (error) {
      console.error("Nie udało się zaakceptować regulaminu:", error);
    }
  };

  if (!user || !showTerms) return null;

  return <TermsModal onAccept={acceptTerms} />;
};

export default TermsAccept;
