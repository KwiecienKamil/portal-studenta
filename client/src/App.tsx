import Wrapper from "./components/Wrapper";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import AddExamPopup from "./components/UI/AddExamPopup";
import AddExamForm, { type ExamData } from "./components/AddExamForm";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import { addExam } from "./features/exams/examSlice";

function App() {
  const [showAddExamPopup, setShowAddExamPopup] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const exams = useSelector((state: RootState) => state.exams.exams);

  console.log(exams);

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
    } catch (error) {
      console.error("❌ Nie udało się zapisać egzaminu:", error);
    }
  };

  return (
    <Wrapper>
      <Sidebar />
      <div className="p-4">
        <button
          onClick={() => setShowAddExamPopup(true)}
          className="px-4 py-1 bg-green-700 hover:bg-green-500 rounded-lg text-white cursor-pointer duration-200"
        >
          Dodaj egzamin
        </button>
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
      </div>
    </Wrapper>
  );
}

export default App;
