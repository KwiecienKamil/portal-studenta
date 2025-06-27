import GoogleLoginBtn from "./GoogleLoginBtn";
import logo from "../assets/logo_OT_t.png";

const Sidebar = () => {
  return (
    <div className="w-[30%] lg:w-[20%] bg-accent flex flex-col justify-between p-4 pb-8 text-white">
      <img src={logo} className="max-w-[80%] mx-auto" alt="Ogarnij.to logo" />
      <div className="flex flex-col">
        <GoogleLoginBtn />
      </div>
    </div>
  );
};

export default Sidebar;
