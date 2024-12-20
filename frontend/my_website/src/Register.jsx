import React, { useState } from 'react';
import imageurl from './assets/register_pic.png'; // Ensure the path is correct
import './Register.css';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'; // Import mail, lock, and user icons from react-icons

function Register() {
    const [isChecked, setIsChecked] = useState(false); // State to track checked status
    const [username, setUsername] = useState(''); // State for username
    const [email, setEmail] = useState(''); // State for email
    const [password, setPassword] = useState(''); // State for password
    const navigate = useNavigate(); // Initialize navigate function

    // Toggle the checked state
    const handleRadioClick = () => {
        setIsChecked(!isChecked); // Toggle the isChecked state
    };

    // Handle input changes
    const handleUsernameChange = (e) => {
        setUsername(e.target.value); // Update username state
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value); // Update email state
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value); // Update password state
    };

    // Handle Sign Up button click
    const handleSignUpClick = async (e) => {
        e.preventDefault(); // Prevent default button action
        
        // Check if all fields are filled
        if (!username || !email || !password) {
            alert("Please fill in all fields."); // Alert if fields are empty
            return;
        }

        // Check if terms are agreed
        if (!isChecked) {
            alert("You must agree to the Terms and Conditions to sign up."); // Alert if terms not checked
            return;
        }

        // Send registration info to the backend
        try {
            const response = await fetch('http://localhost:5001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }), // Correctly send username, email, and password
            });

            if (!response.ok) {
                throw new Error('Failed to register'); // Throw error if response is not ok
            }

            const data = await response.text(); // Or response.json() based on your API response
            alert(data); // Show success message
            navigate("/login"); // Redirect to login page after successful registration
        } catch (error) {
            alert('Registration failed: ' + error.message); // Alert in case of error
        }
    };


    return (
        <div className="register-container">
            <div className="left-half">
                <img src={imageurl} alt="Register" className='register-image' />
            </div>
            
            <div className='right-half'>
                <h1>NPJ888</h1>
                <h2>BITCOIN CASINO</h2>
                <div className="username-wrapper">
                    <FaUser className="icon" />
                    <input 
                        type="text" 
                        placeholder="Enter your username" 
                        className="username-input"
                        value={username} // Set input value
                        onChange={handleUsernameChange} // Handle username change 
                    />
                </div>
                <div className="email-wrapper">
                    <FaEnvelope className="icon" />
                    <input 
                        type="text" 
                        placeholder="Enter your email address" 
                        className="email-input"
                        value={email} // Set input value
                        onChange={handleEmailChange} // Handle email change 
                    />
                </div>
                <div className="password-wrapper">
                    <FaLock className="icon" />
                    <input 
                        type="password" // Changed to password type for security
                        placeholder="Enter your password" 
                        className="register_password-input" 
                        value={password} // Set input value
                        onChange={handlePasswordChange} // Handle password change
                    />
                </div>

                <div className="terms-container">
                    <input 
                        type="radio" 
                        id="terms" 
                        name="terms" 
                        className="terms-radio" 
                        checked={isChecked} 
                        onClick={handleRadioClick} // Keep original onClick handling
                    />
                    <label htmlFor="terms" className="terms-label">
                        I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link>Privacy Policy</Link>
                    </label>
                </div>
                <button className="signup-button" onClick={handleSignUpClick}>Sign Up</button>
            </div>
        </div>
    );
}

export default Register;