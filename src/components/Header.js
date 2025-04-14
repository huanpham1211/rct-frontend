import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Redirect to login
  };

  const userRole = localStorage.getItem('role'); // Get the user's role from localStorage

  return (
    <div className="header-bar">
      <h1>HỆ THỐNG QUẢN LÝ NGHIÊN CỨU</h1>
      <div className="header-actions">
        <div
          className="tooltip-container"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="gear-icon">⚙️</div>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/change-password" className="dropdown-item">Đổi mật khẩu</Link>
              {userRole === 'admin' && ( // Show Create User only for admins
                <Link to="/create-user" className="dropdown-item">Tạo người dùng</Link>
              )}
              <button onClick={handleLogout} className="dropdown-item logout-button">Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;