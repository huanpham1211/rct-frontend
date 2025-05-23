// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import this
import './LoginPage.css';
import { jwtDecode } from 'jwt-decode';

const API_BASE = process.env.REACT_APP_API; // ✅ Use environment variable for API base URL

const token = localStorage.getItem('token');
if (token) {
      const decoded = jwtDecode(token);
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
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await res.json();
    console.log('Login response:', data); // Debugging log
  
    if (data.success) {
      setError('');
      localStorage.setItem('token', data.token); // Save the token
      localStorage.setItem('role', data.role); // ✅ save role
      console.log('Token saved:', data.token); // Debugging log
      navigate('/dashboard'); // Redirect to the dashboard
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div 
    className="login-container"
    style={{
      backgroundImage: "url('/images/background.jpg')", // Set the background image
      backgroundSize: 'cover', // Ensure the image covers the entire container
      backgroundPosition: 'center', // Center the image
      backgroundRepeat: 'no-repeat', // Prevent the image from repeating
      height: '90vh', // Use full viewport height
      display: 'flex', // Center the login box
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0', // Remove any default margins
      padding: '0', // Remove padding to avoid scrollbars
      overflow: 'hidden', // Prevent scrolling
    }}>
      <form onSubmit={handleLogin} className="login-box">
        <h2>Hệ thống quản lý nghiên cứu</h2>
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
