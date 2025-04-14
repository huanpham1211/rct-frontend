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

  return (
    <div className="header-bar">
      <h1>RCT System</h1>
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
              <button onClick={handleLogout} className="dropdown-item logout-button">Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;