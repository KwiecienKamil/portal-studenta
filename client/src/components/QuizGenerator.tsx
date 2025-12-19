
import {  useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { QuizLoaderAnimation } from "./UI/QuizLoaderAnimation";
import brain from "../assets/quiz_brain.png";
import { toast } from "react-toastify";
import FileUpload from "./FileUpload";
import type { QuizResult } from "../types/QuizesResult";


type QA = { question: string; answer: string };

type quizAuthTokenProps = {
  quizAuthToken: string;
};

type QuizAnswerDetails = {
  question: string;
  correct_answer: string;
  user_answer: string;
  is_correct: number;
};

export default function QuizGenerator({ quizAuthToken }: quizAuthTokenProps) {
  const [questions, setQuestions] = useState<QA[]>([]);
  const [optionsMap, setOptionsMap] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const quizes = useSelector((state: RootState) => state.quizes.results)
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const total = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const percentage = Math.round((correct / total) * 100);
  const [detailsLoading, setDetailsLoading] = useState(false);
const [quizDetails, setQuizDetails] = useState<QuizAnswerDetails[] | null>(null);
const [activeQuizId, setActiveQuizId] = useState<number | null>(null);

  const handleAnswer = (qIndex: number, answer: string) => {
    if (selectedAnswers[qIndex] !== undefined) return;

    const isCorrect = questions[qIndex].answer === answer;

    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: answer }));
    setResults((prev) => ({ ...prev, [qIndex]: isCorrect }));
  };

   async function saveQuizResult() {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/quiz-result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user?.google_id,
      score: correct,
      total: total,
      percentage: percentage,
      answers: questions.map((q, i) => ({
        question: q.question,
        correct: q.answer,
        user: selectedAnswers[i],
        isCorrect: results[i]
      }))
    })
  });

  return response.json();
}

const handleSaveQuiz = async () => {
  const response = await saveQuizResult();
  if (response.success) {
    setQuestions([]);
    setSelectedAnswers({});
    setResults({});
    setOptionsMap({});
    setLoading(false);
    toast.success("Quiz zapisany, możesz zacząć nowy!");
  } else {
    toast.error("Wystąpił problem podczas zapisu quizu, spróbuj ponownie");
  }
};

const fetchQuizDetails = async (quizResultId: number) => {
  try {
    setDetailsLoading(true);
    setActiveQuizId(quizResultId);

    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/quiz-result-details/${quizResultId}`
    );

    if (!res.ok) throw new Error("Błąd pobierania szczegółów quizu");

    const data = await res.json();
    setQuizDetails(data);
  } catch (err) {
    console.error(err);
    toast.error("Nie udało się pobrać szczegółów quizu");
  } finally {
    setDetailsLoading(false);
  }
};

  return (
    <div className="w-full md:max-w-[60%]">
    <div className=" p-4 mt-4 bg-white shadow rounded-xl border border-gray-200 overflow-y-auto">
      <div className="flex justify-center">
        <div className="max-w-1/3 flex items-center justify-center">
          <img
            src={brain}
            alt="Brain emoji"
            className="max-w-[80%] sm:max-w-[70%]"
          />
        </div>
        <div className="mt-4">
          <h2 className="text-lg md:text-2xl font-bold">
            Generator quizu <span className="text-blue-900">AI</span>
          </h2>
          <p className="text-sm md:text-md mb-6 text-md mt-1">
            Ekspresowo wygeneruj quiz z pliku PDF!
            <br />
          </p>
          <FileUpload
          user={user}
          setLoading={setLoading}
          setQuestions={setQuestions}
          setSelectedAnswers={setSelectedAnswers}
          setResults={setResults}
          setOptionsMap={setOptionsMap}
          quizAuthToken={quizAuthToken}
        />
        </div>
      </div>
      {loading ? <QuizLoaderAnimation /> : null}
      {questions.length > 0 && (
        <div className="animate-fadeIn">
          <h3 className="text-md font-semibold mb-4 text-xs sm:text-md md:text:lg"></h3>
          <ol className="space-y-6">
            {questions.map((q, i) => {
              const options = optionsMap[i] || [];
              const selected = selectedAnswers[i];
              const correct = results[i];

              return (
                <li
                  key={i}
                  className="bg-accent text-light p-4 rounded-md text-xs lg:text-[1rem]"
                >
                  <p className="font-semibold mb-3">{q.question}</p>
                  <ul>
                    {options.map((opt) => {
                      const isSelected = selected === opt;
                      const isCorrectAnswer = q.answer === opt;
                      let bgClass = "bg-gray-900";

                      if (selected !== undefined) {
                        if (isCorrectAnswer) {
                          bgClass = "bg-green-600";
                        }
                        if (isSelected && !isCorrectAnswer) {
                          bgClass = "bg-red-500";
                        }
                      }

                      return (
                        <li
                          key={`${i}-${opt}`}
                          className={`cursor-pointer p-2 rounded mb-1 border border-gray-300 hover:bg-gray-800 ${bgClass}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAnswer(i, opt);
                          }}
                        >
                          {opt}
                        </li>
                      );
                    })}
                  </ul>
                  {selected !== undefined && (
                    <p
                      className={`mt-2 font-semibold ${
                        correct ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {correct ? "Dobrze!" : "Źle!"}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
      {Object.keys(results).length === questions.length && questions.length ? (
        <div className="p-6 bg-green-50 rounded-lg text-center">
          <h3 className="text-lg font-bold mb-2">Wyniki końcowe</h3>
          <p>
            Poprawne odpowiedzi: {correct} / {total} ({percentage}%)
          </p>
          <p className=" pb-4 font-semibold">
            {percentage >= 80
              ? "Ekspert!"
              : percentage >= 50
              ? "Nieźle!"
              : "Do poprawy"}
          </p>
          <button
            onClick={handleSaveQuiz}
            className="px-2 py-2 bg-accent text-white rounded hover:bg-red-700 duration-300 text-md sm:text-lg cursor-pointer"
          >
            Zakończ quiz
          </button>
        </div>
      ) : null}
    </div>
    <div className="px-8 pb-4 mt-4 bg-white shadow rounded-xl border border-gray-200 overflow-y-auto">
    <h5 className="text-2xl font-semibold text-center py-4">Ostatnie egzaminy</h5>
          {quizes.map((quiz: QuizResult) => (
            <div className="flex items-center justify-between text-md sm:text-lg pb-4">
              <p className={quiz.percentage > 50 ? "text-green-500" : "text-red-500"}>{`${quiz.percentage}%`}</p>
              <p className="text-gray-700">{new Date(quiz.date).toLocaleDateString("pl-PL")}</p>
              <button
              onClick={() => fetchQuizDetails(quiz.id)} 
              className="px-4 py-1 bg-purple-700 hover:bg-purple-800 rounded-lg text-white font-semibold text-sm sm:text-[16px] cursor-pointer duration-300"
              >Podgląd</button>
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
            q.is_correct ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
          }`}
        >
          <p className="font-semibold mb-2">{q.question}</p>

          <p className="text-sm">
            <span
              className={
                q.is_correct ? "text-green-700 font-semibold" : "text-red-700 font-semibold"
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
    </div>
  );
}
