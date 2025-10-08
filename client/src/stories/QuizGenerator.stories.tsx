import type { Meta, StoryObj } from "@storybook/react";
import QuizGenerator from "../components/QuizGenerator";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import  authReducer  from "../features/auth/authSlice";


// Mock store 
const mockStore = (user?: any) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: user || { google_id: "demo123", name: "Demo User" },
      },
    },
  });

const withStore = (Story: any, context: any) => (
  <Provider store={mockStore()}>
    <Story />
  </Provider>
);

const meta: Meta<typeof QuizGenerator> = {
  title: "Components/QuizGenerator",
  component: QuizGenerator,
  decorators: [withStore],
};

export default meta;
type Story = StoryObj<typeof QuizGenerator>;

// (brak quizu)
export const Default: Story = {};

// ładowanie
export const Loading: Story = {
  render: () => (
    <div className="max-w-xl mx-auto">
      <QuizGenerator />
      <div className="absolute top-1/2 left-1/2">
        <span className="text-blue-600 font-bold">Generujemy quiz...</span>
      </div>
    </div>
  ),
};

// symulacja danych
export const WithQuiz: Story = {
  render: () => {
    const mockQuestions = [
      { question: "Co to jest React?", answer: "Biblioteka do UI" },
      { question: "Czym jest hook useState?", answer: "Hook do stanu" },
    ];
    return (
      <div className="max-w-xl mx-auto">
        <QuizGenerator />
        <p className="text-sm text-gray-500 mt-4">
          (Przykładowy widok quizu)
        </p>
      </div>
    );
  },
};

// wyniki
export const Results: Story = {
  render: () => (
    <div className="max-w-xl mx-auto">
      <QuizGenerator />
      <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
        <h3 className="text-lg font-bold mb-2">📊 Wyniki końcowe</h3>
        <p>Poprawne odpowiedzi: 8 / 10 (80%)</p>
        <p className="mt-2 font-semibold text-green-700">🔥 Ekspert!</p>
      </div>
    </div>
  ),
};
