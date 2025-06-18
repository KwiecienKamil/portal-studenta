import Wrapper from "./components/Wrapper";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import AddExamPopup from "./components/UI/AddExamPopup";
import AddExamForm, { type ExamData } from "./components/AddExamForm";

function App() {
  const [showAddExamPopup, setShowAddExamPopup] = useState(false);

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
              onSubmit={(data: ExamData) => {
                console.log("Dodano egzamin:", data);
                setShowAddExamPopup(false);
              }}
            />
          </AddExamPopup>
        )}
      </div>
    </Wrapper>
  );
}

export default App;
