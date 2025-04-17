// src/pages/ChangePassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const toggleShow = (field) => {
    if (field === 'old') setShowOld(!showOld);
    if (field === 'new') setShowNew(!showNew);
    if (field === 'confirm') setShowConfirm(!showConfirm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('❌ Mật khẩu mới không khớp');
      return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch('https://rct-backend-1erq.onrender.com/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const result = await res.json();
    setMessage(result.message || (res.ok ? 'Đổi mật khẩu thành công!' : 'Có lỗi xảy ra.'));
  };

  return (
    <div className="change-password-container">
      <form onSubmit={handleSubmit} className="change-password-form">
        <h2>🔒 Đổi mật khẩu</h2>

        <div className="input-group">
          <input
            type={showOld ? 'text' : 'password'}
            placeholder="Mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <span onClick={() => toggleShow('old')} className="toggle-eye">{showOld ? '🙈' : '👁️'}</span>
        </div>

        <div className="input-group">
          <input
            type={showNew ? 'text' : 'password'}
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span onClick={() => toggleShow('new')} className="toggle-eye">{showNew ? '🙈' : '👁️'}</span>
        </div>

        <div className="input-group">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span onClick={() => toggleShow('confirm')} className="toggle-eye">{showConfirm ? '🙈' : '👁️'}</span>
        </div>

        <button type="submit">✅ Cập nhật</button>
        {message && <p className="form-message">{message}</p>}
        <button type="button" className="back-button" onClick={() => navigate('/dashboard')}>← Quay lại Dashboard</button>
      </form>
    </div>
  );
};

export default ChangePassword;
