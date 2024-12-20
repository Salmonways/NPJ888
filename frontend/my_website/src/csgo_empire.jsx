import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './csgo_empire.css';
import dice_icon from './assets/dice_icon.png';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext

function GamePage() {
    const [betAmount, setBetAmount] = useState('');
    const [rolling, setRolling] = useState(false);
    const [userChoices, setUserChoices] = useState(['⚙️', '⚙️']); // User's chosen symbols
    const [randomSymbol, setRandomSymbol] = useState('⚙️'); // Random symbol in the middle
    const [symbolOptions, setSymbolOptions] = useState(['★', '⚙️', '🔴', '🔵', '✨', '💎']); // Available symbols
    const [previousRolls, setPreviousRolls] = useState([]); // Store previous rolls
    const navigate = useNavigate(); // To programmatically navigate
    const { username, balance, setBalance } = useContext(UserContext); // Get username, balance, and setBalance from context
    const [isGameActive, setIsGameActive] = useState(true); // State to track if the game is active



    const fetchGameStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/games/${gameId}`);
            setIsGameAvailable(response.data.Status === 'Available'); // Set game availability based on status
        } catch (error) {
            console.error('Error fetching game status:', error);
        }
    };
    // Fetch user balance whenever the username changes
    useEffect(() => {
        if (username) {
            fetchBalance(); // Fetch balance when user logs in
        }
    }, [username]);

    // Fetch balance function
    const fetchBalance = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/user/balance/${username}`);
            setBalance(response.data.balance); // Update balance from database
            console.log("Fetched balance:", response.data.balance); // Debugging
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    // Function to handle bet input change
    const handleBetChange = (e) => {
        setBetAmount(e.target.value);
    };

    // Function to handle clear bet button
    const handleClearBet = () => {
        setBetAmount('');
    };
    const handleBetClick = () => {

        if (!isGameActive) { // Check if the game is active
            alert('Game is unavailable.');
            return; // Prevent further execution if the game is inactive
        }
        if (betAmount && balance >= betAmount) {
            setRolling(true); // Start rolling animation
            setBalance((prevBalance) => prevBalance - betAmount);
            updateBalanceInDatabase(balance - betAmount);
    
            // Randomly select a symbol after 5 seconds
            const timer = setTimeout(() => {
                const randomSymbol = symbolOptions[Math.floor(Math.random() * symbolOptions.length)];
                setRandomSymbol(randomSymbol); // Set random symbol
                setRolling(false); // Stop rolling animation
    
                // Update previous rolls with the random symbol
                setPreviousRolls((prevRolls) => {
                    const updatedRolls = [...prevRolls, randomSymbol]; // Add new symbol
                    return updatedRolls.slice(-3); // Keep only the last 3 symbols
                });
    
                // Logic for determining win/loss
                const userChoice1Matches = userChoices[0] === randomSymbol;
                const userChoice2Matches = userChoices[1] === randomSymbol;
    
                let resultMessage;
                if (userChoice1Matches && userChoice2Matches) {
                    const newBalance = balance + parseFloat(betAmount); // Return all money back
                    setBalance(newBalance);
                    updateBalanceInDatabase(newBalance);
                    resultMessage = `You win! Your new balance is $${newBalance.toFixed(2)}`;
                } else if (userChoice1Matches || userChoice2Matches) {
                    const newBalance = balance + parseFloat(betAmount) / 2; // Return half money back
                    setBalance(newBalance);
                    updateBalanceInDatabase(newBalance);
                    resultMessage = `You win half your bet! Your new balance is $${newBalance.toFixed(2)}`;
                } else {
                    const newBalance = balance - betAmount; // Calculate new balance after loss
                    setBalance(newBalance);
                    updateBalanceInDatabase(newBalance);
                    resultMessage = `You lose! Your balance is $${newBalance.toFixed(2)}`;
                }
    
                // Alert the user with the result message after a delay
                setTimeout(() => {
                    alert(resultMessage);
                }, 500); // Delay alert for half a second
    
            }, 5000); // Wait for 5 seconds to select random symbol
    
            return () => clearTimeout(timer); // Clear the timer on unmount
        } else {
            alert('Insufficient balance or invalid bet amount.');
        }
    };

    // Function to update the balance in the database
    const updateBalanceInDatabase = async (newBalance) => {
        try {
            await axios.post(`http://localhost:5001/api/user/balance/${username}`, { balance: newBalance });
            console.log('Balance updated successfully');
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    // Function to handle symbol swap
    const handleSymbolSwap = (index) => {
        setUserChoices((prevChoices) => {
            const newChoices = [...prevChoices];
            newChoices[index] = symbolOptions[(symbolOptions.indexOf(newChoices[index]) + 1) % symbolOptions.length]; // Swap to the next symbol
            return newChoices;
        });
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const handleGameClick = () => {
        navigate('/games');
    };

    const handleleaderboardClick = () => {
        navigate('/csgo_leaderboard');
    };

    const handleHomeClick = () => {
        navigate('/home');
    };

    // Function to handle multiplier clicks
    const handleMultiplierClick = (value) => {
        const currentBetAmount = parseInt(betAmount, 10); // Use parseInt to get the integer value
        if (!isNaN(currentBetAmount)) {
            const newBetAmount = Math.floor(currentBetAmount * value); // Calculate new bet amount and floor it to an integer
            setBetAmount(newBetAmount); // Update state with the new bet amount
        } else {
            alert('Please enter a valid bet amount before selecting a multiplier.');
        }
    };

        // Function to toggle game activation
        const toggleGameStatus = () => {
            setIsGameActive((prevStatus) => {
                const newStatus = !prevStatus; // Toggle the game status
                alert(`Game is now ${newStatus ? 'activated' : 'deactivated'}.`);
                return newStatus; // Return the new status to update the state
            });
        };
    return (
        <div className="game-page-container">
            <div className="game-header">
                <h1>
                    <img src={dice_icon} alt="CSGO Empire Logo" className="header-icon" />
                    CSGO EMPIRE
                </h1>

                <div className="csgo-navbar">
                    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                        <div className="csgo-sidebar-buttons">
                            <button className="csgo-home-button" onClick={handleHomeClick}>Home</button>
                            <button className="csgo-deposit-button" onClick={handleDepositClick}>Deposit</button>
                            <button className="csgo-withdraw-button" onClick={handleWithdrawClick}>Withdraw</button>
                            <button className="csgo-game-button" onClick={handleGameClick}>Games</button>
                            <button className="csgo-leaderboard-button" onClick={handleleaderboardClick}>LeaderBoard</button>
                        </div>
                    </div>

                    {/* Hamburger Menu Icon */}
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <div className="menu-icon"></div>
                    </button>
                </div>
            </div>

            <div className="rolling-section">
                <div className="rolling-indicator">
                    <h2>ROLLING</h2>
                </div>
                <div className="roll-symbols">
                    <div
                        className={`roll-symbol`} // Left User Symbol
                        onClick={() => handleSymbolSwap(0)} // Click to swap left symbol
                    >
                        {userChoices[0]}
                    </div>
                    <div
                        className={`roll-symbol ${rolling ? 'rolling-active' : ''}`} // Random Symbol in the Middle
                    >
                        {randomSymbol}
                    </div>
                    <div
                        className={`roll-symbol`} // Right User Symbol
                        onClick={() => handleSymbolSwap(1)} // Click to swap right symbol
                    >
                        {userChoices[1]}
                    </div>
                </div>
            </div>

            <div className="previous-rolls-section">
                <h3>PREVIOUS ROLLS</h3>
                <div className="previous-rolls">
                    {previousRolls.map((roll, index) => (
                        <div key={index} className="previous-roll">
                            {roll}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bet-controls">
                <input
                    type="number"
                    value={betAmount}
                    onChange={handleBetChange}
                    placeholder="Enter Bet Amount"
                />
                <div className="bet-buttons">
                    <button onClick={handleClearBet}>CLEAR</button>
                    <button onClick={() => handleMultiplierClick(2)}>x2</button>
                    <button onClick={() => handleMultiplierClick(4)}>x4</button>
                    <button onClick={() => handleMultiplierClick(6)}>x6</button>
                    <button onClick={() => handleMultiplierClick(10)}>x10</button>
                </div>
                <p style={{ color: 'white', marginTop: '10px' }}>
                    Balance: {balance.toFixed(2)}  {/* Show balance with 2 decimal places */}
                </p>
                {/* Refresh Balance Button */}
                <button onClick={fetchBalance} style={{ marginTop: '10px' }}>Refresh Balance</button>
            </div>

            <div className="total-bets-section">
                <div className="bet-box">
                    <button className={`coin ${rolling ? 'coin-rolling' : ''}`} onClick={handleBetClick}>
                        <p>Bet</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GamePage;