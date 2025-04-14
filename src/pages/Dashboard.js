// src/pages/Dashboard.js
import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to login
  };

  return (
    
    <div className="dashboard-container">
      <Header />

      <div className="dashboard-header">RCT Dashboard</div>

      <div className="dashboard-section">
        <h3>Chào mừng!</h3>
        <p>Đây là trung tâm quản lý chính của bạn để điều hành thử nghiệm lâm sàng ngẫu nhiên RCT.</p>
      </div>

      <div className="dashboard-section">
        <h3>Vào nhanh</h3>
        <ul className="shortcut-list">
          <li><Link to="/add-patient">📋 Nhập bệnh nhân mới</Link></li>
          <li><Link to="/lab-result">🧪 Nhập kết quả xét nghiệm</Link></li>
          <li><Link to="/review">📁 Review dữ liệu nghiên cứu</Link></li>
          <li><Link to="/check-up">🩺 Khám bệnh</Link></li>
        </ul>
      </div>

      <div className="dashboard-section">
        <button className="logout-button" onClick={handleLogout}>🚪 Đăng xuất</button>
      </div>
    </div>
  );
};

export default Dashboard;
