import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { useEffect } from "react";
import type { GoogleJwtPayload } from "../types/GoogleJwtPayloadProps";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../features/auth/authSlice";
import { type AppDispatch, type RootState } from "../store";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdQuiz } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { fetchExams } from "../features/exams/examSlice";
import { MdOutlinePolicy, MdAddHomeWork } from "react-icons/md";
import type { TokenProps } from "../types/TokenProps";

const GoogleLoginBtn = ({ setAuthToken }: TokenProps) => {
  const location = useLocation();
  // const isPlatnosc = location.pathname === "/platnosc";
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
        const params = new URLSearchParams(window.location.search);
        const isBetaParam = params.get("beta") === "true";

        const userRes = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/user/${decoded.sub}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              "X-Google-User": JSON.stringify(decoded),
            },
          }
        );
        let fullUserData = userRes.ok ? await userRes.json() : null;

        if (!fullUserData || (!fullUserData.is_beta_tester && isBetaParam)) {
          await fetch(`${import.meta.env.VITE_SERVER_URL}/save-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenResponse.access_token}`,
              "X-Google-User": JSON.stringify(decoded),
            },
            body: JSON.stringify({
              name: decoded.name,
              email: decoded.email,
              picture: decoded.picture,
              googleId: decoded.sub,
              is_beta_tester: true,
            }),
          });
          const updatedUserRes = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/user/${decoded.sub}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenResponse.access_token}`,
                "X-Google-User": JSON.stringify(decoded),
              },
            }
          );
          if (!updatedUserRes.ok)
            throw new Error("Błąd pobierania danych użytkownika z serwera");
          fullUserData = await updatedUserRes.json();
        }

        dispatch(setUser(fullUserData));
        localStorage.setItem("currentUser", JSON.stringify(fullUserData));
        dispatch(fetchExams(fullUserData.googleId));
      } catch (error) {
        console.error("Błąd logowania:", error);
      }
      setAuthToken(tokenResponse.access_token);
    },
    onError: () => console.error("Logowanie nie powiodło się"),
  });

  const loginDemo = () => {
    const demoUser = {
      name: "Demo User",
      email: "demo@example.com",
      picture: "https://i.pravatar.cc/150?img=3",
      google_id: "demo123",
      terms_accepted: true,
      is_premium: true,
      isBetaTester: true,
    };
    dispatch(setUser(demoUser));
    localStorage.setItem("currentUser", JSON.stringify(demoUser));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) dispatch(setUser(JSON.parse(storedUser)));
  }, [dispatch]);

  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
  }, [user]);

  return (
    <div
      className={`${
        !user ? `flex flex-col items-center justify-center mb-8 gap-2` : ``
      }`}
    >
      {!user ? (
        <>
          <button
            onClick={() => login()}
            className="flex items-center justify-center w-full gap-3 text-lg lg:text-xl bg-green-600 text-white font-medium py-4 px-4 rounded-sm shadow-md hover:shadow-lg hover:bg-green-500 transition-all duration-300 cursor-pointer"
          >
            <FaGoogle className="text-red-500 text-xl sm:text-2xl mt-[2px]" />
            Zaloguj się przez Google
          </button>
          <button
            onClick={loginDemo}
            className="flex items-center justify-center w-full gap-3 text-lg lg:text-xl bg-accent text-white font-medium py-4 px-4 rounded-sm shadow-md hover:shadow-lg hover:bg-black transition-all duration-300 cursor-pointer"
          >
            Wypróbuj bez logowania
          </button>
          <Link to="/legal" className="mt-6 font-semibold">
            Polityka prywatności i Regulamin
          </Link>
        </>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-row items-center  gap-2  text-light  p-2 rounded-l-lg">
            <img
              src={user.picture}
              alt="Zdjęcie użytkownika"
              className="max-w-[60px] object-cover rounded-full border-2 border-accent"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-xl lg:text-2xl text-center sm:text-left">
                Witaj, <span className="font-semibold">{user.name}!</span>
              </h2>
              {user?.is_premium || user?.isBetaTester ? (
                <p className="text-md lg:text-lg sm:text-left">
                  Konto{" "}
                  <span className="font-semibold text-orange-500">Premium</span>
                </p>
              ) : (
                <p className="text-md lg:text-lg sm:text-left">Konto zwykłe</p>
              )}
            </div>
          </div>
          {/* {!(
            user?.is_premium ||
            user?.isBetaTester ||
            user?.google_id === "demo123"
          ) ? (
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
          ) : null} */}
          <Link
            to="/"
            className={`relative overflow-hidden group flex items-center gap-2 sm:gap-3 p-3 font-semibold rounded-l-xl cursor-pointer ${
              location.pathname === "/" ? "bg-light text-black" : null
            }`}
          >
            <span className="absolute top-0 bottom-0 right-0 w-0 bg-light transition-all duration-300 group-hover:w-full z-0 origin-right"></span>
            <MdAddHomeWork className="mt-1 z-10 transition-transform duration-[1s] group-hover:rotate-[-360deg] text-xl group-hover:text-dark" />
            <span className="z-10 text-xl lg:text-2xl group-hover:text-dark">
              Strona główna
            </span>
          </Link>
          {user?.is_premium ||
          user?.isBetaTester ||
          user?.google_id === "demo123" ? (
            <Link
              to="/quiz"
              className={`relative overflow-hidden group flex items-center gap-2 sm:gap-3 p-3 lg:text-xl font-semibold rounded-l-xl cursor-pointer ${
                location.pathname === "/quiz" ? "bg-light text-black" : ""
              }`}
            >
              <span className="absolute top-0 bottom-0 right-0 w-0 bg-light transition-all duration-300 group-hover:w-full z-0 origin-right"></span>
              <MdQuiz className="mt-[1px] z-10 transition-transform duration-300 group-hover:rotate-[-360deg] text-xl group-hover:text-dark" />
              <span className="z-10 text-xl lg:text-2xl group-hover:text-dark">
                Generator quizów
              </span>
            </Link>
          ) : null}
          <Link
            to="/ustawienia"
            className={`relative overflow-hidden group flex items-center gap-2 sm:gap-3 p-3 font-semibold rounded-l-xl cursor-pointer ${
              location.pathname === "/ustawienia" ? "bg-light text-black" : null
            }`}
          >
            <span className="absolute top-0 bottom-0 right-0 w-0 bg-light transition-all duration-300 group-hover:w-full z-0 origin-right"></span>
            <IoSettingsOutline className="mt-1 z-10 transition-transform duration-[1s] group-hover:rotate-[-360deg] text-xl group-hover:text-dark" />
            <span className="z-10 text-xl lg:text-2xl group-hover:text-dark">
              Ustawienia
            </span>
          </Link>
          <Link
            to="/legal"
            className={`relative overflow-hidden group flex items-center gap-2 sm:gap-3 p-3 font-semibold rounded-l-xl cursor-pointer ${
              location.pathname === "/legal" ? "bg-light text-black" : null
            }`}
          >
            <span className="absolute top-0 bottom-0 right-0 w-0 bg-light transition-all duration-300 group-hover:w-full z-0 origin-right"></span>
            <MdOutlinePolicy className="mt-1 z-10 transition-transform duration-[1s] group-hover:rotate-[-360deg] text-xl group-hover:text-dark" />
            <span className="z-10 text-xl lg:text-2xl group-hover:text-dark">
              Regulamin
            </span>
          </Link>
          <Link
            to="/"
            onClick={handleLogout}
            className="w-[101%] relative overflow-hidden group flex items-center gap-2 sm:gap-3 p-3 text-red-500 text-xl lg:text-2xl font-semibold rounded-l-xl cursor-pointer"
          >
            <span className="absolute top-0 bottom-0 right-0 w-0 bg-red-500 transition-all duration-300 group-hover:w-full origin-right"></span>
            <RiLogoutCircleLine className="mt-1 transition-transform duration-300 group-hover:rotate-[-20deg] group-hover:text-light text-xl " />
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
