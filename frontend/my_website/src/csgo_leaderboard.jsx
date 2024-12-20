import React, { useEffect, useState } from 'react';
import './csgo_leaderboard.css'; // Import your CSS file

const Leaderboard = () => {
  const [dailyWinners, setDailyWinners] = useState([]);
  const [monthlyWinners, setMonthlyWinners] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data from the API
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/leaderboard');
        const data = await response.json();
        
        console.log('Leaderboard data:', data); // Log the fetched data
        setDailyWinners(data.dailyWinners);
        setMonthlyWinners(data.monthlyWinners);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>Top winners</h2>

      <div className="winner-section">
        <div className="winner-day">
          <h3>Winner of the day</h3>
          {dailyWinners.map((winner, index) => (
            <div key={index} className="winner-card">
              <div className="winner-info">
                <span className="winner-icon">👤</span>
                <div className="winner-user">
                  <span>User</span><br />
                  <span>{winner.Username}</span>
                </div>
              </div>
              <div className="winner-profit">
                <span>Profit</span><br />
                <span>{winner.Profit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="winner-month">
          <h3>Winner of the month</h3>
          {monthlyWinners.map((winner, index) => (
            <div key={index} className="winner-card">
              <div className="winner-info">
                <span className="winner-icon">👤</span>
                <div className="winner-user">
                  <span>User</span><br />
                  <span>{winner.Username}</span>
                </div>
              </div>
              <div className="winner-profit">
                <span>Profit</span><br />
                <span>{winner.Profit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;