import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';

export default function PollPage() {
    const { pollId } = useParams();
    const [poll, setPoll] = useState(null);
    const [percentages, setPercentages] = useState([]);
    const [showColumns, setShowColumns] = useState(false);
    const [votesData, setVotesData] = useState({});

    // Fetch poll data
    useEffect(() => {
        const fetchPollData = async () => {
            try {
                // Fetch poll data
                const pollResponse = await fetch(`http://localhost:5000/api/polls/${pollId}`);
                if (!pollResponse.ok) {
                    throw new Error('Failed to fetch poll data');
                }
                const pollData = await pollResponse.json();
                setPoll(pollData.poll);
            } catch (error) {
                console.error('Error fetching poll data:', error);
            }
        };
        fetchPollData();
    }, [pollId]);

    // Fetch votes data for each option
    useEffect(() => {
        const fetchVotesData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/pollResponses/${pollId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch votes data');
                }
                const data = await response.json();
                // Format the votes data
                const formattedData = {};
                Object.keys(data.data.userVotes).forEach(option => {
                    formattedData[option] = data.data.userVotes[option];
                });
    
                // Fetch user names based on user IDs
                const updatedFormattedData = {};
                for (const option in formattedData) {
                    const userIds = formattedData[option];
                    const userNames = await Promise.all(userIds.map(async userId => {
                        const userResponse = await fetch(`http://localhost:5000/api/studentauth/getusername/${userId}`);
                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            return userData.username;
                        }
                        return null;
                    }));
                    updatedFormattedData[option] = userNames;
                }
    
                console.log("Updated formatted data:", updatedFormattedData); // Check the updatedFormattedData
                setVotesData(updatedFormattedData);
            } catch (error) {
                console.error('Error fetching votes data:', error);
            }
        };
        fetchVotesData();
    }, [pollId]);

    // Fetch poll percentages
    useEffect(() => {
        const fetchPollPercentages = async () => {
            try {
                // Fetch poll percentages
                const response = await fetch(`http://localhost:5000/api/pollResponses/${pollId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch poll percentages');
                }
                const data = await response.json();
                setPercentages(data.data.percentages);
            } catch (error) {
                console.error('Error fetching poll percentages:', error);
            }
        };
        fetchPollPercentages();
    }, [pollId]);

    // Create bar chart once both poll data and percentages are fetched
    useEffect(() => {
        if (poll && percentages) {
            createBarChart();
        }
    }, [poll, percentages]);

    // Function to create the bar chart
    const createBarChart = () => {
        const ctx = document.getElementById('barChart');
    
        // Check if a chart instance already exists
        if (window.myBarChart instanceof Chart) {
            window.myBarChart.destroy(); // Destroy the existing chart
        }
    
        // Create new chart instance
        window.myBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: poll.options.map(option => option),
                datasets: [{
                    label: 'Percentage',
                    data: poll.options.map(option => parseFloat(percentages[option]) || 0), // Fetch percentage for each option
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        // Add more colors if needed
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        // Add more colors if needed
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };
    
    // Function to handle the "Visualise" button click
    const handleVisualiseClick = () => {
        setShowColumns(true);
        console.log(votesData)
    };

    return (
        <div>
            <div>
                <h1>Poll Page</h1>
                <p>Poll ID: {pollId}</p>
                {poll && (
                    <>
                        <h2>Poll Question: {poll.question}</h2>
                        <h3>Poll Options:</h3>
                        <ul>
                            {poll.options.map((option, index) => (
                                <li key={index}>{option}</li>
                            ))}
                        </ul>
                    </>
                )}
                <button className='btn btn-primary mt-3' onClick={handleVisualiseClick} style={{position: "absolute", right: "20%", top: "65%"}}>Visualise</button>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ position: 'absolute', right: '0', top: '0', width: '50%' }}>
                    <h2>Percentage Bar Graph</h2>
                    <canvas id="barChart"></canvas>
                </div>
            </div>
            {showColumns && (
                <div style={{ marginTop: "170px" }}>
                    <h2 style={{ textAlign: 'center' }}>Poll Breakdown</h2>
                    <div className="d-flex justify-content-between">
                        {poll && poll.options.map((option, index) => (
                            <div key={index} style={{ width: `${100 / poll.options.length}%`, textAlign: 'center' }}>{option}
                                <ul>
                                    {votesData[option] && votesData[option].map((userId, idx) => (
                                        <li key={idx}>{userId}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}  
        </div>
    );
}
