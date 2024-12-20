import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Games.css'; // Link to the CSS file
import game1 from './assets/game1.png'; // Replace with actual paths to your images
import game2 from './assets/game2.png';
import game3 from './assets/game3.png';
import game4 from './assets/game4.png';

function Games() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate(); // To programmatically navigate

    // Toggle Sidebar open/close
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Functions to handle navigation
    const handleDepositClick = () => {
        navigate('/deposit');
    };

    const handleWithdrawClick = () => {
        navigate('/withdraw');
    };
    const handleHomeClick = () => {
        navigate('/home');
    };

    return (
        <div className="games-container">
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-buttons">
                    <button className="game-home-button" onClick={handleHomeClick}>Home</button>
                    <button className="game-deposit-button" onClick={handleDepositClick}>Deposit</button>
                    <button className="game-withdraw-button" onClick={handleWithdrawClick}>Withdraw</button>

                </div>
            </div>

            {/* Hamburger Menu Icon */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <div className="menu-icon"></div>
            </button>

            {/* Game content */}
            <div className="games-content">
                <h1 className="games-title">GAMES</h1>
                <div className="games-grid">
                    <div className="game-card">
                        <img src={game1} alt="Gates of Olympus" className="game-image" />
                    </div>
                    <div className="game-card">
                        <img src={game2} alt="Sweet Bonanza" className="game-image" />
                    </div>
                    <Link to="/csgo_empire" className="game-card">
                        <img src={game3} alt="CSGO Empire" className="game-image" />
                    </Link>
                    <div className="game-card">
                        <img src={game4} alt="Leprechaun Riches" className="game-image" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Games;