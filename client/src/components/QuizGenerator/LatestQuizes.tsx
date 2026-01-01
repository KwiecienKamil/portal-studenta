import type { FC } from "react";
import type { QuizAnswerDetails } from "../../types/QuizDetailsProps";

import CircularProgress from "./CircularProgress";
import type { QuizResult } from "../../types/QuizesResult";

type LatestQuizesProps = {
  quizes: QuizResult[] | null;
  quizDetails: QuizAnswerDetails[] | null;
  activeQuizId: number | null;
  fetchQuizDetails: (quizResultId: number) => Promise<void>;
  detailsLoading: boolean;
  setQuizDetails: React.Dispatch<
    React.SetStateAction<QuizAnswerDetails[] | null>
  >;
  setActiveQuizId: React.Dispatch<React.SetStateAction<number | null>>;
};

const LatestQuizes: FC<LatestQuizesProps> = ({
  quizes,
  quizDetails,
  activeQuizId,
  fetchQuizDetails,
  detailsLoading,
  setQuizDetails,
  setActiveQuizId,
}) => {
  return (
    <div className="px-2 sm:px-8 pb-4 mt-4 bg-white shadow rounded-xl border border-gray-200 overflow-y-auto">
      <h5 className="text-2xl font-semibold text-center py-4">
        Historia quizów
      </h5>
      {quizes?.map((quiz: QuizResult) => (
        <div
          key={quiz.id}
          className="flex items-center justify-between text-md sm:text-lg pb-4"
        >
          <CircularProgress percentage={quiz.percentage} />
          <p className="text-gray-700">
            {new Date(quiz.date).toLocaleDateString("pl-PL")}
          </p>
          <button
            onClick={() => fetchQuizDetails(quiz.id)}
            className="px-4 py-1 bg-purple-700 hover:bg-purple-800 rounded-lg text-white font-semibold text-sm sm:text-[16px] cursor-pointer duration-300"
          >
            Podgląd
          </button>
        </div>
      ))}
      {detailsLoading && (
        <p className="text-center text-gray-500 py-4">
          Ładowanie szczegółów quizu...
        </p>
      )}

      {quizDetails && (
        <div className="mt-6 bg-gray-50 border rounded-lg p-4 animate-fadeIn">
          <h4 className="text-xl font-bold mb-4 text-center">
            Podgląd quizu #{activeQuizId}
          </h4>

          <ol className="space-y-4">
            {quizDetails.map((q, i) => (
              <li
                key={i}
                className={`p-3 rounded-md border ${
                  q.is_correct
                    ? "border-green-400 bg-green-50"
                    : "border-red-400 bg-red-50"
                }`}
              >
                <p className="font-semibold mb-2">{q.question}</p>

                <p className="text-sm">
                  <span
                    className={
                      q.is_correct
                        ? "text-green-700 font-semibold"
                        : "text-red-700 font-semibold"
                    }
                  >
                    {q.user_answer}
                  </span>
                </p>
                {!q.is_correct && (
                  <p className="text-sm text-green-700 font-semibold">
                    Poprawna odpowiedź: {q.correct_answer}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <button
            onClick={() => {
              setQuizDetails(null);
              setActiveQuizId(null);
            }}
            className="mt-6 mx-auto block px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg text-white font-semibold text-sm sm:text-[16px] cursor-pointer duration-300"
          >
            Zamknij podgląd
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestQuizes;
