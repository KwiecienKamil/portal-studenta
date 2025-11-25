import Wrapper from "./components/Wrapper";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import AddExamPopup from "./components/UI/AddExamPopup";
import AddExamForm, { type ExamDataForPopup } from "./components/AddExamForm";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import {
  addExam,
  fetchExams,
  removeExam,
  updateExam,
  type ExamData,
} from "./features/exams/examSlice";
import ExamCard from "./components/UI/ExamCard";
import { useInitApp } from "./hooks/useInitApp";
import TermsModal from "./components/TermsModal";
import { setUser } from "./features/auth/authSlice";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { robotoRegularBase64 } from "./utils/Helpers";
import Login from "./pages/Login";
import confetti from "canvas-confetti";
import { MdViewColumn } from "react-icons/md";
import { PiTextColumnsBold } from "react-icons/pi";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [showAddExamPopup, setShowAddExamPopup] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [secondCardView, setSecondCardView] = useState(false);
  const [examToEdit, setExamToEdit] = useState<
    (ExamData & { id: number }) | null
  >(null);
  const [loadingExams, setLoadingExams] = useState(true);
  const [examLoadError, setExamLoadError] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const exams = useSelector((state: RootState) => state.exams.exams);
  const completed = exams.filter((e) => e.completed).length;
  const notCompleted = exams.length - completed;
  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    let retries = 0;
    const maxRetries = 4;

    const loadExams = async () => {
      if (!user) return;
      setLoadingExams(true);
      setExamLoadError(false);
      try {
        await dispatch(fetchExams(user.google_id));
      } catch (error) {
        if (retries < maxRetries) {
          retries++;
          setTimeout(loadExams, 2000);
        } else {
          console.error("Nie udało się załadować egzaminów po kilku próbach.");
          setExamLoadError(true);
        }
      } finally {
        setLoadingExams(false);
      }
    };
    loadExams();
  }, [user, dispatch]);

  const handleExportToPDF = () => {
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
    doc.setFont("Roboto");
    doc.text("Statystyki egzaminów:", 10, 10);
    doc.text(`Zaliczone: ${completed}`, 10, 20);
    doc.text(`Nie zaliczone: ${notCompleted}`, 10, 30);

    doc.save("egzaminy.pdf");
  };

  {
    (user?.is_premium || user?.isBetaTester || user?.google_id === "demo123") &&
      exams.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Statystyki egzaminów</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Łączna liczba egzaminów: {exams.length}</li>
            <li>
              Egzaminy z 1. terminu:
              {exams.filter((e) => e.term === "1").length}
            </li>
            <li>
              Egzaminy z 2. terminu:
              {exams.filter((e) => e.term === "2").length}
            </li>
            <li>
              Egzaminy z 3. terminu:
              {exams.filter((e) => e.term === "3").length}
            </li>
          </ul>
        </div>
      );
  }
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Wrapper>
          <div className="h-full flex items-center justify-center w-full p-2 sm:p-4 flex-1  rounded-xl overflow-y-scroll scroll-container">
            <Login />
          </div>
        </Wrapper>
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

  const handleAddExam = async (
    data: Omit<ExamDataForPopup, "user_id" | "id" | "completed">
  ) => {
    if (!user) return;

    if (user.google_id === "demo123") {
      const tempExam: ExamData = {
        ...data,
        id: Date.now(),
        completed: false,
        user_id: user.google_id,
      };
      dispatch(addExam(tempExam));
      setShowAddExamPopup(false);
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
    if (user?.google_id === "demo123") {
      dispatch(updateExam(updatedExam));
      setExamToEdit(null);
      return;
    }
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

      const updatedExamFromServer = await response.json();

      dispatch(updateExam(updatedExamFromServer));
      setExamToEdit(null);
    } catch (error) {
      console.error("Nie udało się edytować egzaminu:", error);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const exam = exams.find((e) => e.id === id);
      if (!exam) return;

      const isCompleting = !exam.completed;
      const updated = { ...exam, completed: !exam.completed };

      if (user?.google_id === "demo123") {
        dispatch(updateExam(updated));
        if (isCompleting) triggerConfetti();
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/exams/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );

      if (!response.ok) throw new Error("Nie udało się zaktualizować");
      const updatedExamFromServer = await response.json();
      dispatch(updateExam(updatedExamFromServer));
      if (isCompleting) {
        triggerConfetti();
      }
    } catch (error) {
      console.error("Toggle complete error", error);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (user?.google_id === "demo123") {
      dispatch(removeExam(Number(examId)));
      return;
    }
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
      <Sidebar showSidebarButton={true} />
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
              {exams.length > 0 ? (
                <button
                  onClick={() => setSecondCardView(!secondCardView)}
                  className="h-full px-4 py-1 bg-purple-700 hover:bg-purple-800  rounded-lg text-white font-semibold  cursor-pointer duration-300"
                >
                  {secondCardView ? (
                    <PiTextColumnsBold className="text-xl" />
                  ) : (
                    <MdViewColumn className="text-xl" />
                  )}
                </button>
              ) : null}
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
                      onDelete={handleDeleteExam}
                      onEdit={(exam) =>
                        setExamToEdit({
                          ...exam,
                          term: exam.term as "1" | "2" | "3",
                          user_id: (exam as ExamData).user_id,
                        })
                      }
                      onToggleComplete={handleToggleComplete}
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
            <button
              onClick={() => handleExportToPDF()}
              className="px-4 py-1 bg-purple-700 hover:bg-purple-800 rounded-lg text-white font-semibold text-sm sm:text-[16px] cursor-pointer duration-300"
            >
              Eksportuj egzaminy do PDF
            </button>
          ) : null}
        </div>
        {exams.length > 0 && (
          <div className="mt-6 p-4 bg-light rounded-lg flex flex-col md:flex-row items-center justify-center gap-4 text-sm sm:text-md">
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold mb-2">
                Statystyki egzaminów
              </h3>
              <ul className="list-disc pl-5 text-gray-700 mb-4 text-md lg:text-lg">
                <li>Łączna liczba egzaminów: {exams.length}</li>
                <li>Zaliczone: {exams.filter((e) => e.completed).length}</li>
                <li>
                  Nie zaliczone: {exams.filter((e) => !e.completed).length}
                </li>
              </ul>
            </div>
            <div className="w-[200px] lg:w-[300px]">
              <Pie
                data={{
                  labels: ["Zaliczone", "Nie zaliczone"],
                  datasets: [
                    {
                      data: [
                        exams.filter((e) => e.completed).length,
                        exams.filter((e) => !e.completed).length,
                      ],
                      backgroundColor: ["#41A67E", "#FF5252"],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
            {user?.is_premium || user?.isBetaTester ? (
              <div className="text-dark">
                <h4 className="font-semibold mb-4 text-blue-700  lg:text-xl">
                  Dodatkowe statystyki:
                </h4>
                <ul className="list-disc pl-6 space-y-2 text-sm lg:text-md leading-relaxed">
                  <li>
                    Egzaminy z 0 terminu:{" "}
                    <span className="font-medium">
                      {exams.filter((e) => e.term === "0").length}
                    </span>
                  </li>
                  <li>
                    Egzaminy z 1 terminu:{" "}
                    <span className="font-medium">
                      {exams.filter((e) => e.term === "1").length}
                    </span>
                  </li>
                  <li>
                    Egzaminy z 2 terminu:{" "}
                    <span className="font-medium">
                      {exams.filter((e) => e.term === "2").length}
                    </span>
                  </li>
                  <li>
                    Egzaminy z 3 terminu:{" "}
                    <span className="font-medium">
                      {exams.filter((e) => e.term === "3").length}
                    </span>
                  </li>
                  <li>
                    Procent zaliczonych egzaminów:{" "}
                    <span className="font-medium">
                      {(
                        (exams.filter((e) => e.completed).length /
                          exams.length) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
      {user && showTerms && <TermsModal onAccept={acceptTerms} />}
    </Wrapper>
  );
}

export default App;
