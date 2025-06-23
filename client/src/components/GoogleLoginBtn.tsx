import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { useEffect } from "react";
import type { GoogleJwtPayload } from "../types/GoogleJwtPayloadProps";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../features/auth/authSlice";
import { type RootState } from "../store";
import { BiLogOut } from "react-icons/bi";
import { FaGoogle } from "react-icons/fa";

const GoogleLoginBtn = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    googleLogout();
    dispatch(clearUser());
    localStorage.removeItem("currentUser");
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const decoded = (await res.json()) as GoogleJwtPayload;

        const userPayload = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          google_id: decoded.sub,
        };

        await fetch(`${import.meta.env.VITE_SERVER_URL}/save-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            googleId: decoded.sub,
          }),
        });

        dispatch(setUser(userPayload));
        localStorage.setItem("currentUser", JSON.stringify(userPayload));
      } catch (error) {
        console.error("Błąd logowania:", error);
      }
    },
    onError: () => console.error("Logowanie nie powiodło się"),
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  }, [user]);

  return (
    <div>
      {!user ? (
        <button
          onClick={() => login()}
          className="flex items-center justify-center gap-3 w-full bg-white text-black font-medium py-2 px-4 rounded-full shadow-md hover:shadow-lg hover:bg-gray-300 transition-all duration-300 cursor-pointer"
        >
          <FaGoogle className="text-red-500 text-xl" />
          Zaloguj się przez Google
        </button>
      ) : (
        <div className="flex flex-col gap-8 p-2">
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              alt="Zdjęcie użytkownika"
              className="max-w-[50px] rounded-full"
            />
            <div>
              <h2 className="text-2xl">Siema, {user.name}!</h2>
              <p className="text-gray-300">Bez spiny, są następne terminy😊</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 text-xl font-semibold hover:text-red-700 transition-colors duration-300 cursor-pointer"
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
