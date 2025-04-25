import React, { useState, useEffect } from "react";
import axios from "axios";
import StudyFormModal from "./StudyFormModal";
import TreatmentArmModal from "./TreatmentArmModal";
import StudyVariableModal from "./StudyVariableModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StudyPage.css';
import { useNavigate } from "react-router-dom";

const StudyPage = () => {
  const [studies, setStudies] = useState([]);
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedStudyForSite, setSelectedStudyForSite] = useState(null);
  const [selectedStudyForUserAssign, setSelectedStudyForUserAssign] = useState(null);
  const [selectedStudyForArms, setSelectedStudyForArms] = useState(null);
  const [showAssignSiteModal, setShowAssignSiteModal] = useState(false);
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  const [showArmModal, setShowArmModal] = useState(false);
  const [showStudyModal, setShowStudyModal] = useState(false);
  const [editStudy, setEditStudy] = useState(null);
  const [selectedStudyForVariables, setSelectedStudyForVariables] = useState(null);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudies();
    fetchSites();
    fetchUsers();
  }, [currentPage, searchQuery]);

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

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://rct-backend-1erq.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data || []);
    } catch {
      toast.error("❌ Lỗi khi tải danh sách người dùng");
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
      setShowAssignSiteModal(false);
      fetchStudies();
    } catch {
      toast.error("❌ Không thể gán cơ sở");
    }
  };

  const handleUnassignSite = async (studyId, siteId) => {
    if (!window.confirm("Bạn có chắc chắn muốn bỏ gán cơ sở này?")) return;
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

const handleAssignUser = async (studyId, userId) => {
  try {
    await axios.post(
      "https://rct-backend-1erq.onrender.com/api/studies/assign-user",
      { study_id: studyId, user_id: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("✅ Gán người dùng thành công");
    setShowAssignUserModal(false);
    fetchStudies();
  } catch {
    toast.error("❌ Không thể gán người dùng");
  }
};

const handleUnassignUser = async (studyId, userId) => {
  if (!window.confirm("Bạn chắc chắn muốn bỏ gán người dùng này?")) return;

  try {
    await axios.post(
      "https://rct-backend-1erq.onrender.com/api/studies/unassign-user",
      { study_id: studyId, user_id: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("✅ Đã bỏ gán người dùng");
    fetchStudies();
  } catch {
    toast.error("❌ Không thể bỏ gán người dùng");
  }
};

 const handleToggleRCT = async (studyId, isRCT) => {
  try {
    await axios.put(`https://rct-backend-1erq.onrender.com/api/studies/${studyId}`, {
      is_randomized: isRCT
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchStudies();
  } catch {
    toast.error("❌ Không thể cập nhật kiểu nghiên cứu");
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
            onClick={() => { setEditStudy(null); setShowStudyModal(true); }}
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
        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
        className="border p-2 mb-4 w-full"
      />

      <div className="study-card-grid">
        {studies.map((s) => {
          const assignedSiteIds = new Set(s.sites.map(site => site.id));
          const unassignedSites = sites.filter(site => !assignedSiteIds.has(site.id));
          const assignedUserIds = new Set((s.users || []).map(u => u.id));
          const unassignedUsers = users.filter(u => !assignedUserIds.has(u.id));

          return (
            <div key={s.id} className="study-card">
              <h3 className="study-title">{s.name}</h3>
              <p><strong>Protocol:</strong> {s.protocol_number}</p>
              <p><strong>IRB:</strong> {s.irb_number}</p>
              <p><strong>Bắt đầu:</strong> {s.start_date}</p>
              <p><strong>Kết thúc:</strong> {s.end_date || "—"}</p>
            {role === "admin" || role === "studymanager" ? (
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={s.is_randomized}
                  onChange={(e) => handleToggleRCT(s.id, e.target.checked)}
                  className="mr-2"
                />
                <label>Là nghiên cứu ngẫu nhiên (RCT)</label>
              </div>
            ) : s.is_randomized && (
              <p className="text-green-600 font-bold mt-2">📌 Nghiên cứu RCT</p>
            )}

            {s.is_randomized && (
              <>
                <button
                  className="assign-btn mt-2"
                  onClick={() => {
                    setSelectedStudyForArms(s.id);
                    setShowArmModal(true);
                  }}
                >🎯 Quản lý nhánh điều trị</button>
                <button
                  className="assign-btn mt-2"
                  onClick={() => {
                    setSelectedStudyForVariables(s.id);
                    setShowVariableModal(true);
                  }}
                >
                  ⚙️ Quản lý biến số
                </button>

                {s.treatment_arms?.length > 0 && (
                  <div className="arm-list mt-2">
                    <strong>Nhánh điều trị:</strong>
                    <div className="flex flex-wrap mt-1">
                      {s.treatment_arms.map((arm) => (
                        <span key={arm.id} className="arm-tag">
                          {arm.name} ({arm.allocation_ratio})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

              <div className="site-list">
                <h4>🏥 Cơ sở:</h4>
                {s.sites.length > 0 ? (
                  s.sites.map(site => (
                    <div key={site.id} className="site-tag">
                      {site.name}
                      <button
                        className="unassign-btn"
                        onClick={() => handleUnassignSite(s.id, site.id)}
                      >❌</button>
                    </div>
                  ))
                ) : (
                  <p className="no-site">Chưa có cơ sở</p>
                )}
                <button
                  onClick={() => { setSelectedStudyForSite(s.id); setShowAssignSiteModal(true); }}
                  className="assign-btn mt-2"
                >➕ Gán cơ sở</button>

                   <button onClick={() => {
                    setSelectedStudyForUserAssign(s.id);
                    setShowAssignUserModal(true);
                  }} className="assign-btn">➕ Gán người dùng</button> 
              </div>

              <div className="user-list mt-2">
                <strong>👤 Thành viên nghiên cứu:</strong>
                {s.users?.length > 0 ? (
                  s.users.map(user => (
                    <div key={user.id} className="user-tag">
                      {`${user.title}. ${user.last_name} ${user.first_name}`}
                      {["admin", "studymanager"].includes(role) && (
                        <button
                          onClick={() => handleUnassignUser(s.id, user.id)}
                          className="unassign-btn"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-user">Chưa có người dùng</p>
                )}
              </div>


              <div className="card-actions mt-4">
                {role === "admin" || role === "studymanager" ? (
                  <button onClick={() => handleEdit(s)} className="edit-btn">
                    ✏️ Sửa
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination mt-4 flex justify-center space-x-2">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          &lt;
        </button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
      {showArmModal && (
        <TreatmentArmModal
          studyId={selectedStudyForArms}
          onClose={() => setShowArmModal(false)}
          onSuccess={fetchStudies}
        />
      )}
      {showStudyModal && (
        <StudyFormModal
          onClose={() => setShowStudyModal(false)}
          onSuccess={fetchStudies}
          study={editStudy}
        />
      )}

      {showAssignSiteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chọn cơ sở cho nghiên cứu {selectedStudyForSite}</h3>
      
            <ul>
              {(() => {
                const study = studies.find(s => s.id === selectedStudyForSite);
                const assignedSiteIds = new Set(study?.sites?.map(s => s.id));
                const unassignedSites = sites.filter(site => !assignedSiteIds.has(site.id));
      
                if (unassignedSites.length === 0) {
                  return <li>🎉 Tất cả cơ sở đã được gán</li>;
                }
      
                return unassignedSites.map(site => (
                  <li key={site.id}>
                    <button
                      onClick={() => handleAssignSite(selectedStudyForSite, site.id)}
                      className="bg-blue-500 text-white px-4 py-2 m-1"
                    >
                      {site.name}
                    </button>
                  </li>
                ));
              })()}
            </ul>
      
            <button
              onClick={() => setShowAssignSiteModal(false)}
              className="bg-red-500 text-white px-4 py-2 mt-2"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {showVariableModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>⚙️ Quản lý biến số cho nghiên cứu {selectedStudyForVariables}</h3>
      
            {/* Placeholder: Replace this with your StudyVariableModal component */}
            <p>🚧 Đây là nơi để quản lý biến số tùy chỉnh của nghiên cứu.</p>
      
            <button
              onClick={() => setShowVariableModal(false)}
              className="bg-red-500 text-white px-4 py-2 mt-4"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showAssignUserModal && (
  <div className="modal">
    <div className="modal-content">
      <h3>Chọn người dùng cho nghiên cứu {selectedStudyForUserAssign}</h3>

      <ul>
        {(() => {
          const study = studies.find(s => s.id === selectedStudyForUserAssign);
          const assignedUserIds = new Set(study?.users?.map(u => u.id));
          const unassignedUsers = users.filter(u => !assignedUserIds.has(u.id) && u.role !== 'admin');


          if (unassignedUsers.length === 0) {
            return <li>🎉 Tất cả người dùng đã được gán</li>;
          }

          return unassignedUsers.map(user => (
            <li key={user.id}>
              <button
                onClick={() => handleAssignUser(selectedStudyForUserAssign, user.id)}
                className="bg-green-500 text-white px-4 py-2 m-1"
              >
                {`${user.title}. ${user.last_name} ${user.first_name}`}
              </button>
            </li>
          ));
        })()}
      </ul>

      <button
        onClick={() => setShowAssignUserModal(false)}
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
