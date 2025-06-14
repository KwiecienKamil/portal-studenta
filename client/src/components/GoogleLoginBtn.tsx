import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useState } from "react";
import type { GoogleJwtPayload } from "../types/GoogleJwtPayloadProps";

const GoogleLoginBtn = () => {
  const [user, setUser] = useState<GoogleJwtPayload | null>(null);

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("user");
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
      console.log("✅ Zalogowano:", decoded);
    } else {
      console.error("❌ Brak tokena z Google");
    }
  };

  return (
    <div className="">
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
