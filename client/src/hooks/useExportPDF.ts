import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { robotoRegularBase64 } from "../utils/Helpers";
import { type ExamData } from "../features/exams/examSlice";

export const useExportPDF = (exams: ExamData[]) => {
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.addFileToVFS("Roboto-Regular.ttf", robotoRegularBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    const rows = exams.map((exam) => [
      exam.subject,
      exam.term,
      exam.date,
      exam.note || "-",
    ]);

    const completed = exams.filter((e) => e.completed).length;
    const notCompleted = exams.length - completed;

    doc.text("Lista egzaminów:", 10, 10);

    autoTable(doc, {
      head: [["Przedmiot", "Termin", "Data", "Notatka"]],
      body: rows,
      startY: 15,
      styles: { font: "Roboto" },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
      },
    });

    doc.addPage();
    doc.text("Statystyki egzaminów:", 10, 10);
    doc.text(`Zaliczone: ${completed}`, 10, 20);
    doc.text(`Nie zaliczone: ${notCompleted}`, 10, 30);

    doc.save("egzaminy.pdf");
  };

  return { exportToPDF };
};
