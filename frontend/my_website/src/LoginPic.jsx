import React, { useState, useContext } from 'react';
import imageurl from './assets/login_pic.png'; // Ensure the path is correct
import './LoginPic.css'; // Ensure your CSS file is correctly linked
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import UserContext

function LoginPic() {
    const [username, setUsername] = useState(''); // State for username
    const [password, setPassword] = useState(''); // State for password
    const { login } = useContext(UserContext); // Use the login function from UserContext
    const navigate = useNavigate(); // Initialize navigate function

    // Handle input changes
    const handleUsernameChange = (e) => {
        setUsername(e.target.value); // Update username state
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value); // Update password state
    };


// In your LoginPic component
const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!username || !password) {
        alert("Please fill in both username and password.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        if (data.success) {
            alert('Login successful!');
            
            // Now pass both username and userId to login
            login(username, data.userId); // Pass userId here

            navigate("/games");
        } else {
            alert(data.message || 'Invalid username or password');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
};
    // Handle Admin Login button click
    const handleAdminLoginClick = () => {
        navigate('/admin_login'); // Navigate to the admin login page
    };

    return (
        <div className="login-container">
            <div className="left-half">
                <img src={imageurl} alt="Login" className='login-image' />
            </div>

            <div className='right-half'>
                <h1>NPJ888</h1>
                <h2>BITCOIN CASINO</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="password-input"
                    value={username} // Set input value
                    onChange={handleUsernameChange} // Handle username change
                />
                <input
                    type="password" // Change to password type for security
                    placeholder="Password"
                    className="password-input"
                    value={password} // Set input value
                    onChange={handlePasswordChange} // Handle password change
                />
                <button
                    className="login-button"
                    onClick={handleLoginClick} // Call the function on button click
                >
                    Login
                </button>

                <p className="register-option">Don't have an account?<Link to="/register" className="register-link">Register here</Link></p>

                {/* Admin Login Button */}
                <button
                    className="admin-loginpage-button" // Add CSS to style the admin button separately
                    onClick={handleAdminLoginClick} // Navigate to the admin login page
                >
                    Login for Admin
                </button>
            </div>
        </div>
    );
}

export default LoginPic;