import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { QuizLoaderAnimation } from "./UI/QuizLoaderAnimation";
import brain from "../assets/quiz_brain.png";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

GlobalWorkerOptions.workerSrc = pdfWorker;

type QA = { question: string; answer: string };

type quizAuthTokenProps = {
  quizAuthToken: string;
};

export default function QuizGenerator({ quizAuthToken }: quizAuthTokenProps) {
  const [questions, setQuestions] = useState<QA[]>([]);
  const [optionsMap, setOptionsMap] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const total = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const percentage = Math.round((correct / total) * 100);
  const navigate = useNavigate();

  async function generateQuizFromText(text: string) {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/generate-quiz`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );
    if (!response.ok) {
      throw new Error("Błąd generowania quizu");
    }

    const data = await response.json();
    return data.quizItems;
  }

  const shuffle = <T,>(arr: T[]): T[] => {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const demoUsed = localStorage.getItem("demo_quiz_used");
    if (user?.google_id === "demo123" && demoUsed) {
      alert("Wersja demo pozwala wygenerować quiz tylko raz");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setQuestions([]);
    setSelectedAnswers({});
    setResults({});
    setOptionsMap({});

    const reader = new FileReader();

    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result as ArrayBuffer);
      const pdf = await getDocument({ data: typedArray }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        fullText += strings.join(" ") + "\n";
      }

      fullText = fullText.replace(/\r/g, "").replace(/\n\s*\n/g, "\n");

      try {
        const quizItems = (await generateQuizFromText(fullText)) as QA[];
        const shuffledQuiz = shuffle(quizItems);

        const opts: Record<number, string[]> = {};
        shuffledQuiz.forEach((q, i) => {
          const correctAnswer = q.answer;
          const otherAnswers = shuffledQuiz
            .filter((_, j) => j !== i)
            .map((qq) => qq.answer);

          const shuffledOthers = shuffle(otherAnswers).slice(0, 3);
          opts[i] = shuffle([correctAnswer, ...shuffledOthers]);
        });

        setQuestions(shuffledQuiz);
        setOptionsMap(opts);

        if (user?.google_id === "demo123") {
          localStorage.setItem("demo_quiz_used", "true");
        }
      } catch (error) {
        console.error(
          `Błąd generowania quizu dla użytkownika ${quizAuthToken}:`,
          error
        );
        setQuestions([]);
      }

      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

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
     navigate('/quiz');
  } else {
    toast.error("Wystąpił problem podczas zapisu quizu, spróbuj ponownie");
  }
}

  return (
    <div className="min-w-[40%] p-4 mt-4 bg-white shadow rounded-xl border border-gray-200 overflow-y-auto">
      <div className="flex">
        <div className="max-w-1/3 flex items-center justify-center">
          <img
            src={brain}
            alt="Brain emoji"
            className="max-w-[80%] sm:max-w-[70%]"
          />
        </div>
        <div className="mt-4">
          <h2 className="text-lg md:text-2xl font-bold mb-1">
            Generator quizu <span className="text-blue-900">AI</span>
          </h2>
          <p className="text-sm md:text-md mb-6 text-md">
            Ekspresowo wygeneruj quiz z pliku PDF!
            <br />
          </p>
          <div className="mb-4">
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="inline-block cursor-pointer font-semibold px-4 py-2 bg-success text-white rounded hover:bg-green-600 duration-300 text-md sm:text-lg"
            >
              Wybierz plik
            </label>
          </div>
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
  );
}
