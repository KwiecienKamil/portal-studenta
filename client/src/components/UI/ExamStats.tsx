import React from "react";
import { Pie } from "react-chartjs-2";

interface Exam {
  completed?: boolean;
  term: string;
}

interface ExamStatsProps {
  exams: Exam[];
  isPremium?: boolean;
  isBetaTester?: boolean;
}

const ExamStats: React.FC<ExamStatsProps> = ({
  exams,
  isPremium,
  isBetaTester,
}) => {
  const completedCount = exams.filter((e) => e.completed).length;
  const notCompletedCount = exams.length - completedCount;

  return (
    <div className="mt-6 p-4 bg-light rounded-lg flex flex-col md:flex-row items-center justify-center gap-4 text-sm sm:text-md">
      <div>
        <h3 className="text-lg lg:text-2xl font-semibold mb-2">
          Statystyki egzaminów
        </h3>
        <ul className="list-disc pl-5 text-gray-700 mb-4 text-md lg:text-lg">
          <li>Łączna liczba egzaminów: {exams.length}</li>
          <li>Zaliczone: {completedCount}</li>
          <li>Nie zaliczone: {notCompletedCount}</li>
        </ul>
      </div>
      <div className="w-[200px] lg:w-[300px]">
        <Pie
          data={{
            labels: ["Zaliczone", "Nie zaliczone"],
            datasets: [
              {
                data: [completedCount, notCompletedCount],
                backgroundColor: ["#41A67E", "#FF5252"],
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>
      {(isPremium || isBetaTester) && (
        <div className="text-dark">
          <h4 className="font-semibold mb-4 text-blue-700  lg:text-xl">
            Dodatkowe statystyki:
          </h4>
          <ul className="list-disc pl-6 space-y-2 text-sm lg:text-md leading-relaxed">
            <li>
              Egzaminy z 0 terminu:{" "}
              <span className="font-medium">
                {exams.filter((e) => e.term === "0").length}
              </span>
            </li>
            <li>
              Egzaminy z 1 terminu:{" "}
              <span className="font-medium">
                {exams.filter((e) => e.term === "1").length}
              </span>
            </li>
            <li>
              Egzaminy z 2 terminu:{" "}
              <span className="font-medium">
                {exams.filter((e) => e.term === "2").length}
              </span>
            </li>
            <li>
              Egzaminy z 3 terminu:{" "}
              <span className="font-medium">
                {exams.filter((e) => e.term === "3").length}
              </span>
            </li>
            <li>
              Procent zaliczonych egzaminów:{" "}
              <span className="font-medium">
                {((completedCount / exams.length) * 100).toFixed(1)}%
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExamStats;
