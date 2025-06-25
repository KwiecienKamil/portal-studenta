import React from "react";

interface TermsModalProps {
  onAccept: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Regulamin</h2>
        <p className="mb-4">
          Tutaj wstaw tekst regulaminu albo link do pełnej treści...
        </p>
        <button
          onClick={onAccept}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Akceptuję regulamin
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
