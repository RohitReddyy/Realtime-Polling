import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const StudentDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/polls');
        if (response.ok) {
          const data = await response.json();
          setPolls(data.polls);
        } else {
          console.error('Failed to fetch polls');
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();

    socket.on('newPoll', (poll) => {
      setPolls((prevPolls) => [...prevPolls, poll]);
    });

    return () => {
      socket.off('newPoll');
    };
  }, []);

  const submitPollResponse = async (pollId, selectedOption) => {
    try {
      const response = await fetch('http://localhost:5000/api/pollResponses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollId, userId, selectedOption }),
      });

      if (response.ok) {
        console.log('Poll response submitted successfully');
        setSelectedOption(null);
        setSelectedPollId(null);
      } else {
        console.error('Failed to submit poll response');
      } 
    } catch (error) {
      console.error('Error submitting poll response:', error);
    }
  };

  const clearVote = () => {
    setSelectedOption(null);
  };

  const viewResults = async (pollId) => {
    try {
      alert("hi")
      const response = await fetch(`http://localhost:5000/api/pollResponses/${pollId}`);
      if (response.ok) {
        const data = await response.json();
        setPollResults(data.data);
      } else {
        console.error('Failed to fetch poll results');
      }
    } catch (error) {
      console.error('Error fetching poll results:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">Student Dashboard</h1>
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <h2>Available Polls</h2>
          {polls.length === 0 ? (
            <p>No polls available at the moment.</p>
          ) : (
            <div className="mx-0 mx-sm-auto">
              {polls.map((poll) => (
                <div key={poll._id} className="card mb-3">
                  <div className="card-body">
                    <div className="text-center">
                      <i className="far fa-file-alt fa-4x mb-3 text-primary"></i>
                      <p>
                        <strong>{poll.question}</strong>
                      </p>
                    </div>
  
                    <hr />
  
                    <form className="px-4">
                      {poll.options.map((option, idx) => (
                        <div key={idx} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`poll-${poll._id}`}
                            id={`radio2Example${idx + 1}`}
                            value={option}
                            onChange={() => setSelectedOption(option)}
                            checked={selectedOption === option}
                          />
                          <label className="form-check-label" htmlFor={`radio2Example${idx + 1}`}>
                            {option}
                            {pollResults && pollResults.percentages[option] && ( // Check if poll results are available and percentages exist for this option
                              <span className="ms-2">({pollResults.percentages[option]}%)</span>
                            )}
                          </label>
                        </div>
                      ))}
                    </form>
                  </div>
                  <div className="card-footer text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={clearVote}
                    >
                      Clear Vote
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={() => submitPollResponse(poll._id, selectedOption)}
                      disabled={!selectedOption}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => viewResults(poll._id)}
                      disabled={selectedPollId === poll._id}
                    >
                      View Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  
      {/* Poll Results Display Section */}
      {pollResults && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            <h2>Poll Results</h2>
            <div>
              {/* Display poll results here */}
              <p>Total Votes: {pollResults.totalVotes}</p>
              <ul>
                {Object.entries(pollResults.percentages).map(([option, percentage]) => (
                  <li key={option}>
                    Option: {option}, Percentage: {percentage}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};  

export default StudentDashboard;