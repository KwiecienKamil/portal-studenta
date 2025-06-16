import type { WrapperProps } from "../types/WrapperProps";

const Wrapper = ({ children }: WrapperProps) => {
  return <div className="h-screen w-full flex bg-smokewhite">{children}</div>;
};

export default Wrapper;
