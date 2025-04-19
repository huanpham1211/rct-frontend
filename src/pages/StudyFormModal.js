import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StudyFormModal = ({ onClose, onStudyCreated }) => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    protocol_number: "",
    irb_number: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://rct-backend-1erq.onrender.com/api/studies", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Tạo nghiên cứu thành công");
      onStudyCreated();
      onClose();
    } catch (err) {
      toast.error("❌ Lỗi khi tạo nghiên cứu");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3 className="text-lg font-semibold mb-2">Tạo nghiên cứu mới</h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tên nghiên cứu"
            required
            className="border p-2"
          />
          <input
            name="protocol_number"
            value={formData.protocol_number}
            onChange={handleChange}
            placeholder="Protocol Number"
            className="border p-2"
          />
          <input
            name="irb_number"
            value={formData.irb_number}
            onChange={handleChange}
            placeholder="IRB Number"
            className="border p-2"
          />
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            placeholder="Ngày bắt đầu"
            className="border p-2"
          />
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            placeholder="Ngày kết thúc"
            className="border p-2"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Huỷ
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyFormModal;
