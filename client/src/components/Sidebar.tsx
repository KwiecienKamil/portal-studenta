import GoogleLoginBtn from "./GoogleLoginBtn";
import logo from "../assets/logo_OT_t.png";
import { Link } from "react-router-dom";

type SidebarProps = {
  showSidebarButton: boolean;
};

const Sidebar = ({ showSidebarButton }: SidebarProps) => {
  return (
    <div className="w-[15 %] md:w-[25%] lg:w-[20%] xl:w-[18%] bg-accent flex flex-col justify-between text-white">
      <Link to="/">
        <img
          src={logo}
          className="max-w-[90%] lg:max-w-[80%] mx-auto mt-2"
          alt="Ogarnij.to logo"
        />
      </Link>
      {showSidebarButton ? (
        <div className="flex flex-col">
          <GoogleLoginBtn />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Sidebar;
