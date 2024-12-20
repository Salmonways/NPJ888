import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import './bitcoin_withdraw.css';

const BitcoinWithdraw = () => {
    const { username, setBalance, userId } = useContext(UserContext);
    const [depositAmount, setDepositAmount] = useState('50.00');
    const [userBalance, setUserBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [walletAddress, setWalletAddress] = useState(''); // Editable wallet address
    const [transactionFee, setTransactionFee] = useState(0.01); // Static transaction fee
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        setTotalAmount(parseFloat(depositAmount) + transactionFee); // Calculate total amount on depositAmount change
    }, [depositAmount, transactionFee]);

    const fetchUserBalance = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/user/balanceById/${userId}`);
            return response.data.balance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            return null;
        }
    };

    const fetchTransactions = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/user/transactions/${userId}`);
            setTransactions(response.data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        const getBalanceAndTransactions = async () => {
            if (userId) {
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

    useEffect(() => {
        const interval = setInterval(() => {
            if (userId) {
                fetchTransactions(userId);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [userId]);

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

    const handleConfirm = async () => {
        const amount = parseFloat(depositAmount);
        // Check if the wallet address is empty
        if (!walletAddress) {
            alert("Please enter your Bitcoin wallet address.");
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/update-withdraw-balance', { 
                userId, 
                amount 
            });

            if (response.status === 200) {
                console.log('Balance updated successfully:', response.data);
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
        <div className="bitcoin-withdraw-container">
            <h1 className="bitcoin-withdraw-title">Withdraw</h1>
            <div className="bitcoin-withdraw-box">
                <div className="bitcoin-withdraw-header">
                    <span className="bitcoin-withdraw-icon">₿</span>
                    <span className="bitcoin-withdraw-name">Bitcoin</span>
                    <input 
                        type="text"
                        value={depositAmount} 
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="bitcoin-balance-withdraw-input"
                        placeholder="Enter amount"
                    />
                    <span className="balance-withdraw-text">BTC Balance</span>
                </div>
                
                <div className="bitcoin-wallet-withdraw-section">
                    <div className="wallet-address-withdraw-container">
                        <p className="wallet-withdraw-label">Your bitcoin wallet address</p>
                        <input 
                            type="text"
                            value={walletAddress} 
                            onChange={(e) => setWalletAddress(e.target.value)}
                            className="bitcoin-wallet-withdraw-address"
                            placeholder="Enter your Bitcoin address"
                        />
                    </div>
                    <div className="transaction-confirmation-withdraw-row">
                        <p className="transaction-confirmation-withdraw-label">Transaction confirmation</p>
                        <button className="confirm-button-withdraw" onClick={handleConfirm}>Confirm</button>
                    </div>
                </div>

                <div className="transaction-fee-section">
                    <div className="transaction-fee-row">
                        <span>Transaction fee</span>
                        <span>{transactionFee} BTC</span>
                    </div>
                    <div className="total-amount-row">
                        <span>Total amount</span>
                        <span>{totalAmount.toFixed(2)} BTC</span>
                    </div>
                    <p className="minimum-withdraw-warning">*** Minimum Withdraw: 0.01 BTC</p>
                </div>

                <div className="bitcoin-transaction-withdraw-history">
                    <div className="transaction-withdraw-header">
                        <span>🕒 Date time</span>
                        <span>Amount BTC</span>
                        <span>Transaction ID</span>
                        <span>Status</span>
                    </div>
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <div className="transaction-withdraw-item" key={tx.transactionId}>
                                <span>{new Date(tx.date).toLocaleString()}</span>
                                <span>{tx.amount} BTC</span>
                                <span>{tx.transactionId}</span>
                                <span className={tx.status === 'Confirmed' ? 'confirmed' : 'pending'}>{tx.status}</span>
                            </div>
                        ))
                    ) : (
                        <div>No transactions available.</div>
                    )}
                </div>

                <div className="user-balance-withdraw-display">
                    <p>Your Current Balance: {userBalance.toFixed(2)} BTC</p>
                    <button className="refresh-withdraw-button" onClick={refreshBalance}>Refresh Balance</button>
                </div>
            </div>
        </div>
    );
};

export default BitcoinWithdraw;