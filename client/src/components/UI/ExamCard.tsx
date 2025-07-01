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
      className="py-4 pr-4 rounded-lg bg-[linear-gradient(90deg,#34e89e_16%,#0f3443_90%)] animate-wind text-black shadow-sm flex justify-between items-center scrollbar-thumb-accent scrollbar-track-sky-300"
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
