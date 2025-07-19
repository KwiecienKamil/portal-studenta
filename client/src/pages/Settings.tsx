import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const Settings = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState("");

  const handleSave = () => {
    console.log({ username, isProfilePublic, darkMode });
    alert("Zapisano ustawienia!");
  };

  return (
    <Wrapper>
      <Sidebar showSidebarButton={true} />
      <div className="p-6 flex-1 bg-smokewhite text-dark rounded-xl max-h-full overflow-y-scroll scroll-container">
        <Link
          to="/"
          className="group font-semibold flex items-center gap-2 duration-100 hover:text-accent"
        >
          <MdOutlineKeyboardDoubleArrowLeft className="group-hover:animate-ping" />
          Egzaminy
        </Link>

        <h1 className="text-2xl font-bold mt-4 mb-6">Ustawienia</h1>
        <div className="mb-6">
          <label className="block font-medium mb-2">Nazwa użytkownika</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
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

        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="w-5 h-5"
            />
            Tryb ciemny
          </label>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-dark hover:text-accent transition-all duration-300 cursor-pointer"
        >
          Zapisz zmiany
        </button>
      </div>
    </Wrapper>
  );
};

export default Settings;
