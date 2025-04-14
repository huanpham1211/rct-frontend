import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './SitePage.css';

const SitePage = () => {
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Retrieve the role from localStorage
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (role !== 'admin') {
      setMessage('❌ You do not have permission to access this page.');
      setTimeout(() => navigate('/dashboard'), 3000); // Redirect to dashboard after 3 seconds
    }
  }, [role, navigate]);

  const fetchSites = async () => {
    try {
      const res = await fetch('https://rct-backend-1erq.onrender.com/api/sites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error fetching sites:', errorText);
        setMessage('❌ Failed to fetch sites.');
        return;
      }

      const data = await res.json();
      setSites(data);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setMessage('❌ An unexpected error occurred.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://rct-backend-1erq.onrender.com/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        setMessage(`❌ Error: ${res.status} - ${res.statusText}`);
        return;
      }

      const result = await res.json();
      setMessage('✅ Site created successfully!');
      setFormData({ name: '', address: '' });
      fetchSites();
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('❌ An unexpected error occurred.');
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchSites();
    }
  }, [role]);

  return (
    <div className="site-page-container">
      <h2>Quản lý cơ sở nghiên cứu (Site)</h2>
      {message && <p>{message}</p>}
      {role === 'admin' && (
        <>
          <p>Hiện tại có <strong>{sites.length}</strong> cơ sở nghiên cứu.</p> {/* Display site count */}

          <form onSubmit={handleSubmit} className="site-form">
            <input
              type="text"
              placeholder="Tên cơ sở"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Địa chỉ"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
            <button type="submit">➕ Thêm cơ sở</button>
          </form>

          <ul className="site-list">
            {sites.map((site) => (
              <li key={site.id}>
                <strong>{site.name}</strong><br />
                {site.address}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Back button */}
      <Link to="/dashboard" className="back-button">
        ← Quay lại Dashboard
      </Link>
    </div>
  );
};

export default SitePage;