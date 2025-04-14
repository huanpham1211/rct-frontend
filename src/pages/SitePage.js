import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for the back button
import './SitePage.css';

const SitePage = () => {
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchSites = async () => {
    const res = await fetch('https://rct-backend-1erq.onrender.com/api/sites', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setSites(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://rct-backend-1erq.onrender.com/api/sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    if (res.ok) {
      setMessage('✅ Site created successfully!');
      setFormData({ name: '', address: '' });
      fetchSites();
    } else {
      setMessage(`❌ ${result.message || 'Error creating site'}`);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <div className="site-page-container">
      <h2>Quản lý cơ sở nghiên cứu (Site)</h2>
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

      {message && <p>{message}</p>}

      <ul className="site-list">
        {sites.map((site) => (
          <li key={site.id}>
            <strong>{site.name}</strong><br />
            {site.address}
          </li>
        ))}
      </ul>

      {/* Back button */}
      <Link to="/dashboard" className="back-button">
        ← Quay lại Dashboard
      </Link>
    </div>
  );
};

export default SitePage;