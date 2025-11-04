import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import GoogleLoginBtn from "./GoogleLoginBtn";
import logo from "../assets/logo_OT_t.png";
import { FaArrowCircleLeft } from "react-icons/fa";

type SidebarProps = {
  showSidebarButton: boolean;
};

const Sidebar = ({ showSidebarButton }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="block md:hidden pr-4 ">
        <FiMenu
          className="black cursor-pointer text-white mt-3 text-4xl"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <div
        className={`fixed md:static flex top-0 left-0 h-full bg-accent text-white flex-col justify-between transition-transform duration-300 shadow-lg md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          w-[80%] xs:w-[60%] sm:w-[40%] md:translate-x-0 md:w-[25%] lg:w-[30%] xl:w-[20%] z-12`}
      >
        {isOpen ? (
          <div className="absolute top-4 right-2 flex justify-end mt-4">
            <FaArrowCircleLeft
              className="text-5xl"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        ) : null}
        <Link to="/" onClick={() => setIsOpen(false)}>
          <img
            src={logo}
            className="max-w-[50%] lg:max-w-[80%] mx-auto mt-16 md:mt-4"
            alt="Ogarnijto.org logo"
          />
        </Link>
        {showSidebarButton && (
          <div className="flex flex-col pb-8 pl-4 md:pl-0">
            <GoogleLoginBtn />
          </div>
        )}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
