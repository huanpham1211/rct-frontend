import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div className="header-bar">
      <h1>RCT System</h1>
      <div className="header-actions">
        <Link to="/change-password" className="gear-icon">⚙️</Link>
        <Link to="/create-user">➕ Tạo tài khoản</Link>
      </div>
    </div>
  );
};

export default Header;
