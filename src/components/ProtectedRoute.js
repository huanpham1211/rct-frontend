// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const role = localStorage.getItem('role');
  return allowedRoles.includes(role) ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
