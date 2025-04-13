// Dashboard.js
import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">RCT Dashboard</div>

      <div className="dashboard-section">
        <h3>Chào mừng!</h3>
        <p>Đây là trung tâm quản lý chính của bạn để điều hành thử nghiệm lâm sàng ngẫu nhiên RCT (randomized clinical trial).</p>
      </div>

      <div className="dashboard-section">
        <h3>Vào nhanh</h3>
        <ul>
          <li>📋 Nhập bệnh nhân mới</li>
          <li>💊 Chỉ định thuốc</li>
          <li>🧪 Nhập kết quả xét nghiệm</li>
          <li>📁 Review dữ liệu nghiên cứu</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
