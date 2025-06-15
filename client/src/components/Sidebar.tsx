import GoogleLoginBtn from "./GoogleLoginBtn";

const Sidebar = () => {
  return (
    <div className="w-[20%] bg-accent flex flex-col justify-between p-4 py-8 text-white">
      <h1>Logo</h1>
      <div className="flex flex-col gap-4">
        <GoogleLoginBtn />
      </div>
    </div>
  );
};

export default Sidebar;
