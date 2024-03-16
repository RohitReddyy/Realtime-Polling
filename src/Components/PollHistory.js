import React, { useState, useEffect } from 'react';

const PollHistory = () => {
  // State to store the list of previous polls
  const [polls, setPolls] = useState([]);

  // Function to fetch the list of previous polls from the server
  const fetchPollHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/polls');
      if (response.ok) {
        const data = await response.json();
        setPolls(data.polls);
      } else {
        console.error('Failed to fetch poll history');
      }
    } catch (error) {
      console.error('Error fetching poll history:', error);
    }
  };

  // Fetch the poll history when the component mounts
  useEffect(() => {
    fetchPollHistory();
  }, []);

  return (
    <div>
      <h2>Poll History</h2>
      {polls.length === 0 ? (
        <p>No previous polls available.</p>
      ) : (
        <ul>
          {polls.map((poll) => (
            <li key={poll._id}>
              <strong>{poll.question}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PollHistory;
