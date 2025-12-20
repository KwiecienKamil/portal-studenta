import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import QuizGenerator from "../components/QuizGenerator/QuizGenerator";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";

const GenerateQuiz = () => {
  const [quizAuthToken, setQuizAuthToken] = useState("");


  return (
    <Wrapper>
      <Sidebar showSidebarButton={true} setAuthToken={setQuizAuthToken} />
      <div className="p-6 flex-1 bg-light text-dark rounded-xl max-h-full overflow-y-scroll z-10">
        <Link
          to="/"
          className="group font-semibold flex items-center gap-2 duration-100 hover:text-accent text-xl"
        >
          <MdOutlineKeyboardDoubleArrowLeft className="group-hover:animate-ping" />
          Egzaminy
        </Link>
        <div className="flex justify-center">
          <QuizGenerator quizAuthToken={quizAuthToken} />
        </div>
      </div>
    </Wrapper>
  );
};

export default GenerateQuiz;
