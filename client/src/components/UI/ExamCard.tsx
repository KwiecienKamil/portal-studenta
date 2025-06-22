import { type FC } from "react";
import type { ExamCardProps } from "../../types/ExamCardProps";

const ExamCard: FC<ExamCardProps> = ({
  id,
  subject,
  term,
  date,
  note,
  onDelete,
}) => {
  return (
    <li
      key={id}
      className="border p-3 rounded-lg bg-white shadow-md flex justify-between items-center"
    >
      <div>
        <p>
          <strong>Przedmiot:</strong> {subject}
        </p>
        <p>
          <strong>Data:</strong> {date}
        </p>
        <p>
          <strong>Semestr:</strong> {term}
        </p>
        <p>
          <strong>Notatka:</strong> {note}
        </p>
      </div>
      <button
        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-200 cursor-pointer"
        onClick={() => {
          if (id !== undefined) {
            onDelete(id.toString());
          }
        }}
      >
        Usuń
      </button>
    </li>
  );
};

export default ExamCard;
