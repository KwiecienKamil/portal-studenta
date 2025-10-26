import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Payment from "./pages/Payment.tsx";
import Completion from "./pages/Completion.tsx";
import { store } from "./store/index.ts";
import { Provider } from "react-redux";
import GenerateQuiz from "./pages/GenerateQuiz.tsx";
import PremiumSuccess from "./components/PremiumSuccess.tsx";
import Settings from "./pages/Settings.tsx";
import { Bounce, ToastContainer } from "react-toastify";
import { Legal } from "./pages/Legal.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/quiz" element={<GenerateQuiz />} />
            <Route path="/ustawienia" element={<Settings />} />
            <Route path="/completion" element={<Completion />} />
            <Route path="/platnosc" element={<Payment />} />
            <Route path="/premium-success" element={<PremiumSuccess />} />
            <Route path="/legal" element={<Legal />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);
