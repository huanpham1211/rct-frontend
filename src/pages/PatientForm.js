// src/pages/PatientForm.js
import React, { useEffect, useState } from 'react';
import PatientFormModal from './PatientFormModal';
import { Link } from 'react-router-dom';
import './PatientForm.css';

const token = localStorage.getItem('token');

const PatientForm = () => {
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [selectedSite, setSelectedSite] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);   // ✨ add loading state
  const [error, setError] = useState(null);        // ✨ optional error state

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch('https://rct-backend-1erq.onrender.com/api/studies/assigned-studies', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const data = await res.json();
        setStudies(data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Không thể tải danh sách nghiên cứu."); 
        if (err.message.includes("401") || err.message.includes("unauthorized")) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);   // ✅ set loading to false no matter success or fail
      }
    };

    fetchStudies();
  }, []);

  const handleStudySelect = (study) => {
    if (study.sites.length === 1) {
      setSelectedSite(study.sites[0].id);
      setSelectedStudy(study);
      setShowModal(true);
    } else {
      setSelectedStudy(study);
    }
  };

  const handleSiteSelect = (siteId) => {
    setSelectedSite(siteId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudy(null);
    setSelectedSite('');
  };

  return (
    <div className="study-card-container">
      <Link to="/dashboard" className="back-button">← Quay lại Dashboard</Link>

      {loading ? (
        <div className="spinner"></div>   // ✨ if loading, show spinner
      ) : error ? (
        <div className="error-message">{error}</div>   // ✨ if error, show error
      ) : (
        <>
          {!selectedStudy && studies.length > 0 && studies.map(study => (
            <div key={study.id} className="study-card" onClick={() => handleStudySelect(study)}>
              <h3>{study.name}</h3>
              <p>{study.description}</p>
            </div>
          ))}

          {selectedStudy && selectedStudy.sites.length > 1 && !selectedSite && (
            <div className="site-selector">
              <h4>Chọn địa điểm cho nghiên cứu <strong>{selectedStudy.name}</strong></h4>
              {selectedStudy.sites.map(site => (
                <button key={site.id} onClick={() => handleSiteSelect(site.id)}>
                  {site.name}
                </button>
              ))}
            </div>
          )}

          {showModal && (
            <PatientFormModal
              studyId={selectedStudy.id}
              siteId={selectedSite}
              onClose={handleCloseModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PatientForm;
