export interface ExamCardProps {
  id: number;
  subject: string;
  term: string;
  date: string;
  note: string;
  completed?: boolean;
  user_id: string;
  onDelete: (id: string) => void;
  onEdit?: (exam: {
    id: number;
    subject: string;
    term: string;
    date: string;
    note: string;
    user_id: string;
  }) => void;
  onToggleComplete?: (id: number) => void;
}
