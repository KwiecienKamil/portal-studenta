import GoogleLoginBtn from "./GoogleLoginBtn";
import logo from "../assets/logo_OT_t.png";

const Sidebar = () => {
  return (
    <div className="w-[30%] lg:w-[15%] bg-accent flex flex-col justify-between text-white pb-4">
      <img src={logo} className="max-w-[80%] mx-auto" alt="Ogarnij.to logo" />
      <div className="flex flex-col">
        <GoogleLoginBtn />
      </div>
    </div>
  );
};

export default Sidebar;
