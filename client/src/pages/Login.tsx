import { useEffect } from "react";
import logo from "../assets/logo-ot-500_500.png";
import type { TokenProps } from "../types/TokenProps";
import GoogleLoginBtn from "../components/Login/GoogleLoginBtn";

const Login = ({ setAuthToken }: TokenProps) => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("beta") === "true") {
      localStorage.setItem("betaTesterInvite", "true");
    }
  }, []);

  return (
    <div className="relative min-w-1/3 rounded-lg px-4 pt-8 sm:px-10 sm:pt-12  text-center bg-white text-black shadow-lg">
      <h1 className="text-4xl sm:text-3xl lg:text-5xl font-semibold mb-6">
        Witamy!
      </h1>
      <div className="flex justify-center">
        <img src={logo} alt="" className="max-w-1/3 mb-4" />
      </div>
      <div className="inline-block w-full mt-4">
        <GoogleLoginBtn setAuthToken={setAuthToken} />
      </div>
    </div>
  );
};

export default Login;
