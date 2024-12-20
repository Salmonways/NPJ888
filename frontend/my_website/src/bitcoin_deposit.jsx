import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import './bitcoin_deposit.css';

const BitcoinDeposit = () => {
    const { username, setBalance, userId } = useContext(UserContext);
    const [depositAmount, setDepositAmount] = useState('50.00');
    const [userBalance, setUserBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);

    const fetchUserBalance = async (userId) => {
        console.log('Fetching user balance for user ID:', userId);
        try {
            const response = await axios.get(`http://localhost:5001/api/user/balanceById/${userId}`);
            console.log('Balance response:', response.data);
            return response.data.balance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            return null;
        }
    };

    const fetchTransactions = async (userId) => {
        console.log('Fetching transactions for user ID:', userId);
        try {
            const response = await axios.get(`http://localhost:5001/api/user/transactions/${userId}`);
            console.log('Transactions response:', response.data); 
            setTransactions(response.data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        const getBalanceAndTransactions = async () => {
            if (userId) {
                console.log('Initializing balance and transaction fetch for user ID:', userId);
                const balance = await fetchUserBalance(userId);
                if (balance !== null) {
                    setUserBalance(balance);
                    setBalance(balance);
                }
                await fetchTransactions(userId);
            }
        };
        getBalanceAndTransactions();
    }, [userId, setBalance]);

    // New useEffect for refreshing transactions every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (userId) {
                fetchTransactions(userId);
            }
        }, 1000); // 3000 ms = 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [userId]); // Add userId as dependency to fetch transactions for the correct user
        // New useEffect for refreshing balance every 1 second
    useEffect(() => {
        const balanceInterval = setInterval(async () => {
            if (userId) {
                const updatedBalance = await fetchUserBalance(userId);
                if (updatedBalance !== null) {
                    setUserBalance(updatedBalance);
                    setBalance(updatedBalance);
                }
            }
        }, 1000); // Refresh balance every 1 second

        return () => clearInterval(balanceInterval); // Cleanup interval on component unmount
    }, [userId, setBalance]);

    const handleBalanceChange = (e) => {
        console.log('Deposit amount changed:', e.target.value);
        setDepositAmount(e.target.value);
    };

    const handleConfirm = async () => {
        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            console.log('Invalid amount entered:', depositAmount);
            alert("Please enter a valid amount.");
            return;
        }

        console.log(`Attempting deposit for userId: ${userId}, amount: ${amount}`);
        try {
            const response = await axios.post('http://localhost:5001/api/update-balance', { 
                userId, 
                amount 
            });

            if (response.status === 200) {
                console.log('Balance updated successfully:', response.data);
                // Additional logic here
            }
        } catch (error) {
            console.error('Error during balance update or transaction recording:', error);
        }
    };

    const refreshBalance = async () => {
        const updatedBalance = await fetchUserBalance(userId);
        if (updatedBalance !== null) {
            setUserBalance(updatedBalance); 
            setBalance(updatedBalance); 
            alert("Balance refreshed successfully.");
        }
    };

    return (
        <div className="bitcoin-deposit-container">
            <h1 className="bitcoin-deposit-title">Deposit</h1>
            <div className="bitcoin-deposit-box">
                <div className="bitcoin-deposit-header">
                    <span className="bitcoin-icon">₿</span>
                    <span className="bitcoin-name">Bitcoin</span>
                    <input 
                        type="text"
                        value={depositAmount} 
                        onChange={handleBalanceChange}
                        className="bitcoin-balance-input"
                    />
                    <span className="balance-text">BTC Balance</span>
                </div>
                
                <div className="bitcoin-wallet-section">
                    <div className="wallet-address-container">
                        <p className="wallet-label">Your bitcoin wallet address</p>
                        <span className="bitcoin-wallet-address">1A1zP1eP5QGefi2DMPtFfTL5SLmv7DivfNa</span>
                    </div>
                    <div className="transaction-confirmation-row">
                        <p className="transaction-confirmation-label">Transaction confirmation</p>
                        <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
                    </div>
                </div>

                <div className="bitcoin-transaction-history">
                    <div className="transaction-header">
                        <span>🕒 Date time</span>
                        <span>Amount BTC</span>
                        <span>Transaction ID</span>
                        <span>Status</span>
                    </div>
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <div className="transaction-item" key={tx.transactionId}> {/* Use transactionId from the response */}
                                <span>{new Date(tx.date).toLocaleString()}</span> {/* Format date to a readable format */}
                                <span>{tx.amount} BTC</span>
                                <span>{tx.transactionId}</span> {/* Use transactionId from the response */}
                                <span className={tx.status === 'Confirmed' ? 'confirmed' : 'pending'}>{tx.status}</span>
                            </div>
                        ))
                    ) : (
                        <div>No transactions available.</div>
                    )}
                </div>

                <div className="user-balance-display">
                    <p>Your Current Balance: {userBalance.toFixed(2)} BTC</p>
                    <button className="refresh-button" onClick={refreshBalance}>Refresh Balance</button>
                </div>
            </div>
        </div>
    );
};

export default BitcoinDeposit;