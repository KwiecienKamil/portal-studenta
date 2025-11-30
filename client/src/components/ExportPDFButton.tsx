import { type FC } from "react";
import { useExportPDF } from "../hooks/useExportPDF";
import type { ExamData } from "../features/exams/examSlice";

interface Props {
  exams: ExamData[];
  allowed?: boolean;
}

const ExportPDFButton: FC<Props> = ({ exams, allowed = true }) => {
  const { exportToPDF } = useExportPDF(exams);

  if (!allowed || exams.length === 0) return null;

  return (
    <button
      onClick={exportToPDF}
      className="px-4 py-1 bg-purple-700 hover:bg-purple-800 rounded-lg text-white font-semibold text-sm sm:text-[16px] cursor-pointer duration-300"
    >
      Eksportuj egzaminy do PDF
    </button>
  );
};

export default ExportPDFButton;
