// src/pages/PatientForm.js
import React, { useState } from 'react';
import './PatientForm.css';

const token = localStorage.getItem('token');

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    sex: '',
    para: [0, 0, 0, 0],
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
    const { name, value } = e.target;
    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(), // Capitalize all letters
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      dob: formData.dob,
      sex: formData.sex,
      para: formData.para.join(''), // Save as string e.g., "0123"
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
      setFormData({ name: '', dob: '', sex: '', para: [0, 0, 0, 0] });
    } else {
      setMessage(`❌ ${result.message || 'Lỗi khi lưu bệnh nhân.'}`);
    }
  };

  return (
    <div className="patient-form-container">
      <form onSubmit={handleSubmit} className="patient-form">
        <h2>Thêm bệnh nhân mới</h2>

        <label>Họ và tên</label>
        <input
          type="text"
          name="name"
          placeholder="Nhập họ tên"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Ngày sinh</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <label>Giới tính</label>
        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          required
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>

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

        <button type="submit">Lưu bệnh nhân</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default PatientForm;
