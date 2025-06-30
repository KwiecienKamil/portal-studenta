export interface ExamCardProps {
  id: number;
  subject: string;
  term: string;
  date: string;
  note: string;
  onDelete: (id: string) => void;
  onEdit?: (exam: {
    id: number;
    subject: string;
    term: string;
    date: string;
    note: string;
  }) => void;
}
