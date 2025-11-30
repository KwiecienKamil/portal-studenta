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
  secondCardView,
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`py-4 pr-1 md:pr-4 rounded-lg ${
        completed ? "bg-green-600" : "bg-accent"
      } animate-wind text-light shadow-lg flex justify-between items-start relative`}
    >
      <div
        className={`${
          secondCardView ? `flex justify-between` : `h-[150px] xl:h-[140px]`
        } w-full  overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-track-transparent`}
      >
        <div>
          <div
            className={`relative flex items-center gap-4 text-sm sm:text-md`}
          >
            <p className="bg-light pr-4 pl-4 rounded-r-sm text-dark text-xs sm:text-sm mb-1">
              <strong>{date}</strong>
            </p>
          </div>
          {!completed ? (
            <div className="pl-4">
              <strong>Termin: </strong>
              <span className="bg-light text-dark rounded-full px-2 text-lg font-semibold">
                {term}
              </span>
            </div>
          ) : null}
          <p className={`text-sm sm:text-xl py-2 pl-4 font-subject text-light`}>
            <strong>{subject}</strong>
          </p>
        </div>
        {!completed ? (
          <div
            className={`${
              secondCardView
                ? `max-w-1/2 pr-8 flex items-center`
                : `min-h-[25px] pl-4`
            }`}
          >
            <div className={`text-light mt-1 rounded-sm text-sm`}>
              <span>{note}</span>
            </div>
          </div>
        ) : null}
      </div>
      {completed ? (
        <div className="text-accent text-lg font-bold px-2 py-1 rounded-full ">
          <span className="absolute bottom-8 right-8 -rotate-6">ZALICZONE</span>
        </div>
      ) : null}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setShowActions((prev) => !prev)}
          className="text-white text-xl font-bold px-2 rounded hover:bg-white hover:text-black transition cursor-pointer"
        >
          ⋮
        </button>
      </div>

      {showActions && (
        <div className="absolute top-10 right-2 flex flex-col gap-2 z-10 bg-white p-2 rounded shadow-md text-xs sm:text-md">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 cursor-pointer"
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
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 cursor-pointer"
            onClick={() => {
              if (id !== undefined) {
                onDelete(id);
                setShowActions(false);
              }
            }}
          >
            Usuń
          </button>
          <button
            className={`px-3 py-1 rounded-md cursor-pointer ${
              completed ? "bg-red-500" : "bg-green-600"
            } text-white hover:opacity-90`}
            onClick={() => {
              if (id !== undefined) {
                onToggleComplete?.(id);
                setShowActions(false);
              }
            }}
          >
            {completed ? "Nie zaliczone" : "Zaliczone"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamCard;
