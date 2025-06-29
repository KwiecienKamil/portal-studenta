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
      className="p-3 rounded-lg bg-[linear-gradient(90deg,#34e89e_16%,#0f3443_90%)] animate-wind text-black shadow-md flex justify-between items-center"
    >
      <div>
        <p>
          <strong>{subject}</strong>
        </p>
        <p>
          <strong>{date}</strong>
        </p>
        <p>
          <strong>Termin:</strong> {term}
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
