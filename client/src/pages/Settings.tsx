import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { setUser } from "../features/auth/authSlice";

const Settings = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [username, setUsername] = useState("");

  const dispatch = useDispatch();

  const handleSave = async () => {
    if (username.trim().length < 3) {
      alert("Nazwa użytkownika musi mieć co najmniej 3 znaki.");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/settings`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId: user?.google_id,
            username,
            isProfilePublic,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        if (user) {
          dispatch(
            setUser({
              ...user,
              name: username,
              isProfilePublic: isProfilePublic,
            })
          );
        }
        alert("Zapisano ustawienia!");
      }
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd przy zapisie ustawień.");
    }
  };
  return (
    <Wrapper>
      <Sidebar showSidebarButton={true} />
      <div className="p-6 flex-1 bg-smokewhite text-dark rounded-xl max-h-full overflow-y-scroll scroll-container relative">
        <Link
          to="/"
          className="group font-semibold flex items-center gap-2 duration-100 hover:text-accent text-xl"
        >
          <MdOutlineKeyboardDoubleArrowLeft className="group-hover:animate-ping" />
          Egzaminy
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mt-8 mb-6">Ustawienia</h1>
        <div className="mb-6">
          <label className="block font-medium mb-2 text-lg">
            Zmień nazwę użytkownika
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-2 pr-6 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) =>
              (e.target.placeholder = `Aktualna nazwa: ${user?.name}`)
            }
            placeholder={`Aktualna nazwa: ${user?.name}`}
          />
        </div>
        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isProfilePublic}
              onChange={() => setIsProfilePublic(!isProfilePublic)}
              className="w-5 h-5"
            />
            Profil publiczny
          </label>
        </div>
        <div className="pb-4">
          <button className="px-2 py-2 bg-dark text-white rounded-lg mr-3">
            Pobierz moje dane
          </button>
          <button className="px-2 py-2 bg-red-600 text-white rounded-lg">
            Usuń konto
          </button>
        </div>
        <button
          onClick={handleSave}
          className="px-8 py-4 bg-accent text-white rounded-lg font-semibold hover:bg-dark hover:text-accent transition-all duration-300 cursor-pointer"
        >
          Zapisz zmiany
        </button>
      </div>
    </Wrapper>
  );
};

export default Settings;
