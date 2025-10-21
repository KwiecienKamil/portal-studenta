import { useState } from "react";
import AddExamPopup from "./UI/AddExamPopup";
import AddExamForm, { type ExamDataForPopup } from "./AddExamForm";
import ExamCard from "./UI/ExamCard";
import { type ExamData } from "../features/exams/examSlice";

interface ExamSectionProps {
  exams: ExamData[];
  user: {
    name: string;
    email: string;
    picture: string;
    google_id: string;
    terms_accepted: boolean;
    is_premium?: boolean | undefined;
    isBetaTester?: boolean | undefined;
    isProfilePublic?: boolean | undefined;
  };
  loadingExams: boolean;
  examLoadError: boolean;
  handleAddExam: (
    data: Omit<ExamDataForPopup, "user_id" | "id" | "completed">
  ) => void;
  handleEditExam: (exam: ExamData & { id: number }) => void;
  handleToggleComplete: (id: number) => void;
  handleDeleteExam: (id: string) => void;
}

const ExamsSection = ({
  exams,
  user,
  loadingExams,
  examLoadError,
  handleAddExam,
  handleEditExam,
  handleToggleComplete,
  handleDeleteExam,
}: ExamSectionProps) => {
  const [showAddExamPopup, setShowAddExamPopup] = useState(false);
  const [examToEdit, setExamToEdit] = useState<
    (ExamData & { id: number }) | null
  >(null);

  return (
    <div>
      {user && (
        <button
          onClick={() => setShowAddExamPopup(true)}
          className="px-4 py-1 bg-green-700 hover:bg-dark hover:text-accent rounded-lg text-white cursor-pointer duration-300 font-semibold text-sm md:text-[16px]"
        >
          Dodaj egzamin
        </button>
      )}

      {showAddExamPopup && (
        <AddExamPopup onClose={() => setShowAddExamPopup(false)}>
          <h2 className="font-bold mb-2 text-xs sm:text-md lg:text-xl">
            Dodaj egzamin
          </h2>
          <p className="mb-4 text-gray-600">Uzupełnij informację</p>
          <AddExamForm
            onCancel={() => setShowAddExamPopup(false)}
            onSubmit={handleAddExam}
          />
        </AddExamPopup>
      )}

      {examToEdit && (
        <AddExamPopup onClose={() => setExamToEdit(null)}>
          <h2 className="text-xl font-bold mb-2">Edytuj egzamin</h2>
          <p className="mb-4 text-gray-600">Zmień informację</p>
          <AddExamForm
            initialData={examToEdit}
            onCancel={() => setExamToEdit(null)}
            onSubmit={(data) =>
              handleEditExam({
                ...data,
                id: examToEdit.id,
                user_id: examToEdit.user_id,
              })
            }
          />
        </AddExamPopup>
      )}

      {user && (
        <div className="mt-2">
          <h3 className="text-sm sm:text-md lg:text-lg font-semibold mb-2">
            Twoje egzaminy:
          </h3>

          {loadingExams ? (
            <div className="flex justify-center items-center h-40">
              <div className="loader border-4 border-blue-300 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
            </div>
          ) : examLoadError ? (
            <div className="text-red-600 text-center">
              Nie udało się załadować egzaminów. Próba ponowienia...
            </div>
          ) : exams.length === 0 ? (
            <p className="text-gray-500">Brak egzaminów.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[23rem] overflow-y-scroll scrollbar-none">
              {exams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  id={exam.id!}
                  subject={exam.subject}
                  term={exam.term}
                  date={exam.date}
                  note={exam.note}
                  completed={exam.completed}
                  user_id={exam.user_id}
                  onDelete={handleDeleteExam}
                  onEdit={(exam) =>
                    setExamToEdit({
                      ...exam,
                      term: exam.term as "1" | "2" | "3",
                      user_id: exam.user_id,
                    })
                  }
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamsSection;
