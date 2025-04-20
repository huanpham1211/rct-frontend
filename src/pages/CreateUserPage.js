import React, { useState, useEffect } from 'react';
import './CreateUserPage.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUserPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: '', newSingleRole: '' });
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    title: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://rct-backend-1erq.onrender.com/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        role: formData.role
      })
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('✅ Tạo tài khoản thành công');
      setFormData({ username: '', password: '', role: '', newSingleRole: '' });
      fetchUsers();
    } else {
      toast.error(`❌ ${data.message || 'Lỗi tạo tài khoản'}`);
    }
  };

  const handleUserSelect = async (userId) => {
    setSelectedUser(userId);
    if (!userId) {
      setUserProfile({ first_name: '', last_name: '', title: '' });
      return;
    }

    const res = await fetch(`https://rct-backend-1erq.onrender.com/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setUserProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        title: data.title || '',
      });
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
      toast.success('✅ Mật khẩu đã được đặt lại');
      setNewPassword('');
    } else {
      toast.error(`❌ ${data.message || 'Lỗi đặt lại mật khẩu'}`);
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
      toast.success('✅ Vai trò đã được cập nhật');
      setFormData((prev) => ({ ...prev, newSingleRole: '' }));
      fetchUsers();
    } else {
      toast.error(`❌ ${data.message || 'Lỗi cập nhật vai trò'}`);
    }
  };
const filteredUsers = users.filter((u) =>
  (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (u.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (u.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (u.title || '').toLowerCase().includes(searchTerm.toLowerCase())
);

  const handleUpdateProfile = async () => {
    const res = await fetch(`https://rct-backend-1erq.onrender.com/api/users/${selectedUser}/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userProfile)
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("✅ Thông tin người dùng đã được cập nhật");
      fetchUsers();
      setUserProfile({ first_name: '', last_name: '', title: '' });
    } else {
      toast.error(`❌ ${data.message || 'Lỗi khi cập nhật thông tin người dùng'}`);
    }
  };

  return (
    <div className="create-user-container">
      <ToastContainer position="top-right" autoClose={3000} />
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

      <hr />
      <label>Tìm kiếm người dùng</label>
        <input
          type="text"
          placeholder="Tìm theo tên, chức danh, username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      <h3>👥 Danh sách người dùng</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Họ</th>
            <th>Tên</th>
            <th>Chức danh</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.first_name || ''}</td>
              <td>{u.last_name || ''}</td>
              <td>{u.title || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>


      <hr />
      <h3>🔧 Quản lý người dùng</h3>
      <label>Chọn người dùng</label>
      <select value={selectedUser} onChange={(e) => handleUserSelect(e.target.value)}>
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
        <button onClick={handleResetPassword} disabled={!selectedUser || !newPassword}>
          Đặt lại mật khẩu
        </button>
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

      <div className="user-management-section">
        <h4>📝 Cập nhật họ tên và chức danh</h4>
        <label>Họ</label>
        <input
          type="text"
          name="last_name"
          value={userProfile.last_name}
          onChange={handleProfileChange}
        />   
            
        <label>Tên</label>
        <input
          type="text"
          name="first_name"
          value={userProfile.first_name}
          onChange={handleProfileChange}
        />

        <label>Chức danh</label>
        <input
          type="text"
          name="title"
          value={userProfile.title}
          onChange={handleProfileChange}
        />

        <button
          onClick={handleUpdateProfile}
          disabled={
            !selectedUser ||
            (!userProfile.first_name && !userProfile.last_name && !userProfile.title)
          }
        >
          Cập nhật thông tin
        </button>
      </div>
    </div>
  );
};

export default CreateUserPage;
