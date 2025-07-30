import { type FC, useState } from "react";
import type { ExamCardProps } from "../../types/ExamCardProps";
import happyMozg from "../../assets/happy-brain.png";

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
      className={`py-4 pr-4 rounded-lg ${
        completed ? "bg-accent" : "bg-blue-300"
      } animate-wind text-black shadow-sm flex justify-between items-start relative`}
    >
      <div className="h-[120px] xl:h-[140px] w-[95%] break-all overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-track-transparent">
        <div className="relative flex items-center gap-4 text-sm sm:text-md">
          <p className="bg-smokewhite pr-4 pl-4 rounded-r-sm text-dark text-xs sm:text-sm mb-1">
            <strong>{date}</strong>
          </p>
          {!completed ? (
            <p>
              <strong>Termin: </strong>
              <span className="bg-dark text-white rounded-full px-2 text-sm sm:text-lg font-semibold">
                {term}
              </span>
            </p>
          ) : null}
        </div>
        <p className="text-sm sm:text-xl mt-2 pl-4 font-subject text-dark">
          <strong>{subject}</strong>
        </p>
        {!completed ? (
          <div>
            <p className="pl-4 text-xs sm:text-sm mt-1">
              <strong>Notatka: </strong>
            </p>
            <div className=" text-dark min-h-[25px] rounded-sm pl-4 text-sm">
              <span>{note}</span>
            </div>
          </div>
        ) : null}
      </div>
      {completed ? (
        <div className="absolute right-10 top-4 text-white text-lg font-bold px-2 py-1 rounded-full select-none transform -rotate-5">
          ZALICZONE
          <img
            src={happyMozg}
            alt="Ciesząca się emotikonka mózgu"
            className="max-w-[60px] md:max-w-[80px] mt-2 mx-auto animate-bounce"
          />
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
                onDelete(id.toString());
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
            {completed ? "❌ Nie zaliczone" : "✅ Zaliczone"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamCard;
