import React, { useState } from "react";

export interface ExamData {
  subject: string;
  date: string;
  term: "1" | "2" | "3";
  note: string;
}

interface AddExamFormProps {
  onCancel: () => void;
  onSubmit: (data: ExamData) => void;
}

const AddExamForm: React.FC<AddExamFormProps> = ({ onCancel, onSubmit }) => {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [term, setTerm] = useState<"1" | "2" | "3" | "">("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !date || !term) return;

    onSubmit({
      subject,
      date,
      term,
      note,
    });

    setSubject("");
    setDate("");
    setTerm("");
    setNote("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nazwa przedmiotu
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data egzaminu
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Termin
        </label>
        <select
          value={term}
          onChange={(e) => setTerm(e.target.value as "1" | "2" | "3")}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          required
        >
          <option value="">Wybierz termin</option>
          <option value="1">Termin 1</option>
          <option value="2">Termin 2</option>
          <option value="3">Termin 3</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notatka
        </label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          placeholder="Dodatkowe informacje..."
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
          onClick={onCancel}
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition cursor-pointer"
        >
          Dodaj
        </button>
      </div>
    </form>
  );
};

export default AddExamForm;
