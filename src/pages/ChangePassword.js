// src/pages/ChangePassword.js
import React, { useState } from 'react';
import './ChangePassword.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <form onSubmit={handleSubmit}>
        <h2>Đổi mật khẩu</h2>
        <input
          type="password"
          placeholder="Mật khẩu cũ"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Cập nhật</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
