import { type FC } from "react";
import type { ExamCardProps } from "../../types/ExamCardProps";

const ExamCard: FC<ExamCardProps> = ({
  id,
  subject,
  term,
  date,
  note,
  onDelete,
  onEdit,
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
      <div className="flex flex-col gap-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          onClick={() => {
            if (id !== undefined) {
              onEdit?.({ id, subject, term, date, note });
            }
          }}
        >
          Edytuj
        </button>
        <button
          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500"
          onClick={() => {
            if (id !== undefined) {
              onDelete(id.toString());
            }
          }}
        >
          Usuń
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
