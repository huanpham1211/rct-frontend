import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./StudyVariableModal.css";

const StudyVariableModal = ({ studyId, onClose, onSuccess }) => {
  const [variables, setVariables] = useState([]);
  const [newVar, setNewVar] = useState({
    name: "",
    variable_type: "text",
    required: false,
    options: "",
    description: "",     // (add if not already there)
    entry_stage: "initial" // ✅ NEW default value
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVariables();
  }, []);
  const fetchVariables = async () => {
    try {
      const res = await axios.get(`https://rct-backend-1erq.onrender.com/api/studies/${studyId}/variables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📦 fetched variables:", res.data); // ← add this
      setVariables(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching variables:", err);
      toast.error("❌ Lỗi khi tải biến số");
    }
  };



  const handleAdd = async () => {
    if (!newVar.name) return toast.error("⚠️ Vui lòng nhập tên biến");
    try {
      await axios.post(`https://rct-backend-1erq.onrender.com/api/studies/${studyId}/variables`, newVar, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Đã thêm biến mới");
      setNewVar({ name: "", description: "", variable_type: "text", required: false, options: "" });
      fetchVariables();
      onSuccess?.();
    } catch {
      toast.error("❌ Không thể thêm biến");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa biến này?")) return;
    try {
      await axios.delete(`https://rct-backend-1erq.onrender.com/api/studies/variables/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Đã xóa biến");
      fetchVariables();
    } catch {
      toast.error("❌ Lỗi khi xóa");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ width: "90%", maxWidth: "800px" }}>
        <h3>⚙️ Biến số cho nghiên cứu {studyId}</h3>

        <div className="space-y-2 mb-4">
          <input
            placeholder="Tên biến (VD: tang_huyet_ap)"
            value={newVar.name}
            onChange={(e) => setNewVar({ ...newVar, name: e.target.value })}
          />
          <input
            placeholder="Mô tả biến (VD: Tăng huyết áp)"
            value={newVar.description}
            onChange={(e) => setNewVar({ ...newVar, description: e.target.value })}
          />
          <select
            value={newVar.variable_type}
            onChange={(e) => setNewVar({ ...newVar, variable_type: e.target.value })}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="integer">Integer</option>
            <option value="boolean">Yes/No</option>
            <option value="select">Dropdown</option>
            <option value="multiselect">Multi-Select</option>
            <option value="date">Date</option>
          </select>
          <select
            value={newVar.entry_stage}
            onChange={(e) => setNewVar({ ...newVar, entry_stage: e.target.value })}
          >
            <option value="initial">📋 Ban đầu</option>
            <option value="lab">🧪 Xét nghiệm</option>
            <option value="checkup">👨‍⚕️ Tái khám</option>
          </select>
          <input
            placeholder="Tùy chọn (cách nhau bởi dấu phẩy nếu là select)"
            value={newVar.options}
            onChange={(e) => setNewVar({ ...newVar, options: e.target.value })}
          />
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="required"
            className="align-middle"
            checked={newVar.required}
            onChange={(e) => setNewVar({ ...newVar, required: e.target.checked })}
          />
          <label htmlFor="required" className="text-sm text-gray-800 leading-tight">
            Bắt buộc?
          </label>
        </div>
          <button className="assign-btn" onClick={handleAdd}>➕ Thêm biến</button>
        </div>

        <ul>
          {variables.map(v => (
            <li key={v.id} className="mb-2">
              <div><strong>{v.name}</strong> <span className="text-gray-600"></span></div> {/* ✅ Show description if available */}
              <span className="ml-2 text-gray-600 text-sm">({v.description})</span> {/* optional: show internal name */}
              <span className="ml-2">📄 {v.variable_type}</span>
              <span className="ml-2 text-blue-700 italic">
                [{v.entry_stage === "lab" ? "Xét nghiệm" : v.entry_stage === "checkup" ? "Tái khám" : "Ban đầu"}]
              </span>
              {v.required && <span className="ml-2 text-red-600">⭐ Bắt buộc</span>}
              {v.options && <span> – Tuỳ chọn: {v.options}</span>}
              <button className="unassign-btn ml-2" onClick={() => handleDelete(v.id)}>❌</button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 mt-4 rounded">Đóng</button>
      </div>
    </div>
  );
};

export default StudyVariableModal;
