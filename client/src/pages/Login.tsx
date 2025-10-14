import { useEffect } from "react";
import GoogleLoginBtn from "../components/GoogleLoginBtn";

const Login = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("beta") === "true") {
      localStorage.setItem("betaTesterInvite", "true");
    }
  }, []);

  return (
    <div className=" rounded-lg shadow-lg  p-[5px] sm:p-10  sm:max-w-md w-full text-center">
      <h1 className="text-xl sm:text-3xl font-semibold mb-6 text-gray-900">
        Witamy!
      </h1>
      <p className="mb-8 text-gray-600 text-xs sm:text-lg">
        Zaloguj się, aby kontynuować i uzyskać dostęp do wszystkich funkcji.
      </p>
      <div className="inline-block">
        <GoogleLoginBtn />
      </div>
    </div>
  );
};

export default Login;
