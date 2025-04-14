import React, { useState, useEffect } from "react";
import axios from "axios";
import './StudyPage.css';

const StudyPage = () => {
  const [studies, setStudies] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    protocol_number: "",
    irb_number: "",
    start_date: "",
    end_date: "",
  });
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudies();
    fetchSites();
  }, []);

  const fetchStudies = async () => {
    try {
      const res = await axios.get("https://rct-backend-1erq.onrender.com/api/studies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSites = async () => {
    try {
      const res = await axios.get("https://rct-backend-1erq.onrender.com/api/sites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignSite = async (studyId, siteId) => {
    try {
      await axios.post(
        "https://rct-backend-1erq.onrender.com/api/study-site",
        { study_id: studyId, site_id: siteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAssignModal(false);
      fetchStudies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Study Management</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Protocol</th>
            <th className="border p-2">IRB</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Assign Site</th>
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
              <td className="border p-2">{s.end_date}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2"
                  onClick={() => {
                    setSelectedSite(s.id); // store current study id
                    setShowAssignModal(true); // show modal to select site
                  }}
                >
                  Assign Site
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for assigning site */}
      {showAssignModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select a site for study {selectedSite}</h3>
            <ul>
              {sites.map((site) => (
                <li key={site.id}>
                  <button
                    onClick={() => handleAssignSite(selectedSite, site.id)}
                    className="bg-green-500 text-white px-4 py-2"
                  >
                    {site.name}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowAssignModal(false)} className="bg-red-500 text-white px-4 py-2 mt-2">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPage;
