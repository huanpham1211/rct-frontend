import React, { useState, useEffect } from "react";
import axios from "axios";
import StudyFormModal from "./StudyFormModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StudyPage.css';
import { useNavigate } from "react-router-dom";

const StudyPage = () => {
  const [studies, setStudies] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedStudyId, setSelectedStudyId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStudyModal, setShowStudyModal] = useState(false);
  const [editStudy, setEditStudy] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  useEffect(() => {
    fetchStudies();
    fetchSites();
  }, [currentPage, searchQuery]);
  
const navigate = useNavigate();
const [showAssignUserModal, setShowAssignUserModal] = useState(false);
const [users, setUsers] = useState([]);
  
  const fetchStudies = async () => {
    try {
      const res = await axios.get("https://rct-backend-1erq.onrender.com/api/studies", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchQuery, page: currentPage, limit: pageSize }
      });
      setStudies(res.data.studies || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) {
      toast.error("❌ Lỗi khi tải nghiên cứu");
    }
  };
  
const fetchUsers = async () => {
  const res = await axios.get("https://rct-backend-1erq.onrender.com/api/users", {
    headers: { Authorization: `Bearer ${token}` }
  });
  setUsers(res.data);
};

useEffect(() => {
  fetchStudies();
  fetchSites();
  fetchUsers(); // also fetch users
}, [currentPage, searchQuery]);
  
  const fetchSites = async () => {
    try {
      const res = await axios.get("https://rct-backend-1erq.onrender.com/api/sites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSites(res.data);
    } catch {
      toast.error("❌ Lỗi khi tải danh sách cơ sở");
    }
  };

  const handleAssignSite = async (studyId, siteId) => {
    try {
      await axios.post(
        "https://rct-backend-1erq.onrender.com/api/studies/assign",
        { study_id: studyId, site_id: siteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Gán cơ sở thành công");
      setShowAssignModal(false);
      fetchStudies();
    } catch {
      toast.error("❌ Không thể gán cơ sở");
    }
  };
const handleUnassignSite = async (studyId, siteId) => {
  const confirm = window.confirm("Bạn có chắc chắn muốn bỏ gán cơ sở này?");
  if (!confirm) return;

  try {
    await axios.post(
      "https://rct-backend-1erq.onrender.com/api/studies/unassign",
      { study_id: studyId, site_id: siteId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("✅ Đã bỏ gán cơ sở");
    fetchStudies();
  } catch {
    toast.error("❌ Không thể bỏ gán cơ sở");
  }
};


  const handleEdit = (study) => {
    setEditStudy(study);
    setShowStudyModal(true);
  };

  return (
    <div className="study-container">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
          <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
      >
        ← Quay về Dashboard
      </button>
        <h2 className="text-xl font-bold text-center">Quản lý nghiên cứu</h2>
        {["admin", "studymanager"].includes(role) && (
          <button
            onClick={() => {
              setEditStudy(null);
              setShowStudyModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Tạo nghiên cứu
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="🔍 Tìm kiếm nghiên cứu..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        className="border p-2 mb-4 w-full"
      />

      <div className="study-card-grid">
        {studies.map((s) => (
          <div key={s.id} className="study-card">
            <h3 className="study-title">{s.name}</h3>
            <p><strong>Protocol:</strong> {s.protocol_number}</p>
            <p><strong>IRB:</strong> {s.irb_number}</p>
            <p><strong>Bắt đầu:</strong> {s.start_date}</p>
            <p><strong>Kết thúc:</strong> {s.end_date || "—"}</p>
      
            <div className="site-list">
              {s.sites.length > 0 ? (
                s.sites.map((site) => (
                  <div key={site.id} className="site-tag">
                    🏥 {site.name}
                    <button
                      className="unassign-btn"
                      onClick={() => handleUnassignSite(s.id, site.id)}
                    >
                      ❌
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-site">Chưa có cơ sở</p>
              )}
            </div>
      
            <div className="card-actions">
              <button onClick={() => {
                setSelectedStudyId(s.id);
                setShowAssignModal(true);
              }} className="assign-btn">➕ Gán cơ sở</button>
      
              {["admin", "studymanager"].includes(role) && (
                <button onClick={() => handleEdit(s)} className="edit-btn">✏️ Sửa</button>
              )}
            </div>
          </div>
        ))}
      </div>


    <div className="pagination mt-4 flex justify-center space-x-2">
      <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
        &lt;
      </button>
      <span>Trang {currentPage} / {totalPages}</span>
      <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
        &gt;
      </button>
    </div>
      {showStudyModal && (
        <StudyFormModal
          onClose={() => setShowStudyModal(false)}
          onSuccess={fetchStudies}
          study={editStudy}
        />
      )}
      {showAssignModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chọn cơ sở cho nghiên cứu {selectedStudyId}</h3>
      
            <ul>
              {(() => {
                const study = studies.find(s => s.id === selectedStudyId);
                const assignedSiteIds = new Set(study?.sites?.map(s => s.id));
                const unassignedSites = sites.filter(site => !assignedSiteIds.has(site.id));
      
                if (unassignedSites.length === 0) {
                  return <li>🎉 Tất cả cơ sở đã được gán</li>;
                }
      
                return unassignedSites.map(site => (
                  <li key={site.id}>
                    <button
                      onClick={() => handleAssignSite(selectedStudyId, site.id)}
                      className="bg-blue-500 text-white px-4 py-2 m-1"
                    >
                      {site.name}
                    </button>
                  </li>
                ));
              })()}
            </ul>
      
            <button
              onClick={() => setShowAssignModal(false)}
              className="bg-red-500 text-white px-4 py-2 mt-2"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPage;
