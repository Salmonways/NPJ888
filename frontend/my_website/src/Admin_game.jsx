import React, { useState, useEffect } from 'react';
import './Admin_game.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/games');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Assuming the games data is in the first element of the outer array
                const gamesData = data[0];
                // Check for duplicates based on Game_id
                const uniqueGames = Array.from(new Map(gamesData.map(game => [game.Game_id, game])).values());
     
                setGames(uniqueGames);
            } catch (error) {
                console.error('Error fetching games:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/games/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setGames(games.filter(game => game.Game_id !== id));
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';
        try {
            const response = await fetch(`http://localhost:5001/api/games/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the state with the new status
            setGames(games.map(game => (game.Game_id === id ? { ...game, Status: newStatus } : game)));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="admin-game-dashboard-container">
            <header className="admin-game-navbar">
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
            <table className="admin-game-users-table">
                <thead>
                    <tr>
                        <th>Game Name</th>
                        <th>Current Players</th>
                        <th>Game Type</th>
                        <th>Status</th>
                        <th>Delete</th>
                        <th>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game, index) => (
                        <tr key={game.Game_id}>
                            <td>{game.Game_name}</td>
                            <td>{game.Current_players}</td>
                            <td>{game.Game_type}</td>
                            <td>{game.Status}</td>
                            <td>
                                <button className="admin-game-delete-button" onClick={() => handleDelete(game.Game_id)}>
                                    Delete
                                </button>
                            </td>
                            <td>
                                <button className="admin-game-status-button" onClick={() => toggleStatus(game.Game_id, game.Status)}>
                                    {game.Status === 'Available' ? 'Deactivate' : 'Activate'}
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