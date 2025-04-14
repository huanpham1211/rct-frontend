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
        <p>Đây là trung tâm quản lý nghiên cứu của bạn.</p>
      </div>

      <div className="dashboard-section">
        <h3>Vào nhanh</h3>
        <div className="shortcut-grid">
          <Link to="/add-patient" className="shortcut-item">
            <div className="shortcut-icon">📋</div>
            <div className="shortcut-text">Nhập bệnh nhân mới</div>
          </Link>
          <Link to="/lab-result" className="shortcut-item">
            <div className="shortcut-icon">🧪</div>
            <div className="shortcut-text">Nhập kết quả xét nghiệm</div>
          </Link>
          <Link to="/review" className="shortcut-item">
            <div className="shortcut-icon">📁</div>
            <div className="shortcut-text">Review dữ liệu nghiên cứu</div>
          </Link>
          <Link to="/check-up" className="shortcut-item">
            <div className="shortcut-icon">🩺</div>
            <div className="shortcut-text">Khám bệnh</div>
          </Link>
          <Link to="/site" className="shortcut-item">
            <div className="shortcut-icon">🏢</div>
            <div className="shortcut-text">Quản lý địa điểm</div>
          </Link>
          <Link to="/study" className="shortcut-item">
            <div className="shortcut-icon">📚</div>
            <div className="shortcut-text">Quản lý nghiên cứu</div>
          </Link>
        </div>
      </div>

      <div className="dashboard-section">
        <button className="logout-button" onClick={handleLogout}>🚪 Đăng xuất</button>
      </div>
    </div>
  );
};

export default Dashboard;