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
    fetch('/api/assigned-studies', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setStudies(data));
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
          <h4>Choose site for <strong>{selectedStudy.name}</strong></h4>
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
