import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { useEffect } from "react";
import type { GoogleJwtPayload } from "../types/GoogleJwtPayloadProps";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../features/auth/authSlice";
import { type AppDispatch, type RootState } from "../store";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { MdQuiz } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { fetchExams } from "../features/exams/examSlice";

const GoogleLoginBtn = () => {
  const location = useLocation();
  const isPlatnosc = location.pathname === "/platnosc";
  const dispatch = useDispatch<AppDispatch>();
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

        const userRes = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/user/${decoded.sub}`
        );
        if (!userRes.ok) throw new Error("Błąd pobierania danych użytkownika");
        const fullUserData = await userRes.json();
        dispatch(setUser(fullUserData));
        localStorage.setItem("currentUser", JSON.stringify(fullUserData));
        dispatch(fetchExams(fullUserData.googleId));
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
    <div className={`${!user ? `flex items-center justify-center mb-8` : ``}`}>
      {!user ? (
        <button
          onClick={() => login()}
          className=" flex items-center justify-center gap-3 text-xs md:text-md lg:text-lg bg-white text-black font-medium py-4 px-4 mr-4 rounded-full shadow-md hover:shadow-lg hover:bg-dark hover:text-accent transition-all duration-300 cursor-pointer"
        >
          <FaGoogle className="text-red-500 text-sm sm:text-lg" />
          Zaloguj się przez Google
        </button>
      ) : (
        <div className="flex flex-col gap-4 mb-8 ">
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-smokewhite text-black p-2 rounded-l-lg">
            <img
              src={user.picture}
              alt="Zdjęcie użytkownika"
              className="max-w-[50px] rounded-full border-2 border-accent"
            />
            <div>
              <h2 className="text-lg lg:text-2xl text-center sm:text-left">
                Siema, <span className="font-semibold">{user.name}!</span>
              </h2>
              {user?.is_premium ? (
                <p className="text-sm lg:text-md text-center sm:text-left">
                  Konto{" "}
                  <span className="font-semibold text-orange-500">Premium</span>
                </p>
              ) : (
                <p className="text-sm lg:text-md text-center sm:text-left">
                  Konto zwykłe
                </p>
              )}
            </div>
          </div>

          {!user.is_premium && (
            <Link
              to="/platnosc"
              className={`relative overflow-hidden group flex items-center gap-3 p-2 text-xl font-semibold text-black rounded-l-xl cursor-pointer ${
                isPlatnosc ? "bg-[#Ffd700]" : ""
              }`}
            >
              <span className="absolute top-0 bottom-0 right-0 w-0 bg-[#Ffd700] transition-all duration-300 group-hover:w-full z-0 origin-right"></span>
              <MdOutlineWorkspacePremium className="mt-1 z-10 transition-transform duration-300 group-hover:animate-bounce" />
              <span className="z-10">Kup Premium</span>
            </Link>
          )}
          {user.is_premium && (
            <Link
              to="quiz"
              className="relative overflow-hidden group flex items-center gap-2 sm:gap-3 p-1 sm:p-2 lg:text-xl font-semibold text-black rounded-l-xl cursor-pointer"
            >
              <span className="absolute top-0 bottom-0 right-0 w-0 bg-smokewhite transition-all duration-300 group-hover:w-full z-0 origin-right"></span>
              <MdQuiz className="mt-1 z-10 transition-transform duration-300 group-hover:animate-bounce text-[16px]" />
              <span className="z-10 text-[11px] sm:text-md lg:text-xl">
                Generator quizów
              </span>
            </Link>
          )}
          <Link
            to="/ustawienia"
            className="relative overflow-hidden group flex items-center gap-2 sm:gap-3 p-1 sm:p-2 text-xs sm:text-md lg:text-xl font-semibold text-black rounded-l-xl cursor-pointer"
          >
            <span className="absolute top-0 bottom-0 right-0 w-0 bg-smokewhite transition-all duration-300 group-hover:w-full z-0 origin-right"></span>
            <IoSettingsOutline className="mt-1 z-10 transition-transform duration-[1s] group-hover:rotate-[-360deg] " />
            <span className="z-10">Ustawienia</span>
          </Link>
          <Link
            to="/"
            onClick={handleLogout}
            className="w-[101%] relative overflow-hidden group flex items-center gap-2 sm:gap-3 p-1 sm:p-2 text-red-500 text-xs sm:text-md lg:text-xl font-semibold rounded-l-xl cursor-pointer"
          >
            <span className="absolute top-0 bottom-0 right-0 w-0 bg-red-500 transition-all duration-300 group-hover:w-full z-0 origin-right"></span>
            <RiLogoutCircleLine className="mt-1 transition-transform duration-300 group-hover:rotate-[-20deg] group-hover:text-light text-[16px] " />
            <span className="z-10 group-hover:text-light transition-colors duration-300">
              Wyloguj
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginBtn;
