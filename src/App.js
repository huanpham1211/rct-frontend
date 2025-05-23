import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PatientForm from './pages/PatientForm';
import LabForm from './pages/LabForm';
import ReviewPanel from './pages/ReviewPanel';
import CheckUpPage from './pages/CheckUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import ChangePassword from './pages/ChangePassword';
import CreateUserPage from './pages/CreateUserPage';
import SitePage from './pages/SitePage';
import StudyPage from './pages/StudyPage';


function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute element={<Dashboard />} allowedRoles={['admin', 'lab', 'recruiter', 'reviewer', 'physician', 'studymanager']} />
          }
        />
        <Route path="/change-password" element={<ProtectedRoute allowedRoles={['admin', 'lab', 'recruiter', 'reviewer', 'physician', 'studymanager']} element={<ChangePassword />} />} />
        <Route  
          path="/create-user"  
          element={<ProtectedRoute allowedRoles={['admin']} element={<CreateUserPage />} />}
        />
        <Route
          path="/add-patient"
          element={<ProtectedRoute allowedRoles={['admin', 'recruiter', 'physician']} element={<PatientForm />} />}
        />
        <Route
          path="/lab-result"
          element={<ProtectedRoute allowedRoles={['admin', 'lab']} element={<LabForm />} />}
        />
        <Route
          path="/review"
          element={<ProtectedRoute allowedRoles={['admin', 'reviewer']} element={<ReviewPanel />} />}
        />
        <Route
          path="/check-up"
          element={<ProtectedRoute allowedRoles={['admin', 'physician']} element={<CheckUpPage />} />}
        />
        <Route
          path="/site"
          element={<ProtectedRoute allowedRoles={['admin']} element={<SitePage />} />}
        />
        <Route
          path="/study"
          element={<ProtectedRoute allowedRoles={['admin', 'studymanager']} element={<StudyPage />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
