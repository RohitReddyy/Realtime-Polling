import React, { useState } from 'react';
import CreatePoll from './CreatePoll';
import PollResults from './PollResults';
import PollHistory from './PollHistory'; // Import the PollHistory component

export default function TeacherDashboard() {
  const [view, setView] = useState('createPoll');

  const handleViewChange = (viewName) => {
    setView(viewName);
  };

  return (
    <div className={`container-fluid p-0`}>
      <nav className={`navbar navbar-expand-lg navbar-light bg-light mb-4`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Teacher Dashboard</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <button className={`nav-link btn me-3 ${view === 'createPoll' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleViewChange('createPoll')}>Create Poll</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn me-3 ${view === 'pollResults' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleViewChange('pollResults')}>View Poll Results</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn ${view === 'pollHistory' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleViewChange('pollHistory')}>Poll History</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="row justify-content-center">
        <div className="col-md-8">
          {view === 'createPoll' && <CreatePoll />}
          {view === 'pollResults' && <PollResults />}
          {view === 'pollHistory' && <PollHistory />}
        </div>
      </div>
    </div>
  );
}
