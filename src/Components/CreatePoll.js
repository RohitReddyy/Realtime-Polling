import React, { useState, useRef } from 'react';

export default function CreatePoll({ onCreatePoll }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const formRef = useRef(null);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pollData = {
      question,
      options: options.filter(option => option.trim() !== '')
    };

    try {
      const response = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pollData)
      });

      if (response.ok) {
        const data = await response.json();
        alert("Successfully created poll");
        onCreatePoll(data.polls.id);
        formRef.current.reset(); // Reset the form fields
      } else {
        console.error('Failed to create poll');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Create Poll</h3>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="question" className="form-label">Question:</label>
                  <input type="text" id="question" className="form-control" value={question} onChange={(e) => setQuestion(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Options:</label>
                  {options.map((option, index) => (
                    <div key={index} className="input-group mb-3">
                      <input type="text" className="form-control" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
                      {index > 1 && <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveOption(index)}>Remove</button>}
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline-primary mb-3" onClick={handleAddOption}>Add Option</button>
                </div>
                <button type="submit" className="btn btn-primary">Create Poll</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
