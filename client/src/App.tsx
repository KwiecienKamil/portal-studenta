import Wrapper from "./components/Wrapper";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import AddExamPopup from "./components/UI/AddExamPopup";
import AddExamForm, { type ExamData } from "./components/AddExamForm";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import { addExam, removeExam } from "./features/exams/examSlice";
import ExamCard from "./components/UI/ExamCard";
import { useInitApp } from "./hooks/useInitApp";
import TermsModal from "./components/TermsModal";
import { setUser } from "./features/auth/authSlice";
import jsPDF from "jspdf";
import QuizGenerator from "./components/QuizGenerator";

function App() {
  const [showAddExamPopup, setShowAddExamPopup] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [examToEdit, setExamToEdit] = useState<
    (ExamData & { id: number }) | null
  >(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const exams = useSelector((state: RootState) => state.exams.exams);
  const dispatch = useDispatch();

  useInitApp();

  useEffect(() => {
    if (user) {
      if (!user.terms_accepted) {
        setShowTerms(true);
      } else {
        setShowTerms(false);
      }
    }
  }, [user]);

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Lista egzaminów:", 10, 10);

    exams.forEach((exam, index) => {
      const y = 20 + index * 30;
      doc.setFontSize(12);
      doc.text(`Przedmiot: ${exam.subject}`, 10, y);
      doc.text(`Termin: ${exam.term}`, 10, y + 7);
      doc.text(`Data: ${exam.date}`, 10, y + 14);
      doc.text(`Notatka: ${exam.note || "-"}`, 10, y + 21);
    });

    doc.save("egzaminy.pdf");
  };

  {
    user?.is_premium && exams.length > 0 && (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">📊 Statystyki egzaminów</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Łączna liczba egzaminów: {exams.length}</li>
          <li>
            Egzaminy z 1. terminu: {exams.filter((e) => e.term === "1").length}
          </li>
          <li>
            Egzaminy z 2. terminu: {exams.filter((e) => e.term === "2").length}
          </li>
          <li>
            Egzaminy z 3. terminu: {exams.filter((e) => e.term === "3").length}
          </li>
        </ul>
      </div>
    );
  }

  const acceptTerms = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/accept-terms`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ google_id: user.google_id }),
        }
      );

      if (!res.ok) throw new Error("Błąd akceptacji regulaminu");

      const userRes = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/${user.google_id}`
      );
      if (!userRes.ok) throw new Error("Nie udało się pobrać użytkownika");
      const updatedUser = await userRes.json();
      dispatch(setUser(updatedUser));
      setShowTerms(false);
    } catch (error) {
      console.error("Nie udało się zaakceptować regulaminu:", error);
    }
  };

  const handleAddExam = async (data: ExamData) => {
    if (!user) {
      console.error("Brak zalogowanego użytkownika");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          user_id: user.google_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Błąd zapisu egzaminu do bazy danych");
      }

      const savedExam = await response.json();
      dispatch(addExam(savedExam));
      setShowAddExamPopup(false);
      window.location.reload();
    } catch (error) {
      console.error("Nie udało się zapisać egzaminu:", error);
    }
  };

  const handleEditExam = async (updatedExam: ExamData & { id: number }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/exams/${updatedExam.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedExam),
        }
      );

      if (!response.ok) throw new Error("Błąd podczas aktualizacji");

      window.location.reload();
    } catch (error) {
      console.error("Nie udało się edytować egzaminu:", error);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/exams/${examId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania egzaminu");
      }

      dispatch(removeExam(Number(examId)));
    } catch (error) {
      console.error("Nie udało się usunąć egzaminu:", error);
    }
  };

  return (
    <Wrapper>
      <Sidebar />
      <div className="p-4 flex-1 bg-smokewhite text-dark rounded-xl">
        <div>
          {user && (
            <button
              onClick={() => setShowAddExamPopup(true)}
              className="px-4 py-1 bg-green-700 hover:bg-green-500 rounded-lg text-white cursor-pointer duration-200"
            >
              Dodaj egzamin
            </button>
          )}

          {showAddExamPopup && (
            <AddExamPopup onClose={() => setShowAddExamPopup(false)}>
              <h2 className="text-xl font-bold mb-2">Dodaj egzamin</h2>
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
                  handleEditExam({ ...data, id: examToEdit.id })
                }
              />
            </AddExamPopup>
          )}

          {user && (
            <div className="mt-2">
              <h3 className="text-lg font-semibold mb-2">Twoje egzaminy:</h3>
              {exams.length === 0 ? (
                <p className="text-gray-500">Brak egzaminów.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4 max-h-[30rem] overflow-y-scroll scrollbar-none">
                  {exams.map((exam) => (
                    <div key={exam.id}>
                      <ExamCard
                        id={exam.id!}
                        subject={exam.subject}
                        term={exam.term}
                        date={exam.date}
                        note={exam.note}
                        onDelete={handleDeleteExam}
                        onEdit={(exam) =>
                          setExamToEdit({
                            ...exam,
                            term: exam.term as "1" | "2" | "3",
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {user?.is_premium && exams.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => handleExportToPDF()}
              className="px-4 py-1 bg-purple-700 hover:bg-purple-500 rounded-lg text-white"
            >
              Eksportuj egzaminy do PDF
            </button>
          </div>
        )}
        {user?.is_premium && (
          <div className="mt-6">
            <QuizGenerator />
          </div>
        )}
      </div>
      {user && showTerms && <TermsModal onAccept={acceptTerms} />}
    </Wrapper>
  );
}

export default App;
