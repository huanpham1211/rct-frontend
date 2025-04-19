import React, { useState, useEffect } from 'react';
import './CreateUserPage.css';
import { useNavigate } from 'react-router-dom';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: '', newSingleRole: '' });
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('https://rct-backend-1erq.onrender.com/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setUsers(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://rct-backend-1erq.onrender.com/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username: formData.username, password: formData.password, role: formData.role })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('✅ Tạo tài khoản thành công');
      setFormData({ username: '', password: '', role: '', newSingleRole: '' });
      fetchUsers();
    } else {
      setMessage(`❌ ${data.message || 'Lỗi tạo tài khoản'}`);
    }
  };

  const handleResetPassword = async () => {
    const res = await fetch(`https://rct-backend-1erq.onrender.com/api/users/${selectedUser}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ password: newPassword })
    });
    const data = await res.json();
    if (res.ok) {
      alert('✅ Mật khẩu đã được đặt lại');
      setNewPassword('');
    } else {
      alert(`❌ ${data.message || 'Lỗi đặt lại mật khẩu'}`);
    }
  };

  const handleUpdateRole = async () => {
    const res = await fetch(`https://rct-backend-1erq.onrender.com/api/users/${selectedUser}/update-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: formData.newSingleRole }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('✅ Vai trò đã được cập nhật');
      setFormData((prev) => ({ ...prev, newSingleRole: '' }));
      fetchUsers();
    } else {
      alert(`❌ ${data.message || 'Lỗi cập nhật vai trò'}`);
    }
  };

  return (
    <div className="create-user-container">
      <button onClick={() => navigate('/dashboard')} className="back-button">← Quay về Dashboard</button>
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

      <hr />
      <h3>👥 Danh sách người dùng</h3>
      <ul className="user-list">
        {users.map((u) => (
          <li key={u.id}>
            <strong>{u.username}</strong> - Vai trò: {u.role}
          </li>
        ))}
      </ul>

      <hr />
      <h3>🔧 Quản lý người dùng</h3>
      <label>Chọn người dùng</label>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">-- Chọn người dùng --</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.username}</option>
        ))}
      </select>

      <div className="user-management-section">
        <h4>🔑 Đặt lại mật khẩu</h4>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleResetPassword}>Đặt lại mật khẩu</button>
      </div>

      <div className="user-management-section">
        <h4>🧩 Thay đổi vai trò</h4>
        <select
          value={formData.newSingleRole || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, newSingleRole: e.target.value }))
          }
        >
          <option value="">-- Chọn vai trò mới --</option>
          <option value="admin">Admin</option>
          <option value="recruiter">Recruiter</option>
          <option value="lab">Lab</option>
          <option value="reviewer">Reviewer</option>
          <option value="physician">Physician</option>
          <option value="studymanager">Study Manager</option>
        </select>
        <button
          onClick={handleUpdateRole}
          disabled={!selectedUser || !formData.newSingleRole}
        >
          Cập nhật vai trò
        </button>
      </div>
    </div>
  );
};

export default CreateUserPage;
