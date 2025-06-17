import Wrapper from "./components/Wrapper";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import AddExamPopup from "./components/UI/AddExamPopup";

function App() {
  const [showAddExamPopup, setShowAddExamPopup] = useState(false);
  return (
    <Wrapper>
      <Sidebar />
      <div className="p-4">
      <button onClick={() => setShowAddExamPopup(true)} className="px-4 py-1 bg-green-700 hover:bg-green-500 rounded-lg text-white cursor-pointer duration-200">Dodaj egzamin</button>
        {showAddExamPopup && (
        <AddExamPopup onClose={() => setShowAddExamPopup(false)}>
          <h2 className="text-xl font-bold mb-2">Hello from the Popup!</h2>
          <p className="mb-4 text-gray-600">
            Click outside or the button below to close it.
          </p>
          <button
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => setShowAddExamPopup(false)}
          >
            Close
          </button>
        </AddExamPopup>
      )}
      </div>
    </Wrapper>
  );
}

export default App;
