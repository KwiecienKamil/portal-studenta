import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";

const GoogleLoginBtn = () => {
  const [user, setUser] = useState<JwtPayload | null>(null);

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <div className="">
      {!user ? (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              const decoded = jwtDecode(credentialResponse.credential);
              setUser(decoded);
              localStorage.setItem("user", JSON.stringify(decoded));
              console.log("✅ Zalogowano:", decoded);
            } else {
              console.error("❌ Brak tokena z Google");
            }
          }}
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
