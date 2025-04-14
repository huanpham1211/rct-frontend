import React, { useState } from 'react';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [showNotification, setShowNotification] = useState(false);

  // Block if token missing or role not allowed
  if (!token || !allowedRoles.includes(role)) {
    if (!showNotification) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000); // Hide notification after 3 seconds
    }
    return (
      <>
        {showNotification && (
          <div className="notification">
            Bạn không có quyền truy cập vào trang này.
          </div>
        )}
      </>
    );
  }

  return element;
};

export default ProtectedRoute;
