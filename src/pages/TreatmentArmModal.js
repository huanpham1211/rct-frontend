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

        <div className="arm-form">
          <input
            type="text"
            name="name"
            placeholder="Tên nhánh (VD: A hoặc Placebo)"
            value={newArm.name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="allocation_ratio"
            placeholder="Tỷ lệ (VD: 1 hoặc 2)"
            value={newArm.allocation_ratio}
            onChange={handleChange}
          />
          <button onClick={handleAddArm} className="btn-add">➕ Thêm</button>
        </div>

        <ul className="arm-list">
          {arms.map((arm) => (
            <li key={arm.id}>
              <strong>{arm.name}</strong> — Tỷ lệ: {arm.allocation_ratio}
              <button
                className="btn-delete"
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
