import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './PatientFormModal.css';
import MultiSelectCheckboxGroup from './MultiSelectCheckboxGroup';

const PatientFormModal = ({ studyId, siteId, patientId = null, onClose }) => {
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
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);
  const isValidEmail = (email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formatDateDisplay = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };
  const formatDateToISO = (ddmmyyyy) => {
    const [day, month, year] = ddmmyyyy.split('/');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (studyId) {
      fetchVariables();
    }
    if (patientId) {
      fetchPatient();
    } else {
      // For new patient, default consent_date = today
      const today = new Date();
      const formatted = today.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, consent_date: formatted }));
    }
  }, [studyId, patientId]);

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
  const fetchPatient = async () => {
      try {
        const res = await fetch(`https://rct-backend-1erq.onrender.com/api/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
  
        if (res.ok) {
          const p = data.patient;
          const v = data.variables;
  
          setFormData({
            ...formData,
            name: p.name || '',
            dob: p.dob || '',
            sex: p.sex || '',
            para: p.para ? p.para.split('').map(Number) : [0,0,0,0],
            phone: p.phone || '',
            email: p.email || '',
            ethnicity: p.ethnicity || '',
            pregnancy_status: p.pregnancy_status || '',
            notes: p.notes || '',
            consent_date: p.consent_date || '',
            enrollment_status: p.enrollment_status || '',
            is_active: p.is_active ?? true,
          });
  
          const varValues = {};
          v.forEach(item => {
            if (item.type === "multiselect") {
              if (!varValues[item.variable_id]) varValues[item.variable_id] = [];
              varValues[item.variable_id].push(item.value);
            } else {
              varValues[item.variable_id] = item.value;
            }
          });
          setVariableValues(varValues);
  
        } else {
          toast.error('❌ Không thể tải thông tin bệnh nhân');
        }
  
      } catch (err) {
        console.error('❌ Failed to load patient:', err);
        toast.error('❌ Lỗi khi tải bệnh nhân');
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
    setLoading(true); // 🔥 Start spinner
  
    const payload = {
      ...formData,
      para: formData.para.join(''),
      study_id: studyId,
      site_id: siteId,
      study_variables: Object.entries(variableValues).map(([variable_id, value]) => ({
        variable_id: parseInt(variable_id),
        value: Array.isArray(value) ? value.join(',') : value,  // ✅ fix
  }))
,
    };
  
    try {
      const url = patientId
        ? `https://rct-backend-1erq.onrender.com/api/patients/${patientId}`
        : 'https://rct-backend-1erq.onrender.com/api/patients';
      const method = patientId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
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
          consent_date: new Date().toISOString().split('T')[0],
          enrollment_status: '',
          is_active: true,
        });
        setVariableValues({});
  
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' }); // 🔥 Auto-scroll to top
        }, 300);
      } else {
        setMessage(`❌ ${result.message || 'Lỗi khi lưu bệnh nhân.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('❌ Lỗi kết nối server');
    } finally {
      setLoading(false); // 🔥 Stop spinner
    }
  };


  const resetForm = () => {
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
      consent_date: new Date().toISOString().split('T')[0],
      enrollment_status: '',
      is_active: true,
    });
    setVariableValues({});
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ width: '90%', maxWidth: '800px' }}>
        <h2>📋 Thêm bệnh nhân mới</h2>
        <form onSubmit={handleSubmit} className="patient-form">

          {/* Basic Info */}
          <div className="floating-group">
            <input type="text" name="name" placeholder=" " value={formData.name} onChange={handleChange} required />
            <label>Họ và tên</label>
          </div>

          <div className="floating-group">
            <input
              type="date"
              name="dob"
              placeholder=" "
              value={formData.dob}
              onChange={(e) => handleChange(e)}
              required
            />
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

          {/* PARA only for Female */}
          {formData.sex === 'Nữ' && (
            <>
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
            </>
          )}

          {/* Other Fields */}
          <div className="floating-group">
            <input
              type="tel"
              name="phone"
              placeholder=" "
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="\d{10}"
              title="Số điện thoại phải gồm 10 chữ số"
            />
            <label>Điện thoại *</label>
          </div>
                
          <div className="floating-group">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              title="Địa chỉ email không hợp lệ"
            />
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
            <textarea name="notes" placeholder=" " value={formData.notes} onChange={handleChange} />
            <label>Ghi chú</label>
          </div>

          <div className="floating-group">
            <input
              type="date"
              name="consent_date"
              placeholder=" "
              value={formData.consent_date}
              onChange={handleChange}
              required
            />
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

          {studyVariables.length > 0 && (
            <div className="variable-section">
              <h3>🛠️ Biến số nghiên cứu</h3>
          
              {studyVariables.map((v) => (
                <div key={v.id} className="floating-group variable-field">
                  <label htmlFor={`variable-${v.id}`} className="variable-label">
                    {v.description || v.name}
                  </label>
          
                  {v.variable_type === 'boolean' ? (
                    <select
                      id={`variable-${v.id}`}
                      value={variableValues[v.id] || ""}
                      onChange={(e) => handleVariableChange(v.id, e.target.value)}
                      required={v.required}
                    >
                      <option value="">Chọn</option>
                      <option value="Yes">Có</option>
                      <option value="No">Không</option>
                    </select>
                  ) : v.variable_type === 'multiselect' ? (
                    <MultiSelectCheckboxGroup
                      options={v.options?.split(',') || []}
                      selectedValues={variableValues[v.id] || []}
                      onChange={(vals) => handleVariableChange(v.id, vals)}
                      required={v.required}
                    />
                  ) : (
                  <input
                    id={`variable-${v.id}`}
                    type={(v.variable_type === 'number' || v.variable_type === 'integer') ? 'number' : 'text'}
                    value={variableValues[v.id] || ""}
                    onChange={(e) => handleVariableChange(v.id, e.target.value)}
                    required={v.required}
                  />
                  )}
                </div> 
              ))}
            </div> 
          )} 

          {loading && (
            <div className="spinner-container">
              <div className="spinner"></div>
              <div className="spinner-text">Đang lưu bệnh nhân...</div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu bệnh nhân'}
            </button>
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
