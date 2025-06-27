import type { WrapperProps } from "../types/WrapperProps";

const Wrapper = ({ children }: WrapperProps) => {
  return <div className="h-screen w-full flex bg-accent p-4">{children}</div>;
};

export default Wrapper;
