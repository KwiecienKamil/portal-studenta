import type { ExamData } from "../components/AddExamForm";

export type ExamCardProps = {
  id?: number;
  subject: string;
  term: "1" | "2" | "3";
  date: string;
  note?: string;
  onDelete: (examId: string) => Promise<void>;
};
