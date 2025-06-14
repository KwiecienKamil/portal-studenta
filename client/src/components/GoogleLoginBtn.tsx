import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import type { GoogleJwtPayload } from "../types/GoogleJwtPayloadProps";
import { useNavigate } from "react-router-dom";

const GoogleLoginBtn = () => {
  const [user, setUser] = useState<GoogleJwtPayload | null>(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const handleGmailLogin = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GoogleJwtPayload>(
        credentialResponse.credential
      );
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/save-user`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: decoded.name,
              email: decoded.email,
              picture: decoded.picture,
              googleId: decoded.sub,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Serwer zwrócił błąd: " + res.status);
        }
      } catch (error) {
        console.error("Błąd zapisu", error);
      }
      setUser(decoded);
    } else {
      console.error("❌ Brak tokena z Google");
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: user.name,
          email: user.email,
          picture: user.picture,
        })
      );
    }
  }, [user]);
  return (
    <div>
      {!user ? (
        <GoogleLogin
          onSuccess={handleGmailLogin}
          onError={() => console.error("❌ Logowanie nie powiodło się")}
        />
      ) : (
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Wyloguj
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginBtn;
