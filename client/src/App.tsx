import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl mb-6">Google Login Demo</h1>

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
          <p className="mb-4">👋 Cześć, {user.name}</p>
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
}

export default App;
