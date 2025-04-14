import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Block if token missing or role not allowed
  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
