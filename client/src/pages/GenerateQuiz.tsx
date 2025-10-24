import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import QuizGenerator from "../components/QuizGenerator";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";

const GenerateQuiz = () => {
  return (
    <Wrapper>
      <Sidebar showSidebarButton={true} />
      <div className="p-4 flex-1 bg-smokewhite text-dark rounded-xl max-h-full overflow-y-scroll z-10">
        <Link
          to="/"
          className="group font-semibold flex items-center gap-1 duration-100 hover:text-accent text-lg"
        >
          <MdOutlineKeyboardDoubleArrowLeft className="group-hover:animate-ping text-2xl md:text-3xl" />
          Egzaminy
        </Link>
        <div className="flex justify-center">
          <QuizGenerator />
        </div>
      </div>
    </Wrapper>
  );
};

export default GenerateQuiz;
