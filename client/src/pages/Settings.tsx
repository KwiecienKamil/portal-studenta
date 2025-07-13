import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";

const Settings = () => {
  return (
    <Wrapper>
      <Sidebar />
      <div className="p-4 flex-1 bg-smokewhite text-dark rounded-xl max-h-full overflow-y-scroll">
        <Link
          to="/"
          className="group font-semibold flex items-center gap-2 duration-100 hover:text-accent"
        >
          <MdOutlineKeyboardDoubleArrowLeft className="group-hover:animate-ping" />
          Egzaminy
        </Link>
        <h1>To są ustawienia</h1>
      </div>
    </Wrapper>
  );
};

export default Settings;
