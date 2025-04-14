// src/pages/CreateUserPage.js
import React, { useState } from 'react';
import './CreateUserPage.css';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('https://rct-backend-1erq.onrender.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('✅ User created successfully');
      setFormData({ username: '', password: '', role: '' });
    } else {
      setMessage(`❌ ${data.message || 'Error creating user'}`);
    }
  };
  

  return (
    <div className="create-user-container">
      <h2>➕ Tạo tài khoản người dùng mới</h2>
      <form onSubmit={handleSubmit} className="create-user-form">
        <label>Tên đăng nhập</label>
        <input name="username" value={formData.username} onChange={handleChange} required />

        <label>Mật khẩu</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Vai trò</label>
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">-- Chọn vai trò --</option>
          <option value="admin">Admin</option>
          <option value="recruiter">Recruiter</option>
          <option value="lab">Lab</option>
          <option value="reviewer">Reviewer</option>
          <option value="physician">Physician</option>
          <option value="studymanager">Study Manager</option>
        </select>

        <button type="submit">Tạo tài khoản</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default CreateUserPage;
