import React, { useState } from 'react';
import './Deposit.css'; // Import the CSS for styling
import { useNavigate } from 'react-router-dom';

function Deposit() {
    const [selectedCrypto, setSelectedCrypto] = useState(null);

    const cryptos = [
        { name: 'Bitcoin', symbol: '₿', color: '#F7931A' },
        { name: 'Bitcoin cash', symbol: '฿', color: '#4CAF50' },
        { name: 'Ethereum', symbol: 'Ξ', color: '#627EEA' },
        { name: 'Litecoin', symbol: 'Ł', color: '#B8B8B8' },
        { name: 'Dogecoin', symbol: 'Ð', color: '#C2A633' },
        { name: 'Tether', symbol: '₮', color: '#50AF95' }
    ];

    const navigate = useNavigate(); // To programmatically navigate

    const handleCryptoSelect = (index) => {
        setSelectedCrypto(index);
        
        // Check if the selected cryptocurrency is Bitcoin
        if (cryptos[index].name === 'Bitcoin') {
            navigate('/bitcoin_deposit'); // Navigate to Bitcoin deposit page
        }
    };

    const handleWithdrawClick = () => {
        navigate('/withdraw');
    };

    const handleGameClick = () => {
        navigate('/games');
    };

    const handleHomeClick = () => {
        navigate('/home');
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Toggle Sidebar open/close
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="deposit-container">
            <div className="deposit-navbar">
                <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="deposit-sidebar-buttons">
                        <button className="deposit-home-button" onClick={handleHomeClick}>Home</button>
                        <button className="deposit-withdraw-button" onClick={handleWithdrawClick}>Withdraw</button>
                        <button className="deposit-game-button" onClick={handleGameClick}>Games</button>
                    </div>
                </div>

                {/* Hamburger Menu Icon */}
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <div className="menu-icon"></div>
                </button>
            </div>
            <h1 className="deposit-title">Deposit</h1>
            <h2 className="crypto-title">Cryptocurrency</h2>
            <div className="crypto-options">
                {cryptos.map((crypto, index) => (
                    <div
                        key={crypto.name}
                        className={`crypto-item ${selectedCrypto === index ? 'selected' : ''}`}
                        onClick={() => handleCryptoSelect(index)}
                    >
                        <span
                            className="crypto-symbol"
                            style={{ backgroundColor: crypto.color }}
                        >
                            {crypto.symbol}
                        </span>
                        <span className="crypto-name">{crypto.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Deposit;