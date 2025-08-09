import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import QuizGenerator from "../components/QuizGenerator";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import pdfExample from "../assets/pdf.png";

const GenerateQuiz = () => {
  return (
    <Wrapper>
      <Sidebar showSidebarButton={true} />
      <div className="p-4 flex-1 bg-smokewhite text-dark rounded-xl max-h-full overflow-y-scroll z-10">
        <Link
          to="/"
          className="group font-semibold flex items-center gap-2 duration-100 hover:text-accent"
        >
          <MdOutlineKeyboardDoubleArrowLeft className="group-hover:animate-ping" />
          Egzaminy
        </Link>
        <div className="flex  gap-4">
          <QuizGenerator />
        </div>
      </div>
    </Wrapper>
  );
};

export default GenerateQuiz;
