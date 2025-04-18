import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !allowedRoles.includes(role)) {
    // Redirect to root page
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
