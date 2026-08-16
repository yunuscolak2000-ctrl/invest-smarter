import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import InterviewPage from "../pages/InterviewPage";
import DecisionQaPage from "../pages/DecisionQaPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/qa/decision" element={<DecisionQaPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
