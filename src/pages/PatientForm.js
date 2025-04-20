import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './PatientForm.css';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    sex: '',
    para: [0, 0, 0, 0],
    phone: '',
    email: '',
    ethnicity: '',
    pregnancy_status: '',
    notes: '',
    consent_date: '',
    enrollment_status: '',
    is_active: true
  });

  const [message, setMessage] = useState('');

  const handleParaChange = (index, delta) => {
    setFormData((prev) => {
      const newPara = [...prev.para];
      newPara[index] = Math.max(0, Math.min(9, newPara[index] + delta));
      return { ...prev, para: newPara };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'name' ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      para: formData.para.join(''),
    };

    const res = await fetch('https://rct-backend-1erq.onrender.com/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (res.ok) {
      setMessage('✅ Thêm bệnh nhân thành công!');
      setFormData({
        name: '',
        dob: '',
        sex: '',
        para: [0, 0, 0, 0],
        phone: '',
        email: '',
        ethnicity: '',
        pregnancy_status: '',
        notes: '',
        consent_date: '',
        enrollment_status: '',
        is_active: true
      });
    } else {
      setMessage(`❌ ${result.message || 'Lỗi khi lưu bệnh nhân.'}`);
    }
  };

  return (
    <div className="patient-form-container">
      <Link to="/dashboard" className="back-button">← Quay lại</Link>
      <form onSubmit={handleSubmit} className="patient-form">
        <h2>Thêm bệnh nhân mới</h2>

        <div className="floating-group">
          <input type="text" name="name" placeholder=" " value={formData.name} onChange={handleChange} required />
          <label>Họ và tên</label>
        </div>

        <div className="floating-group">
          <input type="date" name="dob" placeholder=" " value={formData.dob} onChange={handleChange} required />
          <label>Ngày sinh</label>
        </div>

        <div className="floating-group">
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value=""> </option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          <label>Giới tính</label>
        </div>

        <label>PARA</label>
        <div className="para-input">
          {formData.para.map((num, index) => (
            <div className="para-digit" key={index}>
              <button type="button" onClick={() => handleParaChange(index, 1)}>+</button>
              <div>{num}</div>
              <button type="button" onClick={() => handleParaChange(index, -1)}>-</button>
            </div>
          ))}
        </div>

        <div className="floating-group">
          <input type="text" name="phone" placeholder=" " value={formData.phone} onChange={handleChange} pattern="\\d{4} \\d{3} \\d{3}" />
          <label>Số điện thoại (0000 000 000)</label>
        </div>

        <div className="floating-group">
          <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} />
          <label>Email</label>
        </div>

        <div className="floating-group">
          <input type="text" name="ethnicity" placeholder=" " value={formData.ethnicity} onChange={handleChange} />
          <label>Dân tộc</label>
        </div>

        <div className="floating-group">
          <select name="pregnancy_status" value={formData.pregnancy_status} onChange={handleChange}>
            <option value=""> </option>
            <option value="Mang thai">Mang thai</option>
            <option value="Không">Không</option>
          </select>
          <label>Tình trạng thai kỳ</label>
        </div>

        <div className="floating-group">
          <textarea name="notes" placeholder=" " value={formData.notes} onChange={handleChange}></textarea>
          <label>Ghi chú</label>
        </div>

        <div className="floating-group">
          <input type="date" name="consent_date" placeholder=" " value={formData.consent_date} onChange={handleChange} />
          <label>Ngày đồng ý tham gia</label>
        </div>

        <div className="floating-group">
          <select name="enrollment_status" value={formData.enrollment_status} onChange={handleChange}>
            <option value=""> </option>
            <option value="Enrolled">Đã ghi danh</option>
            <option value="Screened">Đã sàng lọc</option>
            <option value="Withdrawn">Đã rút</option>
          </select>
          <label>Trạng thái ghi danh</label>
        </div>

        <label>
          <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
          Còn hoạt động
        </label>

        <button type="submit">Lưu bệnh nhân</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default PatientForm;
