import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListingsPage from './pages/JobListingsPage';
import JobDetailsPage from './pages/JobDetailsPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import ManageJobsPage from './pages/recruiter/ManageJobsPage';
import CreateEditJobPage from './pages/recruiter/CreateEditJobPage';
import ApplicantsListPage from './pages/recruiter/ApplicantsListPage';
import CandidateDetailsPage from './pages/recruiter/CandidateDetailsPage';
import InterviewManagementPage from './pages/recruiter/InterviewManagementPage';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import BrowseJobsPage from './pages/candidate/BrowseJobsPage';
import ResumeUploadPage from './pages/candidate/ResumeUploadPage';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import MyApplicationsPage from './pages/candidate/MyApplicationsPage';
import ApplicationDetailsPage from './pages/candidate/ApplicationDetailsPage';
import CandidateInterviewsPage from './pages/candidate/CandidateInterviewsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobListingsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
          </Route>

          {/* Recruiter Workspace Routes */}
          <Route element={<DashboardLayout requiredRole="recruiter" />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs" element={<ManageJobsPage />} />
            <Route path="/recruiter/jobs/create" element={<CreateEditJobPage />} />
            <Route path="/recruiter/jobs/edit/:id" element={<CreateEditJobPage />} />
            <Route path="/recruiter/applicants" element={<ApplicantsListPage />} />
            <Route path="/recruiter/candidates/:id" element={<CandidateDetailsPage />} />
            <Route path="/recruiter/interviews" element={<InterviewManagementPage />} />
          </Route>

          {/* Candidate Workspace Routes */}
          <Route element={<DashboardLayout requiredRole="candidate" />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/jobs" element={<BrowseJobsPage />} />
            <Route path="/candidate/resume" element={<ResumeUploadPage />} />
            <Route path="/candidate/profile" element={<CandidateProfilePage />} />
            <Route path="/candidate/applications" element={<MyApplicationsPage />} />
            <Route path="/candidate/applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="/candidate/interviews" element={<CandidateInterviewsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
