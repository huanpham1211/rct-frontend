import React, { useState, useEffect } from "react";
import axios from "axios";
import StudyFormModal from "./StudyFormModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './StudyPage.css';

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
    <div className="p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý nghiên cứu</h2>
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

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Protocol</th>
            <th className="border p-2">IRB</th>
            <th className="border p-2">Bắt đầu</th>
            <th className="border p-2">Kết thúc</th>
            <th className="border p-2">Cơ sở</th>
          </tr>
        </thead>
       <tbody>
        {studies.map((s) => (
          <tr key={s.id}>
            <td className="border p-2">{s.id}</td>
            <td className="border p-2">{s.name}</td>
            <td className="border p-2">{s.protocol_number}</td>
            <td className="border p-2">{s.irb_number}</td>
            <td className="border p-2">{s.start_date}</td>
            <td className="border p-2">{s.end_date || '—'}</td>
            <td className="border p-2">
              {s.sites && s.sites.length > 0 ? (
                <ul>
                  {s.sites.map((site) => (
                    <li key={site.id} className="flex items-center justify-between">
                      <span>🏥 {site.name}</span>
                      <button
                        className="bg-red-400 text-white px-2 py-1 text-xs rounded ml-2"
                        onClick={() => handleUnassignSite(s.id, site.id)}
                      >
                        ❌ Bỏ gán
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500 italic">Chưa có cơ sở</span>
              )}
            
              <div className="mt-2 space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setSelectedStudyId(s.id);
                    setShowAssignModal(true);
                  }}
                >
                  ➕ Gán cơ sở
                </button>
            
                {["admin", "studymanager"].includes(role) && (
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(s)}
                  >
                    ✏️ Sửa
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>

      </table>

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
