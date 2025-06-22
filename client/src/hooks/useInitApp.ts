import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { setExams } from "../features/exams/examSlice";

export const useInitApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    dispatch(setUser(parsedUser));

    const fetchExams = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/exams/${parsedUser.google_id}`
        );
        if (!response.ok) throw new Error("Błąd pobierania egzaminów");

        const examsFromDB = await response.json();
        dispatch(setExams(examsFromDB));
      } catch (err) {
        console.error("❌ Błąd przy pobieraniu egzaminów:", err);
      }
    };

    fetchExams();
  }, [dispatch]);
};
