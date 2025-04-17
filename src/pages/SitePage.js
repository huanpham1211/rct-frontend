import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SitePage.css';

const SitePage = () => {
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== 'admin') {
      setMessage('❌ Bạn không có quyền truy cập trang này.');
      setTimeout(() => navigate('/dashboard'), 3000);
      return;
    }
    fetchSites();
  }, [token, role]);


  const fetchSites = async () => {
    try {
      const res = await fetch('https://rct-backend-1erq.onrender.com/api/sites', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error fetching sites:', errorText);
        setMessage('❌ Lỗi khi tải danh sách cơ sở.');
        return;
      }

      const data = await res.json();
      setSites(data);
    } catch (error) {
      console.error('❌ Exception while fetching sites:', error);
      setMessage('❌ Có lỗi xảy ra khi kết nối.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      setMessage('⚠️ Vui lòng nhập đầy đủ tên và địa chỉ.');
      return;
    }

    try {
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
        setMessage('✅ Cơ sở mới đã được thêm!');
        setFormData({ name: '', location: '' });
        fetchSites();
      } else {
        setMessage(`❌ ${result.message || 'Lỗi khi thêm cơ sở.'}`);
      }
    } catch (err) {
      console.error('❌ Error creating site:', err);
      setMessage('❌ Có lỗi xảy ra khi gửi yêu cầu.');
    }
  };

  const handleDelete = async (siteId) => {
    if (!window.confirm('Bạn có chắc muốn xoá cơ sở này?')) return;

    try {
      const res = await fetch(`https://rct-backend-1erq.onrender.com/api/sites/${siteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setMessage('🗑️ Đã xoá cơ sở.');
        fetchSites();
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error('❌ Error deleting site:', err);
      setMessage('❌ Không thể xoá cơ sở.');
    }
  };

  return (
    <div className="site-page-container">
      <h2>Quản lý cơ sở nghiên cứu (Site)</h2>
      {message && <p>{message}</p>}

      {role === 'admin' && (
        <>
          <p>Hiện có <strong>{sites.length}</strong> cơ sở nghiên cứu.</p>

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
            {sites.map(site => (
              <li key={site.id}>
                <strong>{site.name}</strong><br />
                {site.location}<br />
                <button className="delete-btn" onClick={() => handleDelete(site.id)}>🗑️ Xoá</button>
              </li>
            ))}
          </ul>
        </>
      )}

      <Link to="/dashboard" className="back-button">← Quay lại Dashboard</Link>
    </div>
  );
};

export default SitePage;
