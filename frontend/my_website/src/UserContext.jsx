import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create UserContext
export const UserContext = createContext();

// Context provider component
export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(null); // Store logged-in username
    const [balance, setBalance] = useState(0); // Store user's balance
    const [userId, setUserId] = useState(null); // Store logged-in userId

    const fetchBalance = async (userId) => {
        if (!userId) {
            console.error('No userId provided to fetch balance');
            return;
        }
    
        try {
            console.log(`Fetching balance for userId: ${userId}`);
            const response = await axios.get(`http://localhost:5001/api/user/balanceById/${userId}`);
            console.log(`Balance fetched: ${response.data.balance}`);
            setBalance(response.data.balance); // Update balance state
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const login = (user, id) => {
        if (!user || !id) {
            console.error('Login error: No user or userId provided');
            return;
        }

        console.log(`User logged in: ${user}, userId: ${id}`);
        setUsername(user); // Set the username
        setUserId(id);     // Set the userId
        fetchBalance(id);  // Fetch balance using the userId
    };

    // This useEffect will only fetch the balance when userId changes
    useEffect(() => {
        if (userId) {
            console.log(`UserId is set to: ${userId}, fetching balance...`);
            fetchBalance(userId);
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ username, userId, balance, setBalance, login }}>
            {children}
        </UserContext.Provider>
    );
};