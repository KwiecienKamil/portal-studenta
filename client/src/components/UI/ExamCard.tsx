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
    <div
      key={id}
      className="p-3 rounded-lg bg-smokewhite text-dark shadow-md flex justify-between items-center backdrop-blur-md backdrop-saturate-150"
    >
      <div>
        <p>
          <strong>Przedmiot:</strong> {subject}
        </p>
        <p>
          <strong>Data:</strong> {date}
        </p>
        <p>
          <strong>Termin nr:</strong> {term}
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
    </div>
  );
};

export default ExamCard;
