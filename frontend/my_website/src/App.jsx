import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPic from './LoginPic'; // Adjust the import as needed
import Register from './Register'; // Ensure you have this component
import Games from './Games'; // Ensure you have a Games component
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Home from './Home';
import CSGO_empire from './csgo_empire';
import CSGO_leaderboard from './csgo_leaderboard';
import { UserProvider } from './UserContext'; // Import UserProvider
import Admin_login from './Admin_login';
import Admin_account from './Admin_account';
import Admin_game from './Admin_game';
import Admin_profit from './Admin_profit';
import Admin_analytic from './Admin_Analytic';
import Bitcoin_deposit from './bitcoin_deposit';
import Bitcoin_withdraw from './bitcoin_withdraw';

function App() {

    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPic />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/" element={<Home />} /> {/* Default route */}
                    <Route path="*" element={<Navigate to="/" />} />  {/* Redirect to login for any unknown routes */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/deposit" element={<Deposit />} />
                    <Route path="/withdraw" element={<Withdraw />} />
                    <Route path="/csgo_empire" element={<CSGO_empire/>} />
                    <Route path="/csgo_leaderboard" element={<CSGO_leaderboard/>} />
                    <Route path="/admin_login" element={<Admin_login/>} />
                    <Route path="/admin_account" element={<Admin_account/>} />
                    <Route path="/admin_game" element={<Admin_game/>} />
                    <Route path="/admin_profit" element={<Admin_profit/>} />
                    <Route path="/admin_analytic" element={<Admin_analytic/>} />
                    <Route path="/bitcoin_deposit" element={<Bitcoin_deposit/>} />
                    <Route path="/bitcoin_withdraw" element={<Bitcoin_withdraw/>} />

                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;