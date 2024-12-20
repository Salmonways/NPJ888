import React from 'react';
import './Admin_profit.css';
import { Link } from 'react-router-dom';
import imageurl from './assets/admin_profit.png'; // Ensure the path is correct


const AdminDashboard = () => {
  return (
    <div className="admin-profit-container">
      <header className="admin-profit-navbar">
        <Link to="/home">
            <h1>NPJ888</h1>
          </Link>
        <nav>
          <Link to="/admin_account"><button>Account</button></Link>
          <Link to="/admin_game"><button>Game</button></Link>
          <Link to="/admin_profit"><button>Profit & Loss</button></Link>
          <Link to="/admin_analytic"><button>Analytics</button></Link>
        </nav>
      </header>

      <div className="image-background">
        {/* This div will hold your full-screen image */}
        <img src={imageurl} alt="Profit and Loss Table" className="background-img" />
      </div>
    </div>
  );
};

export default AdminDashboard;