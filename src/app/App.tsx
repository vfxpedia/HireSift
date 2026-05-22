import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import CandidatesPage from "../pages/CandidatesPage";
import ReviewerPage from "../pages/ReviewerPage";
import TrustReportPage from "../pages/TrustReportPage";
import SettingsPage from "../pages/SettingsPage";
import AuditLogPage from "../pages/AuditLogPage";
import CandidateFlowPage from "../pages/CandidateFlowPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/verify" element={<CandidateFlowPage />} />
        <Route path="/verify/:candidateId" element={<CandidateFlowPage />} />

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="candidates/:candidateId" element={<ReviewerPage />} />
          <Route path="reviewer" element={<ReviewerPage />} />
          <Route path="reviewer/:candidateId" element={<ReviewerPage />} />
          <Route path="reports" element={<TrustReportPage />} />
          <Route path="reports/:candidateId" element={<TrustReportPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="audit-log" element={<AuditLogPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
