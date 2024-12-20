import React, { useState } from 'react';
import './Admin_login.css'; // Ensure this is the correct path to your CSS file
import { Link, useNavigate } from 'react-router-dom';


function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginClick = async () => {
        try {
            // Ensure username and password are filled
            if (!username || !password) {
                alert('Please fill both username and password');
                return;
            }
    
            // Send a POST request to the server to log in
            const response = await fetch('http://localhost:5001/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Successful login
                alert(data.message);
                navigate('/admin_account'); // Redirect on successful login
            } else {
                // Handle invalid login
                alert(data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
    };


    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                {/* Title and other text side by side */}
                <div className="title-container">
                    <h1 className="title">NPJ888</h1>
                    <div className="right-text">
                        <h2 className="admin-login">LOG IN FOR ADMIN</h2>
                        <h3 className="casino-name">BITCOIN CASINO</h3>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Username"
                    className="admin-login-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="admin-login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="admin-login-button"
                    onClick={handleLoginClick}
                >
                    LOG IN
                </button>
            </div>
        </div>
    );
}

export default AdminLogin;