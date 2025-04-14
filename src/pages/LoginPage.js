// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import this
import './LoginPage.css';
import jwt_decode from 'jwt-decode';

const token = localStorage.getItem('token');
if (token) {
    const decoded = jwt_decode(token);
    if (decoded.exp * 1000 < Date.now()) {
        // Token has expired
        localStorage.removeItem('token');
        // Redirect to login or show message
    }
}


const LoginPage = () => {
  const navigate = useNavigate(); // ✅ Navigation hook
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('https://rct-backend-1erq.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      setError('');
      localStorage.setItem('token', token);
      navigate('/dashboard'); // ✅ Redirect
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-box">
        <h2>Hệ thống quản lý RCT</h2>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
