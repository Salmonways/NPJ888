import React, { useState } from 'react';
import './Home.css'; 
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState('50.00'); // State to manage the input value
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleDepositClick = () => {
        navigate('/deposit');
    };

    const handleWithdrawClick = () => {
        navigate('/withdraw');
    };

    const handleGameClick = () => {
        navigate('/games');
    };

    // Handle input change for deposit amount
    const handleDepositAmountChange = (e) => {
        setDepositAmount(e.target.value); // Update state with the new input value
    };

    return (
        <div className="homepage-container">
            <div className="navbar">
                <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="home-sidebar-buttons">
                        <button className="home-deposit-button" onClick={handleDepositClick}>Deposit</button>
                        <button className="home-withdraw-button" onClick={handleWithdrawClick}>Withdraw</button>
                        <button className="home-game-button" onClick={handleGameClick}>Games</button>
                    </div>
                </div>

                {/* Hamburger Menu Icon */}
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <div className="menu-icon"></div>
                </button>
            </div>

            <div className="main-content">
                <div className="top-right-container">
                    <h1>NPJ888</h1>
                    <h2>Bitcoin Casino</h2>
                    {/* Login and Sign Up buttons */}
                    <div className="auth-buttons">
                        <Link to="/login">
                            <button className="home-login-button">Login</button>
                        </Link>
                        <Link to="/register">
                            <button className="home-signup-button">Sign Up</button>
                        </Link>
                    </div>
                </div>

                <div className="home-deposit-container">
                    <div className="quick-deposit">
                        <h3>Quick Deposit & Play</h3>
                        {/* Add onChange to update depositAmount */}
                        <input 
                            type="number" 
                            value={depositAmount} 
                            onChange={handleDepositAmountChange} 
                        />
                        <select>
                            <option>USD</option>
                        </select>
                        <Link to="/login">
                            <button className="start-playing-btn">Start Playing</button>
                        </Link>
                    </div>

                    <div className="bonus-offer">
                        <h3>Welcome Bonus Offer</h3>
                        <p>GET $500 OR %BTC</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;