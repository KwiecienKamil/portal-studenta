import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  addExam,
  fetchExams,
  removeExam,
  updateExam,
  type ExamData,
} from "../features/exams/examSlice";
import confetti from "canvas-confetti";

export const useExams = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const exams = useSelector((state: RootState) => state.exams.exams);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;

    let retries = 0;
    const maxRetries = 4;

    const loadExams = async () => {
      setLoading(true);
      setError(false);

      try {
        await dispatch(fetchExams(user.google_id)).unwrap();
      } catch (err) {
        if (retries < maxRetries) {
          retries++;
          setTimeout(loadExams, 2000);
        } else {
          console.error("Nie udało się załadować egzaminów.");
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [user, dispatch]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const add = async (data: Omit<ExamData, "id" | "completed" | "user_id">) => {
    if (!user) return;

    if (user.google_id === "demo123") {
      const fakeExam: ExamData = {
        ...data,
        id: Date.now(),
        completed: false,
        user_id: user.google_id,
      };
      dispatch(addExam(fakeExam));
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, user_id: user.google_id }),
    });

    if (!res.ok) throw new Error("Błąd zapisu egzaminu");

    const saved = await res.json();
    dispatch(addExam(saved));
  };

  const edit = async (updated: ExamData & { id: number }) => {
    if (user?.google_id === "demo123") {
      dispatch(updateExam(updated));
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/exams/${updated.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }
    );

    if (!res.ok) throw new Error("Błąd podczas aktualizacji");

    const serverExam = await res.json();
    dispatch(updateExam(serverExam));
  };

  const toggleComplete = async (id: number) => {
    const exam = exams.find((e) => e.id === id);
    if (!exam) return;

    const isCompleting = !exam.completed;
    const updated = { ...exam, completed: !exam.completed };

    if (user?.google_id === "demo123") {
      dispatch(updateExam(updated));
      if (isCompleting) triggerConfetti();
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/exams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (!res.ok) throw new Error("Błąd toggle complete");

    const saved = await res.json();
    dispatch(updateExam(saved));

    if (isCompleting) triggerConfetti();
  };

  const remove = async (id: number) => {
    if (user?.google_id === "demo123") {
      dispatch(removeExam(id));
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/exams/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Błąd usuwania egzaminu");

    dispatch(removeExam(id));
  };

  return {
    exams,
    loading,
    error,
    add,
    edit,
    remove,
    toggleComplete,
  };
};
