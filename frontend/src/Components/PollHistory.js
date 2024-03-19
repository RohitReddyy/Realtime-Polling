import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePoll.css';

const PollHistory = () => {
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null); 
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  
  const fetchPollHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/polls/history/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPolls(data.userPolls); 
      } else {
        console.error('Failed to fetch poll history');
      }
    } catch (error) {
      console.error('Error fetching poll history:', error);
    }
  };

  const fetchPollPercentages = async (pollId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pollResponses/${pollId}`);
      if (response.ok) {
        const data = await response.json();
        // Update the state with the selected poll ID and its percentages
        setSelectedPollId(pollId);
        setPolls(prevPolls => prevPolls.map(poll => poll._id === pollId ? {...poll, percentages: data.percentages} : poll));
      } else {
        console.error('Failed to fetch poll percentages');
      }
    } catch (error) {
      console.error('Error fetching poll percentages:', error);
    }
  };

  useEffect(() => {
    fetchPollHistory();
  }, []);

  const handlePollClick = (pollId) => {
    // Redirect to a new page with the poll statistics
    navigate(`/poll/${pollId}`);
  };

  return (
    <div className="poll-history-container">
      <h2 className="mb-4">Poll History</h2>
      {polls.length === 0 ? (
        <p>No previous polls available.</p>
      ) : (
        <div className="row row-cols-1">
          {polls.map((poll) => (
            <div className="col mb-4" key={poll._id}>
              <div className="card w-100" onClick={() => handlePollClick(poll._id)}>
                <div className="card-body">
                  <h5 className="card-title">{poll.question}</h5>
                  <ul className="list-group">
                    {poll.options?.map((option, index) => (
                      <li 
                        key={index} 
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          {option}
                          {/* Display the percentage if the poll ID matches the selected poll ID */}
                          {selectedPollId === poll._id && <span className="badge badge-light ml-2">{poll.percentages?.[option]}%</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-footer">
                  {/* Pass the poll ID to fetchPollPercentages */}
                  <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); fetchPollPercentages(poll._id) }}>View Percentages</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PollHistory;
