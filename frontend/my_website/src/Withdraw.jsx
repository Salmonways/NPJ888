import React, { useState } from 'react';
import './Withdraw.css';
import { useNavigate } from 'react-router-dom';

function Withdraw() {
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const navigate = useNavigate();

    const cryptos = [
        { name: 'Bitcoin', symbol: '₿', color: '#F7931A' },
        { name: 'Bitcoin Cash', symbol: '฿', color: '#4CAF50' },
        { name: 'Ethereum', symbol: 'Ξ', color: '#627EEA' },
        { name: 'Litecoin', symbol: 'Ł', color: '#B8B8B8' },
        { name: 'Dogecoin', symbol: 'Ð', color: '#C2A633' },
        { name: 'Tether', symbol: '₮', color: '#50AF95' }
    ];

    const handleCryptoSelect = (index) => {
        setSelectedCrypto(index);
        if (cryptos[index].name === 'Bitcoin') {
            console.log("Navigating to Bitcoin withdraw page"); // Debugging line
            navigate('/bitcoin_withdraw');
        }
    };

    const handleDepositClick = () => {
        navigate('/deposit');
    };

    const handleGameClick = () => {
        navigate('/games');
    };

    const handleHomeClick = () => {
        navigate('/home');
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="withdraw-container">
            <div className="withdraw-navbar">
                <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="withdraw-sidebar-buttons">
                        <button className="withdraw-home-button" onClick={handleHomeClick}>Home</button>
                        <button className="withdraw-deposit-button" onClick={handleDepositClick}>Deposit</button>
                        <button className="withdraw-game-button" onClick={handleGameClick}>Games</button>
                    </div>
                </div>

                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <div className="menu-icon"></div>
                </button>
            </div>

            <h1 className="withdraw-title">Withdraw</h1>
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

export default Withdraw;