import { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const StudentDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedPollId, setSelectedPollId] = useState(null); // State to track the currently selected poll ID
  const [pollResults, setPollResults] = useState(null);
  const [votedPolls, setVotedPolls] = useState([]); // State to store the IDs of polls the user has already voted on
  const navigate = useNavigate();
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
      if (votedPolls.includes(pollId)) {
        console.error('You have already voted on this poll.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/pollResponses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollId, userId, selectedOption }),
      });

      if (response.ok) {
        console.log('Poll response submitted successfully');
        setSelectedOptions({ ...selectedOptions, [pollId]: null }); // Clear selected option after submission
        setVotedPolls([...votedPolls, pollId]); // Add the poll ID to the list of voted polls
      } else {
        console.error('Failed to submit poll response');
      }
    } catch (error) {
      console.error('Error submitting poll response:', error);
    }
  };

  const clearVote = () => {
    // Clear the selected option for the current poll
    setSelectedOptions({ ...selectedOptions, [selectedPollId]: null });
  };

  const viewResults = async (pollId) => {
    try {
      setSelectedPollId(pollId); // Set the selected poll ID when viewing results
      navigate(`/comment/${pollId}`);
    } catch (error) {
      console.error('Error fetching poll results:', error);
    }
  };


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Student Dashboard</Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/studentdashboard">Current Polls</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/pastpolls">Past Polls</Link>
              </li>
            </ul>
            <form className="d-flex">
              <Link className="btn btn-outline-danger" to="/">Logout</Link>
            </form>
          </div>
        </div>
      </nav>

    <div className="container">
      <h1 className="text-center mt-5">Current Polls</h1>
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
                    <div className="text-center" onClick={() => viewResults(poll._id)} style={{ cursor: "pointer" }}>
                      <i className="far fa-file-alt fa-4x mb-3 text-primary"></i>
                      <p>
                        <strong>{poll.question}</strong>
                      </p>
                    </div>

                    <hr />

                    <form className="px-4">
                      {poll.options.map((option, idx) => (
                        <div key={idx} className="custom-radio">
                          <input
                            className="custom-radio-input"
                            type="radio"
                            name={`poll-${poll._id}-${idx}`}
                            id={`radio${poll._id}-${idx + 1}`}
                            value={option}
                            onChange={() => {
                              setSelectedOptions({ ...selectedOptions, [poll._id]: option });
                              setSelectedPollId(poll._id); // Update the selected poll ID when an option is selected
                            }}
                            checked={selectedOptions[poll._id] === option}
                          />
                          <label className="custom-radio-label" htmlFor={`radio${poll._id}-${idx + 1}`}>
                            <div className="custom-radio-button"></div>
                            <span className="custom-radio-option">{option}</span>
                            {pollResults && pollResults.percentages[option] && (
                              <span className="custom-radio-percent">({pollResults.percentages[option]}%)</span>
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
                      disabled={!selectedOptions[poll._id] || selectedPollId !== poll._id}
                    >
                      Clear Vote
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={() => submitPollResponse(poll._id, selectedOptions[poll._id])}
                      disabled={!selectedOptions[poll._id] || selectedPollId !== poll._id || votedPolls.includes(poll._id)}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => viewResults(poll._id)}
                      disabled={selectedPollId !== poll._id}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {pollResults && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            <h2>Poll Results</h2>
            <div>
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
    </>
  );
};

export default StudentDashboard;
