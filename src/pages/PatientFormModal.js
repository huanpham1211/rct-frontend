import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PatientFormModal.css';

const PatientFormModal = () => {
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

  const [variableValues, setVariableValues] = useState({});
  const [studyVariables, setStudyVariables] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem("token");
  const studyId = localStorage.getItem("study_id"); // or pass as prop
  const siteId = localStorage.getItem("site_id");

  useEffect(() => {
    fetchStudyVariables();
  }, []);

  const fetchStudyVariables = async () => {
    try {
      const res = await fetch(`https://rct-backend-1erq.onrender.com/api/studies/${studyId}/variables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudyVariables(data || []);
    } catch (err) {
      console.error("❌ Failed to load study variables:", err);
    }
  };

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

  const handleVariableChange = (id, value) => {
    setVariableValues((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      para: formData.para.join(''),
      study_id: studyId,
      site_id: siteId,
      study_variables: Object.entries(variableValues).map(([variable_id, value]) => ({
        variable_id: parseInt(variable_id),
        value
      }))
    };

    try {
      const res = await fetch('https://rct-backend-1erq.onrender.com/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
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
        setVariableValues({});
      } else {
        setMessage(`❌ ${result.message || 'Lỗi khi lưu bệnh nhân.'}`);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối đến server.");
      console.error(err);
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
          <input type="text" name="phone" placeholder=" " value={formData.phone} onChange={handleChange} />
          <label>Số điện thoại</label>
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

        {/* Study-specific Variables */}
        {studyVariables.length > 0 && (
          <>
            <h3 className="mt-4">🧪 Biến số nghiên cứu</h3>
            {studyVariables.map((v) => (
              <div className="floating-group" key={v.id}>
                {v.variable_type === "select" ? (
                  <>
                    <select
                      value={variableValues[v.id] || ""}
                      onChange={(e) => handleVariableChange(v.id, e.target.value)}
                    >
                      <option value=""> </option>
                      {v.options?.split(',').map((opt, i) => (
                        <option key={i} value={opt.trim()}>{opt.trim()}</option>
                      ))}
                    </select>
                    <label>{v.description || v.name}</label>
                  </>
                ) : v.variable_type === "boolean" ? (
                  <label>
                    <input
                      type="checkbox"
                      checked={variableValues[v.id] === "true"}
                      onChange={(e) => handleVariableChange(v.id, e.target.checked ? "true" : "false")}
                    />
                    {v.description || v.name}
                  </label>
                ) : (
                  <>
                    <input
                      type={v.variable_type === "date" ? "date" : "text"}
                      value={variableValues[v.id] || ""}
                      onChange={(e) => handleVariableChange(v.id, e.target.value)}
                    />
                    <label>{v.description || v.name}</label>
                  </>
                )}
              </div>
            ))}
          </>
        )}

        <button type="submit">Lưu bệnh nhân</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default PatientFormModal;
