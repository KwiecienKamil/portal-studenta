import { type FC, useState } from "react";
import type { ExamCardProps } from "../../types/ExamCardProps";

const ExamCard: FC<ExamCardProps> = ({
  id,
  subject,
  term,
  date,
  note,
  onDelete,
  onEdit,
  completed,
  onToggleComplete,
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      key={id}
      className="py-4 pr-4 rounded-lg bg-[linear-gradient(90deg,#34e89e_16%,#0f3443_90%)] animate-wind text-black shadow-sm flex justify-between items-start relative"
    >
      <div className="h-[140px] w-[80%] break-all overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-track-transparent">
        <div className="relative flex items-center gap-4">
          <p className="bg-smokewhite pr-4 pl-4 rounded-r-sm text-dark">
            <strong>{date}</strong>
          </p>
          <p>
            <strong>Termin: </strong>
            <span className="bg-dark text-white rounded-full px-2 text-lg font-semibold">
              {term}
            </span>
          </p>
        </div>
        <p className="text-xl mt-2 pl-4 font-subject text-dark">
          <strong>{subject}</strong>
        </p>
        <p className="pl-4 text-sm mt-1">
          <strong>Notatka: </strong>
        </p>
        <div className=" text-dark min-h-[25px] rounded-sm pl-4">
          <span>{note}</span>
        </div>
      </div>

      {completed && (
        <div className="absolute top-2 right-24 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg select-none">
          ZALICZONE
        </div>
      )}

      <div className="absolute top-2 right-2">
        <button
          onClick={() => setShowActions((prev) => !prev)}
          className="text-white text-xl font-bold px-2 rounded hover:bg-white hover:text-black transition"
        >
          ⋮
        </button>
      </div>

      {showActions && (
        <div className="absolute top-10 right-2 flex flex-col gap-2 z-10 bg-white p-2 rounded shadow-md">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            onClick={() => {
              if (id !== undefined) {
                onEdit?.({ id, subject, term, date, note });
                setShowActions(false);
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
                setShowActions(false);
              }
            }}
          >
            Usuń
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              completed ? "bg-green-600" : "bg-yellow-600"
            } text-white hover:opacity-90`}
            onClick={() => {
              if (id !== undefined) {
                onToggleComplete?.(id);
                setShowActions(false);
              }
            }}
          >
            {completed ? "✅ Zaliczone" : "❌ Nie zaliczone"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamCard;
