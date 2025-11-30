export interface ExamCardProps {
  id: number;
  subject: string;
  term: string;
  date: string;
  note: string;
  completed?: boolean;
  onDelete: (id: number) => void | Promise<void>;
  onEdit?: (exam: {
    id: number;
    subject: string;
    term: string;
    date: string;
    note: string;
  }) => void;
  onToggleComplete?: (id: number) => void;
  secondCardView: boolean;
}
