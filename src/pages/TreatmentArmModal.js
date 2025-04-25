// src/components/TreatmentArmModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TreatmentArmModal.css";

const TreatmentArmModal = ({ studyId, onClose, onSuccess }) => {
  const token = localStorage.getItem("token");
  const [arms, setArms] = useState([]);
  const [newArm, setNewArm] = useState({ name: "", allocation_ratio: 1, description: "" });


  useEffect(() => {
    fetchArms();
  }, []);

  const fetchArms = async () => {
    try {
      const res = await axios.get(
        `https://rct-backend-1erq.onrender.com/api/studies/${studyId}/get-arms`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setArms(res.data);
    } catch (err) {
      console.error("Failed to fetch arms", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewArm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddArm = async () => {
    if (!newArm.name || newArm.allocation_ratio <= 0) return;
    try {
      await axios.post(
        `https://rct-backend-1erq.onrender.com/api/studies/${studyId}/add-arms`,
        newArm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewArm({ name: "", allocation_ratio: 1 });
      fetchArms();
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Error adding arm", err);
    }
  };

  const handleDeleteArm = async (armId) => {
    if (!window.confirm("Xác nhận xoá nhánh điều trị này?")) return;
    try {
      await axios.delete(
        `https://rct-backend-1erq.onrender.com/api/studies/arms/${armId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchArms();
    } catch (err) {
      console.error("Error deleting arm", err);
    }
  };

return (
  <div className="modal">
    <div className="modal-content">
      <h3>📦 Quản lý nhánh điều trị</h3>

      <div className="arm-form space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Tên nhánh (VD: A hoặc Placebo)"
          value={newArm.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Mô tả (VD: Điều trị tiêu chuẩn hoặc giả dược)"
          value={newArm.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="allocation_ratio"
          placeholder="Tỷ lệ phân bổ (VD: 1, 2 – để tính tỷ lệ phần trăm)"
          value={newArm.allocation_ratio}
          onChange={handleChange}
          min="1"
        />
        <small className="text-gray-600">
          * Tổng các tỷ lệ sẽ được dùng để xác định phần trăm phân bổ. VD: A:1, B:2 → A=33%, B=67%
        </small>

        <button onClick={handleAddArm} className="btn-add">➕ Thêm</button>
      </div>

      <ul className="arm-list mt-4">
        {arms.map((arm) => (
          <li key={arm.id} className="mb-2">
            <strong>{arm.name}</strong> — {arm.description || 'Không mô tả'} — Tỷ lệ: {arm.allocation_ratio}
            <button
              className="btn-delete ml-2"
              onClick={() => handleDeleteArm(arm.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 mt-4 rounded">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default TreatmentArmModal;
