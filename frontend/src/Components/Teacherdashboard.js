import React, { useState } from 'react';
import { FaPoll, FaChartBar, FaHistory } from 'react-icons/fa';
import CreatePoll from './CreatePoll';
import PollResults from './PollResults';
import PollHistory from './PollHistory';
import './TeacherDashboard.css';

export default function TeacherDashboard() {
  const [view, setView] = useState('createPoll');

  const handleViewChange = (viewName) => {
    setView(viewName);
  };

  return (
    <div className="teacher-dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <a className="navbar-brand" href="#">
            Teacher Dashboard
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className={`nav-link btn ${view === 'createPoll' ? 'active' : ''}`}
                  onClick={() => handleViewChange('createPoll')}
                >
                  <FaPoll className="me-2" />
                  Create Poll
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn ${view === 'pollResults' ? 'active' : ''}`}
                  onClick={() => handleViewChange('pollResults')}
                >
                  <FaChartBar className="me-2" />
                  View Poll Results
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn ${view === 'pollHistory' ? 'active' : ''}`}
                  onClick={() => handleViewChange('pollHistory')}
                >
                  <FaHistory className="me-2" />
                  Poll History
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {view === 'createPoll' && <CreatePoll />}
            {view === 'pollResults' && <PollResults />}
            {view === 'pollHistory' && <PollHistory />}
          </div>
        </div>
      </div>
    </div>
  );
}
