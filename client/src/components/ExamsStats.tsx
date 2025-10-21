import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { type ExamData } from "../features/exams/examSlice";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExamStatsProps {
  exams: ExamData[];
  user: {
    name: string;
    email: string;
    picture: string;
    google_id: string;
    terms_accepted: boolean;
    is_premium?: boolean | undefined;
    isBetaTester?: boolean | undefined;
    isProfilePublic?: boolean | undefined;
  };
}

const ExamStats = ({ exams, user }: ExamStatsProps) => {
  const completed = exams.filter((e) => e.completed).length;
  const notCompleted = exams.length - completed;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg flex flex-col md:flex-row items-center justify-center gap-8 text-sm sm:text-md">
      <div>
        <h3 className="text-lg font-semibold mb-2">📊 Statystyki egzaminów</h3>
        <ul className="list-disc pl-5 text-gray-700 mb-4">
          <li>Łączna liczba egzaminów: {exams.length}</li>
          <li>Zaliczone: {completed}</li>
          <li>Nie zaliczone: {notCompleted}</li>
          <li>
            Egzaminy z 1. terminu: {exams.filter((e) => e.term === "1").length}
          </li>
          <li>
            Egzaminy z 2. terminu: {exams.filter((e) => e.term === "2").length}
          </li>
          <li>
            Egzaminy z 3. terminu: {exams.filter((e) => e.term === "3").length}
          </li>
        </ul>
      </div>

      <div className="max-w-[200px]">
        <Pie
          data={{
            labels: ["Zaliczone", "Nie zaliczone"],
            datasets: [
              {
                data: [completed, notCompleted],
                backgroundColor: ["#4CAF50", "#FF5252"],
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>

      {user?.is_premium || user?.isBetaTester ? (
        <div className="text-dark">
          <h4 className="font-semibold mb-4 text-blue-700">
            Dodatkowe statystyki:
          </h4>
          <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base leading-relaxed">
            <li>
              Egzaminy z 1. terminu:{" "}
              {exams.filter((e) => e.term === "1").length}
            </li>
            <li>
              Egzaminy z 2. terminu:{" "}
              {exams.filter((e) => e.term === "2").length}
            </li>
            <li>
              Egzaminy z 3. terminu:{" "}
              {exams.filter((e) => e.term === "3").length}
            </li>
            <li>
              Procent zaliczonych egzaminów:{" "}
              {((completed / exams.length) * 100).toFixed(1)}%
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default ExamStats;
