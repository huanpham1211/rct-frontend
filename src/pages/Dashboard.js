import React from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard = () => {
  const role = localStorage.getItem('role');

  const roleMap = {
    admin: 'Quản trị viên',
    lab: 'Kỹ thuật viên xét nghiệm',
    recruiter: 'Người tuyển dụng mẫu',
    reviewer: 'Người kiểm duyệt',
    physician: 'Bác sĩ',
    studymanager: 'Quản lý nghiên cứu'
  };

  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="dashboard-section">
        <h3>Chào mừng!</h3>
        <p>Đây là trung tâm quản lý nghiên cứu của bạn.</p>
        <p style={{ fontStyle: 'italic', marginTop: '5px' }}>
          Đăng nhập dưới vai trò: <strong>{roleMap[role] || 'Không xác định'}</strong>
        </p>
      </div>

      <div className="dashboard-section">
        <div className="shortcut-grid">
          {(role === 'admin' || role === 'recruiter') && (
            <Link to="/add-patient" className="shortcut-item">
              <div className="shortcut-icon">📋</div>
              <div className="shortcut-text">Nhập bệnh nhân mới</div>
            </Link>
          )}

          {(role === 'admin' || role === 'lab') && (
            <Link to="/lab-result" className="shortcut-item">
              <div className="shortcut-icon">🧪</div>
              <div className="shortcut-text">Nhập kết quả xét nghiệm</div>
            </Link>
          )}

          {(role === 'admin' || role === 'reviewer') && (
            <Link to="/review" className="shortcut-item">
              <div className="shortcut-icon">📁</div>
              <div className="shortcut-text">Review dữ liệu nghiên cứu</div>
            </Link>
          )}

          {(role === 'admin' || role === 'physician') && (
            <Link to="/check-up" className="shortcut-item">
              <div className="shortcut-icon">🩺</div>
              <div className="shortcut-text">Khám bệnh</div>
            </Link>
          )}

          {role === 'admin' && (
            <Link to="/site" className="shortcut-item">
              <div className="shortcut-icon">🏢</div>
              <div className="shortcut-text">Quản lý địa điểm</div>
            </Link>
          )}

          {(role === 'admin' || role === 'studymanager') && (
            <Link to="/study" className="shortcut-item">
              <div className="shortcut-icon">📚</div>
              <div className="shortcut-text">Quản lý nghiên cứu</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
