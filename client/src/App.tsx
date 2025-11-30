import Wrapper from "./components/Wrapper";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import AddExamPopup from "./components/UI/AddExamPopup";
import AddExamForm from "./components/AddExamForm";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { type ExamData } from "./features/exams/examSlice";
import ExamCard from "./components/UI/ExamCard";
import { useInitApp } from "./hooks/useInitApp";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Login from "./pages/Login";
import { useExams } from "./hooks/useExams";
import ExportPDFButton from "./components/ExportPDFButton";
import ViewToggle from "./components/UI/ViewToggle";
import ExamStats from "./components/UI/ExamStats";
import TermsAccept from "./components/UI/TermsAccept";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [showAddExamPopup, setShowAddExamPopup] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [secondCardView, setSecondCardView] = useState(false);
  const [examToEdit, setExamToEdit] = useState<
    (ExamData & { id: number }) | null
  >(null);
  const [authToken, setAuthToken] = useState<string>("");
  const user = useSelector((state: RootState) => state.auth.user);

  useInitApp();

  const { exams, loading, error, add, edit, remove, toggleComplete } =
    useExams();

  useEffect(() => {
    if (user) {
      if (!user.terms_accepted) {
        setShowTerms(!showTerms);
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Wrapper>
          <div className="h-full flex items-center justify-center w-full p-2 sm:p-4 flex-1  rounded-xl overflow-y-scroll scroll-container">
            <Login setAuthToken={setAuthToken} />
          </div>
        </Wrapper>
      </div>
    );
  }

  return (
    <Wrapper>
      <Sidebar showSidebarButton={true} setAuthToken={setAuthToken} />
      <div className="max-h-[100%] p-2 sm:p-4 flex-1 bg-light text-dark rounded-xl overflow-y-scroll z-10 md:z-20 main-scrollbar lg:scroll-container">
        <div>
          {user && (
            <div className="relative flex items-center gap-4">
              <button
                onClick={() => setShowAddExamPopup(true)}
                className="px-4 py-1 bg-green-700 hover:bg-green-800 rounded-lg text-white cursor-pointer duration-300 font-semibold text-sm md:text-[16px]"
              >
                Dodaj egzamin
              </button>
              <ViewToggle
                isSecondView={secondCardView}
                onToggle={() => setSecondCardView(!secondCardView)}
                hasExams={exams.length > 0}
              />
            </div>
          )}
          {showAddExamPopup && (
            <AddExamPopup onClose={() => setShowAddExamPopup(false)}>
              <h2 className="font-bold mb-2 text-xs sm:text-md lg:text-xl">
                Dodaj egzamin
              </h2>
              <p className="mb-4 text-gray-600">Uzupełnij informację</p>
              <AddExamForm
                onCancel={() => setShowAddExamPopup(false)}
                onSubmit={(data) => {
                  add(data);
                  setShowAddExamPopup(false);
                }}
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
                  edit({
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
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="loader border-4 border-blue-300 border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-red-600 text-center">
                  Nie udało się załadować egzaminów. Próba ponowienia...
                </div>
              ) : exams.length === 0 ? (
                <p className="text-gray-500">Brak egzaminów.</p>
              ) : (
                <div
                  className={`${
                    secondCardView
                      ? `flex flex-col justify-center`
                      : `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
                  }  gap-4 overflow-y-scroll scrollbar-none`}
                >
                  {exams.map((exam) => (
                    <ExamCard
                      id={exam.id!}
                      subject={exam.subject}
                      term={exam.term}
                      date={exam.date}
                      note={exam.note}
                      completed={exam.completed}
                      onDelete={remove}
                      onEdit={(exam) =>
                        setExamToEdit({
                          ...exam,
                          term: exam.term as "1" | "2" | "3",
                          user_id: (exam as ExamData).user_id,
                        })
                      }
                      onToggleComplete={toggleComplete}
                      secondCardView={secondCardView}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {exams.length === 0 ? (
          <ul className="mt-4 list-disc list-inside  text-black">
            <li>Dodaj egzaminy wraz z ważnymi informacjami.</li>
            <li>Zarządzaj egzaminami i materiałami do nauki</li>
            <li>Otrzymuj przypomnienia na maila tydzień przed egzaminem</li>
            <li>Sprawdzaj statystyki dotyczące egzaminów</li>
            <li>
              Korzystaj z generatora quizu AI, który pomaga w przygotowaniu
            </li>
          </ul>
        ) : null}
        <div className="flex gap-4 mt-4">
          {(user?.is_premium ||
            user?.isBetaTester ||
            user?.google_id === "demo123") &&
          exams.length > 0 ? (
            <ExportPDFButton
              exams={exams}
              allowed={
                user?.is_premium ||
                user?.isBetaTester ||
                user?.google_id === "demo123"
              }
            />
          ) : null}
        </div>
        {exams.length > 0 && (
          <ExamStats
            exams={exams}
            isPremium={user?.is_premium}
            isBetaTester={user?.isBetaTester}
          />
        )}
      </div>
      <TermsAccept user={user} authToken={authToken} />
    </Wrapper>
  );
}

export default App;
