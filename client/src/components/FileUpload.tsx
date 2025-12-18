import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

type QA = { question: string; answer: string };

type FileUploadProps = {
  user: any;
  setLoading: (val: boolean) => void;
  setQuestions: (val: QA[]) => void;
  setSelectedAnswers: (val: Record<number, string>) => void;
  setResults: (val: Record<number, boolean>) => void;
  setOptionsMap: (val: Record<number, string[]>) => void;
  quizAuthToken: string;
};

export default function FileUpload({
  user,
  setLoading,
  setQuestions,
  setSelectedAnswers,
  setResults,
  setOptionsMap,
  quizAuthToken,
}: FileUploadProps) {
    
  const shuffle = <T,>(arr: T[]): T[] => {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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

  return (
    <div className="flex">
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handlePDFUpload}
        className="hidden"
      />
      <label
        htmlFor="file-upload"
        className="inline-block cursor-pointer font-semibold px-4 py-2 bg-success text-white rounded hover:bg-green-600 duration-300 text-sm sm:text-lg"
      >
        Wybierz plik
      </label>
    </div>
  );
}
