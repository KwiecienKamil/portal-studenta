import { type FC } from "react";
import { MdViewColumn } from "react-icons/md";
import { PiTextColumnsBold } from "react-icons/pi";

interface ViewToggleProps {
  isSecondView: boolean;
  onToggle: () => void;
  hasExams: boolean;
}

const ViewToggle: FC<ViewToggleProps> = ({
  isSecondView,
  onToggle,
  hasExams,
}) => {
  if (!hasExams) return null;

  return (
    <button
      onClick={onToggle}
      className="h-full px-4 py-1 bg-purple-700 hover:bg-purple-800 rounded-lg text-white font-semibold cursor-pointer duration-300"
    >
      {isSecondView ? (
        <PiTextColumnsBold className="text-xl" />
      ) : (
        <MdViewColumn className="text-xl" />
      )}
    </button>
  );
};

export default ViewToggle;
