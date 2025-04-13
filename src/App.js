import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PatientForm from './pages/PatientForm';
import LabForm from './pages/LabForm';
import ReviewPanel from './pages/ReviewPanel';
import CheckUpPage from './pages/CheckUpPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/add-patient" element={<PatientForm />} />

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
      </Routes>
    </Router>
  );
}

export default App;
