import React, { useState } from 'react';
import './StudyFormModal.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudyFormModal = ({ onClose, onStudyCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    protocol_number: '',
    irb_number: '',
    start_date: '',
    end_date: '',
  });

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://rct-backend-1erq.onrender.com/api/studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('✅ Tạo nghiên cứu thành công!');
        onStudyCreated();
        onClose();
      } else {
        toast.error(`❌ Lỗi: ${data.message || 'Không thể tạo nghiên cứu.'}`);
      }
    } catch (err) {
      toast.error('❌ Lỗi kết nối tới máy chủ.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Tạo nghiên cứu mới</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Tên nghiên cứu" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <input type="text" placeholder="Protocol number" value={formData.protocol_number} onChange={(e) => setFormData({ ...formData, protocol_number: e.target.value })} />
          <input type="text" placeholder="IRB number" value={formData.irb_number} onChange={(e) => setFormData({ ...formData, irb_number: e.target.value })} />
          <input type="date" placeholder="Ngày bắt đầu" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
          <input type="date" placeholder="Ngày kết thúc" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
          <div className="modal-actions">
            <button type="submit">Tạo</button>
            <button type="button" onClick={onClose} className="cancel-btn">Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyFormModal;
