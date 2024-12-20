import React, { useState, useEffect } from 'react';
import './Admin_account.css';
import { Link } from 'react-router-dom'; // Import Link

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the backend when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched users:', data);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Function to handle deleting a user
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUsers(users.filter(user => user.User_id !== id)); // Update state after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Function to handle toggling user status
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const response = await fetch(`http://localhost:5001/api/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update state after status change
      setUsers(users.map(user => (user.User_id === id ? { ...user, Status: newStatus } : user)));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="dashboard-container">
        <header className="admin-account-navbar">
            <Link to="/home">
                <h1>NPJ888</h1>
            </Link>
            <nav>
                <Link to="/admin_account"><button>Account</button></Link>
                <Link to="/admin_game"><button>Game</button></Link> {/* Link to the game page */}
                <Link to="/admin_profit"><button>Profit & Loss</button></Link>
                <Link to="/admin_analytic"><button>Analytics</button></Link>
            </nav>
        </header>

      <table className="admin-account-users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Delete</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.User_id}>
              <td>{user.User_id}</td>
              <td>{user.Username}</td>
              <td>{user.Balance !== undefined ? user.Balance.toFixed(2) : 'N/A'}</td>
              <td>{user.Status}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(user.User_id)}>
                  Delete
                </button>
              </td>
              <td>
                <button className="status-button" onClick={() => toggleStatus(user.User_id, user.Status)}>
                  {user.Status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;