import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import type { GoogleJwtPayload } from "../types/GoogleJwtPayloadProps";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../features/auth/authSlice";
import { type RootState } from "../store";
import { BiLogOut } from "react-icons/bi";

const GoogleLoginBtn = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    googleLogout();
    dispatch(clearUser());
    localStorage.removeItem("currentUser");
  };

  const handleGmailLogin = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GoogleJwtPayload>(
        credentialResponse.credential
      );

      const userPayload = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        google_id: decoded.sub,
      };

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
        console.error("Błąd zapisu użytkownika:", error);
      }

      dispatch(setUser(userPayload));
    } else {
      console.error("❌ Brak tokena z Google");
    }
  };

  // Synchronizacja Reduxa z localStorage przy odświeżeniu
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  // Zapis do localStorage kiedy user się zmieni
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  }, [user]);

  return (
    <div>
      {!user ? (
        <GoogleLogin
          onSuccess={handleGmailLogin}
          onError={() => console.error("Logowanie nie powiodło się")}
          theme="filled_black"
          size="large"
          text="signin_with"
          width="100%"
          shape="pill"
          containerProps={{
            style: {
              margin: "20px auto",
              display: "flex",
              justifyContent: "center",
            },
          }}
        />
      ) : (
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-2xl">Siema, {user.name}!</h2>
            <p className="text-gray-300">Bez spiny są drugie terminy</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-8 text-xl font-semibold hover:text-red-500 transition-colors duration-300 cursor-pointer"
          >
            <BiLogOut />
            Wyloguj
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginBtn;
