// src/pages/PatientForm.js
import React, { useEffect, useState } from 'react';
import PatientFormModal from './PatientFormModal';
import './PatientForm.css';

const token = localStorage.getItem('token');

const PatientForm = () => {
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [selectedSite, setSelectedSite] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('https://rct-backend-1erq.onrender.com/api/studies/assigned-studies', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text(); // read response as text
          console.error("Error fetching studies:", text);
          throw new Error("Failed to fetch assigned studies");
        }
        return res.json();
      })
      .then(data => setStudies(data))
      .catch(err => {
        console.error("❌ Fetch error:", err);
        // optional: redirect to login if unauthorized
        if (err.message.includes("401") || err.message.includes("unauthorized")) {
          localStorage.clear();
          window.location.href = '/login';
        }
      });
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

  return (
    <div className="study-card-container">
      {!selectedStudy && studies.map(study => (
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
          onClose={() => {
            setShowModal(false);
            setSelectedStudy(null);
            setSelectedSite('');
          }}
        />
      )}
    </div>
  );
};

export default PatientForm;
