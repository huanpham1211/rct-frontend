import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SitePage.css';

const SitePage = () => {
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [editingId, setEditingId] = useState(null); // Track which site is being edited
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

  useEffect(() => {
    if (role === 'admin') {
      fetchSites();
    }
  }, [role]);

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

      await res.json();
      setMessage('✅ Site created successfully!');
      setFormData({ name: '', location: '' });
      fetchSites();
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('❌ An unexpected error occurred.');
    }
  };

  const handleEditClick = (site) => {
    setEditingId(site.id);
    setEditForm({ name: site.name, location: site.location });
  };

  const handleUpdate = async (siteId) => {
    try {
      const res = await fetch(`https://rct-backend-1erq.onrender.com/api/sites/${siteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error updating site:', errorText);
        setMessage(`❌ Failed to update site.`);
        return;
      }

      setMessage('✅ Site updated successfully!');
      setEditingId(null);
      fetchSites();
    } catch (error) {
      console.error('Update error:', error);
      setMessage('❌ Unexpected error while updating site.');
    }
  };

  return (
    <div className="site-page-container">
      <h2>Quản lý cơ sở nghiên cứu (Site)</h2>
      {message && <p>{message}</p>}
      {role === 'admin' && (
        <>
          <p>Hiện tại có <strong>{sites.length}</strong> cơ sở nghiên cứu.</p>

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
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <button type="submit">➕ Thêm cơ sở</button>
          </form>

          <ul className="site-list">
            {sites.map((site) => (
              <li key={site.id}>
                {editingId === site.id ? (
                  <>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                    <input
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    />
                    <button onClick={() => handleUpdate(site.id)}>💾 Lưu</button>
                    <button onClick={() => setEditingId(null)}>❌ Hủy</button>
                  </>
                ) : (
                  <>
                    <strong>{site.name}</strong><br />
                    {site.location}<br />
                    <button onClick={() => handleEditClick(site)}>🖉 Sửa</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <Link to="/dashboard" className="back-button">
        ← Quay lại Dashboard
      </Link>
    </div>
  );
};

export default SitePage;
