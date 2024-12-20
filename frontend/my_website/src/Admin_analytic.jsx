import React from 'react';
import './Admin_analytic.css';
import { Link } from 'react-router-dom';
import imageurl from './assets/admin_analytic.png'; // Ensure the path is correct

const AdminDashboard = () => {
  return (
    <div className="admin-analytic-container">
      <header className="admin-analytic-navbar">
        {/* Wrap the NPJ888 text in a Link that points to the home page */}
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

      <div className="admin-analytic-image-background">
        {/* This div will hold your full-screen image */}
        <img src={imageurl} alt="Profit and Loss Table" className="admin-analytic-background-img" />
      </div>
    </div>
  );
};

export default AdminDashboard;