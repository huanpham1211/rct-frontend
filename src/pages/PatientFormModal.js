import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './PatientFormModal.css';

const PatientFormModal = ({ studyId, siteId, onClose }) => {
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
    is_active: true,
  });

  const [studyVariables, setStudyVariables] = useState([]);
  const [variableValues, setVariableValues] = useState({});
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (studyId) {
      fetchVariables();
    }
  }, [studyId]);

  const fetchVariables = async () => {
    try {
      const res = await fetch(`https://rct-backend-1erq.onrender.com/api/studies/${studyId}/variables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudyVariables(data || []);
    } catch (err) {
      console.error('❌ Failed to load study variables:', err);
      toast.error('❌ Không thể tải biến số nghiên cứu');
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

  const handleVariableChange = (variableId, value) => {
    setVariableValues((prev) => ({
      ...prev,
      [variableId]: value,
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
        value: value,
      })),
    };

    try {
      const res = await fetch('https://rct-backend-1erq.onrender.com/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
          is_active: true,
        });
        setVariableValues({});
      } else {
        setMessage(`❌ ${result.message || 'Lỗi khi lưu bệnh nhân.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('❌ Lỗi kết nối server');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ width: '90%', maxWidth: '800px' }}>
        <h2>📋 Thêm bệnh nhân mới</h2>
        <form onSubmit={handleSubmit} className="patient-form">

          {/* Essential Patient Fields */}
          {/* name, dob, sex, para, etc. */}
          {/* Keep your floating-group input fields here (same as you already did) */}

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

          {/* Your other fields (phone, email, ethnicity, etc.) here */}

          {/* 🔥 Study Variables Part */}
          {studyVariables.length > 0 && (
            <div className="variable-section">
              <h3>🛠️ Biến số nghiên cứu</h3>
              {studyVariables.map((v) => (
                <div key={v.id} className="floating-group">
                  <label>{v.description || v.name}</label>
                  {v.variable_type === 'boolean' ? (
                    <select onChange={(e) => handleVariableChange(v.id, e.target.value)} required={v.required}>
                      <option value=""> </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  ) : (
                    <input
                      type={v.variable_type === 'number' || v.variable_type === 'integer' ? 'number' : 'text'}
                      onChange={(e) => handleVariableChange(v.id, e.target.value)}
                      required={v.required}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <button type="submit">Lưu bệnh nhân</button>
            <button type="button" onClick={onClose} className="bg-red-500 text-white ml-2 px-4 py-2 rounded">
              Đóng
            </button>
          </div>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default PatientFormModal;
