import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const CommentPage = () => {
  const { pollId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [socket, setSocket] = useState(null);
  const [poll, setPoll] = useState(null);


  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newComment', ({ pollId: commentPollId, comment }) => {
        if (commentPollId === pollId) {
          setComments((prevComments) => [...prevComments, comment]);
        }
      });

      return () => {
        socket.off('newComment');
      };
    }
  }, [socket, pollId]);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/polls/${pollId}`);
        if (response.ok) {
          const data = await response.json();
          setPoll(data.poll);
        } else {
          console.error('Failed to fetch poll data');
        }
      } catch (error) {
        console.error('Error fetching poll data:', error);
      }
    };

    fetchPoll();
  }, [pollId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pollId, comment: newComment })
      });
      
      if (response.ok) {
        console.log('Comment added successfully');
        setNewComment('');
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          {/* Display the poll on the left side */}
          {poll && (
            <div className="card mb-3">
              <div className="card-body">
                <div className="text-center">
                  <i className="far fa-file-alt fa-4x mb-3 text-primary"></i>
                  <p>
                    <strong>{poll.question}</strong>
                  </p>
                </div>
                <hr />
                <ul>
                  {poll.options.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-6">
          {/* Comment box on the right side */}
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Write your comment</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="5"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
          {/* Display comments */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Comments</h5>
              <ul className="list-group list-group-flush">
                {comments.map((comment, idx) => (
                  <li key={idx} className="list-group-item">{comment}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentPage;


