// Updated SitePage.js with delete + enhanced UI + relationship safety
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SitePage.css';

const SitePage = () => {
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', location: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      setMessage('❌ You do not have permission to access this page.');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  }, [role, navigate]);

  const fetchSites = async () => {
    try {
      const res = await fetch('https://rct-backend-1erq.onrender.com/api/sites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSites(data);
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Failed to fetch sites.');
    }
  };

  useEffect(() => {
    if (role === 'admin') fetchSites();
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://rct-backend-1erq.onrender.com/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      setMessage(result.message || '✅ Site created successfully!');
      if (res.ok) {
        setFormData({ name: '', location: '' });
        fetchSites();
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error adding site.');
    }
  };

  const handleUpdate = async (siteId) => {
    try {
      const res = await fetch(`https://rct-backend-1erq.onrender.com/api/sites/${siteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const result = await res.json();
      setMessage(result.message || '✅ Site updated');
      if (res.ok) {
        setEditingId(null);
        fetchSites();
      }
    } catch (err) {
      console.error('Update error:', err);
      setMessage('❌ Failed to update site.');
    }
  };

  const handleDelete = async (siteId) => {
    if (!window.confirm('Are you sure you want to delete this site?')) return;
    try {
      const res = await fetch(`https://rct-backend-1erq.onrender.com/api/sites/${siteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setMessage(result.message || '✅ Site deleted');
      if (res.ok) fetchSites();
    } catch (err) {
      console.error(err);
      setMessage('❌ Could not delete site. It may be linked to a study.');
    }
  };

  const handleEditClick = (site) => {
    setEditingId(site.id);
    setEditForm({ name: site.name, location: site.location });
  };

  return (
    <div className="site-page-container">
      <h2>🔧 Quản lý cơ sở nghiên cứu</h2>
      {message && <p className="form-message">{message}</p>}

      <form onSubmit={handleSubmit} className="site-form">
        <input type="text" placeholder="Tên cơ sở" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        <input type="text" placeholder="Địa chỉ" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
        <button type="submit">➕ Thêm cơ sở</button>
      </form>

      <ul className="site-list">
        {sites.map((site) => (
          <li key={site.id} className="site-item">
            {editingId === site.id ? (
              <>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                <button onClick={() => handleUpdate(site.id)}>💾 Lưu</button>
                <button onClick={() => setEditingId(null)}>✖ Hủy</button>
              </>
            ) : (
              <>
                <strong>{site.name}</strong><br />
                <span>{site.location}</span><br />
                <button onClick={() => handleEditClick(site)}>🖉 Sửa</button>
                <button onClick={() => handleDelete(site.id)} className="delete-btn">🗑 Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <Link to="/dashboard" className="back-button">← Quay lại Dashboard</Link>
    </div>
  );
};

export default SitePage;
