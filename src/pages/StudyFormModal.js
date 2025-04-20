import React, { useState, useEffect } from "react";
import "./StudyFormModal.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const StudyFormModal = ({ onClose, onSuccess, study = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    protocol_number: "",
    irb_number: "",
    start_date: "",
    end_date: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (study) {
      setFormData({
        name: study.name || "",
        protocol_number: study.protocol_number || "",
        irb_number: study.irb_number || "",
        start_date: study.start_date || "",
        end_date: study.end_date || "",
      });
    }
  }, [study]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check required fields
    const { name, protocol_number, irb_number, start_date } = formData;
    if (!name || !protocol_number || !irb_number || !start_date) {
      toast.error("⚠️ Vui lòng điền đầy đủ các trường bắt buộc (ngoại trừ ngày kết thúc)");
      return;
    }
  
    const payload = {
      ...formData,
      end_date: formData.end_date === "" ? null : formData.end_date
    };
  
    const endpoint = study
      ? `https://rct-backend-1erq.onrender.com/api/studies/${study.id}`
      : "https://rct-backend-1erq.onrender.com/api/studies";
  
    const method = study ? "put" : "post";
  
    try {
      const res = await axios[method](endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success(study ? "✅ Đã cập nhật nghiên cứu" : "✅ Đã tạo nghiên cứu mới");
      onSuccess(); // trigger reload
      onClose();   // close modal
    } catch (err) {
      console.error("Study submit failed:", err);
      toast.error("❌ Lỗi khi lưu nghiên cứu");
    }
  };


  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{study ? "Chỉnh sửa nghiên cứu" : "Thêm nghiên cứu mới"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Tên nghiên cứu *</label>
          <input name="name" value={formData.name} onChange={handleChange} required />

          <label>Mã protocol *</label>
          <input name="protocol_number" value={formData.protocol_number} onChange={handleChange} />

          <label>Số IRB *</label>
          <input name="irb_number" value={formData.irb_number} onChange={handleChange} />

          <label>Ngày bắt đầu *</label>
          <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />

          <label>Ngày kết thúc</label>
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />

          <button type="submit">
            {study ? "Cập nhật" : "Tạo"}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Hủy
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudyFormModal;
