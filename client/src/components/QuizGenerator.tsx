import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useState } from "react";

GlobalWorkerOptions.workerSrc = pdfWorker;

type QA = { question: string; answer: string };

export default function QuizGenerator() {
  const [questions, setQuestions] = useState<QA[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [results, setResults] = useState<Record<number, boolean>>({});

  const shuffle = <T,>(arr: T[]): T[] => {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setQuestions([]);
    setSelectedAnswers({});
    setResults({});

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

      const regex = /P:\s*(.+?)\s*A:\s*(.+?)(?=(P:|$))/gs;

      const quizItems: { question: string; answer: string }[] = [];
      let match;
      while ((match = regex.exec(fullText)) !== null) {
        const question = match[1].trim();
        const answer = match[2].trim();
        quizItems.push({ question, answer });
      }

      setQuestions(quizItems);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const buildOptions = (correctIndex: number): string[] => {
    const correctAnswer = questions[correctIndex].answer;
    const otherAnswers = questions
      .filter((_, i) => i !== correctIndex)
      .map((q) => q.answer);

    const shuffledOthers = shuffle(otherAnswers).slice(0, 3);
    const options = shuffle([correctAnswer, ...shuffledOthers]);
    return options;
  };

  const handleAnswer = (qIndex: number, answer: string) => {
    if (selectedAnswers[qIndex] !== undefined) return;

    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: answer }));

    const isCorrect = questions[qIndex].answer === answer;
    setResults((prev) => ({ ...prev, [qIndex]: isCorrect }));
  };

  return (
    <div className="p-4 mt-4 bg-white shadow rounded-xl border border-gray-200 max-w-xl mx-auto overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">🧠 Generator quizu z PDF</h2>
      <p className="text-sm text-gray-600 mb-4">
        Wgraj PDF z notatkami w formacie:
        <br />
        <code className="bg-gray-100 p-2 block mt-1 rounded text-sm">
          P: Jakie są barwy flagi Polski? <br />
          A: Biała i czerwona
        </code>
      </p>
      <div className="mb-6">
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          onChange={handlePDFUpload}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="inline-block cursor-pointer font-semibold px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Wybierz plik
        </label>
      </div>
      {loading && (
        <p className="text-blue-500 font-semibold">⏳ Ładowanie PDF...</p>
      )}

      {questions.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mb-4 text-xs sm:text-md md:text:lg">
            📋 Wygenerowany quiz:
          </h3>
          <ol className="space-y-6">
            {questions.map((q, i) => {
              const options = buildOptions(i);
              const selected = selectedAnswers[i];
              const correct = results[i];
              return (
                <li
                  key={i}
                  className="bg-blue-50 p-4 rounded-md text-xs lg:text-[1rem]"
                >
                  <p className="font-semibold mb-3">{q.question}</p>
                  <ul>
                    {options.map((opt) => {
                      const isSelected = selected === opt;
                      const isCorrectAnswer = q.answer === opt;

                      let bgClass = "bg-white";

                      if (selected !== undefined) {
                        if (isCorrectAnswer) {
                          bgClass = "bg-green-300";
                        }
                        if (isSelected && !isCorrectAnswer) {
                          bgClass = "bg-red-300";
                        }
                      }

                      return (
                        <li
                          key={`${i}-${opt}`}
                          className={`cursor-pointer p-2 rounded mb-1 border border-gray-300 hover:bg-gray-100 ${
                            selected !== undefined
                              ? opt === q.answer
                                ? "bg-green-300"
                                : opt === selected
                                ? "bg-red-300"
                                : "bg-white"
                              : "bg-white"
                          }`}
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
                      {correct ? "✔️ Dobrze!" : "❌ Źle!"}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
