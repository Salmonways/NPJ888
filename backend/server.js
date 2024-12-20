const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Use the promise wrapper
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 5001;

const crypto = require('crypto');

const bcrypt = require('bcrypt');
const saltRounds = 10; // Defines the complexity of the hash

// Middleware
app.use(cors()); // Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Update this to your frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json()); // Parse JSON bodies

// MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'root', // replace with your MySQL password
    database: 'CSS325_project', // replace with your MySQL database name
    port: 8889 // adjust if needed
});



//use this command to encrypt new admin user's password: UPDATE users SET Password = TO_BASE64(AES_ENCRYPT(Password, 'your_secret_key')); where User_id =???
//register
app.post('/register', async (req, res) => {
    const { username, email, password, status = 'active', user_type = 'customer' } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).send('Please provide username, email, and password.');
    }

    try {
        // Ensure the AES key is 32 bytes
        const aesKey = crypto.createHash('sha256').update('your_secret_key').digest(); // 32 bytes key using SHA-256

        // Encrypt the password with AES
        const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, Buffer.alloc(16, 0)); // IV is 16 bytes (all zeros)
        let encryptedPassword = cipher.update(password, 'utf8', 'base64');
        encryptedPassword += cipher.final('base64');

        // Hash the encrypted password with bcrypt
        const hashedPassword = await bcrypt.hash(encryptedPassword, 10); // 10 salt rounds

        // SQL query to insert the data
        const query = 'INSERT INTO users (username, email, password, status, user_type, Game_id) VALUES (?, ?, ?, ?, ?, 2)';
        await db.query(query, [username, email, hashedPassword, status, user_type]);

        res.send('User registered successfully!'); // Success message
    } catch (err) {
        console.error('Error inserting data: ' + err);
        return res.status(500).send('Error registering user.');
    }
});
// Registration endpoint
/*
app.post('/register', async (req, res) => {
    const { username, email, password, status = 'active', user_type = 'customer' } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).send('Please provide username, email, and password.');
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // SQL query to insert the data
        const query = 'INSERT INTO users (username, email, password, status, user_type,Game_id) VALUES (?, ?, ?,status, user_type,2)';
        await db.query(query, [username, email, hashedPassword, status, user_type]);

        res.send('User registered successfully!'); // Success message
    } catch (err) {
        console.error('Error inserting data: ' + err);
        return res.status(500).send('Error registering user.');
    }
});
*/

//login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Log the login attempt
        console.log(`Login attempt for: ${username}`);

        // Query the database for the user by username
        const [results] = await db.query(
            "SELECT User_id, Username, Password, User_type FROM users WHERE Username = ?",
            [username]
        );

        if (results.length > 0) {
            const storedPasswordHash = results[0].Password;
            const userType = results[0].User_type;
            console.log(`User found in database: ${JSON.stringify(results[0])}`);

            // Ensure the AES key is 32 bytes
            const aesKey = crypto.createHash('sha256').update('your_secret_key').digest(); // 32 bytes key using SHA-256

            let match = false; // Define match here for use in both admin and customer logic

            if (userType === 'admin') {
                console.log('Admin login: Decrypting password.');

                // Decrypt the AES-encrypted password
                const [decryptedResults] = await db.query(
                    "SELECT CONVERT(AES_DECRYPT(FROM_BASE64(Password), 'your_secret_key') USING utf8) AS decryptedPassword FROM users WHERE Username = ?",
                    [username]
                );

                const decryptedPassword = decryptedResults[0].decryptedPassword;
                console.log(`Decrypted password: ${decryptedPassword}`);

                // Compare the entered password with the decrypted password
                if (decryptedPassword) {
                    match = password === decryptedPassword;
                }
            } else {
                // Encrypt the entered password with AES, just like during registration
                const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, Buffer.alloc(16, 0)); // IV is 16 bytes (all zeros)
                let encryptedPassword = cipher.update(password, 'utf8', 'base64');
                encryptedPassword += cipher.final('base64');

                // Compare the AES-encrypted entered password with the stored bcrypt hash
                match = await bcrypt.compare(encryptedPassword, storedPasswordHash);

                console.log(`Entered password AES-encrypted: ${encryptedPassword}`);
                console.log(`Stored hashed password: ${storedPasswordHash}`);
                console.log(`Bcrypt comparison result: ${match}`);
            }

            if (match) {
                const userId = results[0].User_id;
                return res.json({ success: true, userId });
            } else {
                console.log("Login failed: Invalid password");
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        } else {
            console.log("Login failed: User not found");
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
});
/*
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [results] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (results.length > 0) {
            const userId = results[0].User_id; // Assuming you have this column in the users table
            return res.json({ success: true, userId }); // Send back the userId along with success
        } else {
            return res.json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Database error' });
    }
});

*/
//csgo emipre
// Get user balance endpoint
app.get('/api/user/balance/:username', async (req, res) => {
    const { username } = req.params;

    // SQL query to get the user's balance
    try {
        const [results] = await db.query('SELECT balance FROM users WHERE username = ?', [username]);
        if (results.length > 0) {
            res.json({ balance: results[0].balance }); // Respond with the balance
        } else {
            res.status(404).send('User not found.');
        }
    } catch (err) {
        console.error('Error fetching balance: ' + err);
        return res.status(500).send('Error fetching balance.');
    }
});

// Update user balance endpoint
app.post('/api/user/balance/:username', async (req, res) => {
    const { username } = req.params;
    const { balance } = req.body; // Get new balance from the request body

    // SQL query to update the user's balance
    try {
        await db.query('UPDATE users SET balance = ? WHERE username = ?', [balance, username]);
        res.send('Balance updated successfully.'); // Success message
    } catch (err) {
        console.error('Error updating balance: ' + err);
        return res.status(500).send('Error updating balance.');
    }
});


//leaderboard
// Function to fetch daily winners from the database
const getDailyWinnersFromDatabase = async () => {
    const query = 'SELECT users.username AS Username, Profit FROM leaderboard LEFT JOIN users ON leaderboard.User_id = users.User_id WHERE win_type = "daily" ORDER BY Profit DESC LIMIT 4'; // Adjust query as needed
    const [results] = await db.query(query);
    return results;
};

// Function to fetch monthly winners from the database
const getMonthlyWinnersFromDatabase = async () => {
    const query = 'SELECT users.username AS Username, Profit FROM leaderboard LEFT JOIN users ON leaderboard.User_id = users.User_id WHERE win_type = "monthly" ORDER BY Profit DESC LIMIT 4'; // Adjust query as needed
    const [results] = await db.query(query);
    return results;
};

// Get leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
    try {
        // Fetch daily and monthly winners from your database
        const dailyWinners = await getDailyWinnersFromDatabase();
        const monthlyWinners = await getMonthlyWinnersFromDatabase();

        // Send back the result
        res.json({ dailyWinners, monthlyWinners });
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

//admin login
// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Retrieve the encrypted password and user information
        const [results] = await db.query('SELECT User_id, User_type, Password FROM users WHERE Username = ?', [username]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const admin = results[0];

        // Decrypt the stored encrypted password
        const decryptQuery = 'SELECT CONVERT(AES_DECRYPT(FROM_BASE64(?), ?) USING utf8) AS decryptedPassword';
        const [decryptedResult] = await db.query(decryptQuery, [admin.Password, 'your_secret_key']);
        const decryptedPassword = decryptedResult[0]?.decryptedPassword;

        if (admin.User_type === 'admin' && decryptedPassword === password) {
            return res.json({ message: 'Login successful!', adminId: admin.User_id });
        } else {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error('Error in admin login:', error);
        return res.status(500).json({ message: 'Database query error' });
    }
});


/*
// Get admin login endpoint
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const [results] = await db.query('SELECT * FROM users WHERE Username = ?', [username]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const admin = results[0];

        // Check user type and compare passwords
        if (admin.User_type === 'admin' && admin.Password === password) { // Ensure user type is admin
            return res.json({ message: 'Login successful!', adminId: admin.User_id });
        } else {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Database query error' });
    }
});
*/
// Get all users endpoint
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users'); // Fetch users
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error fetching users' }); // Return an error response
    }
});

//delete user endpoint
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM users WHERE User_id = ?', [id]); // Delete user by User_id
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  });

// Update user status endpoint
app.patch('/api/users/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      await db.query('UPDATE users SET Status = ? WHERE User_id = ?', [status, id]); // Update user status
      res.status(200).json({ message: 'Status updated' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating status' });
    }
  });


  app.get('/api/games', async (req, res) => {
    try {
      const games = await db.query(`
        SELECT g.Game_id, g.Game_name, g.Game_type, g.Status, COUNT(u.User_id) AS Current_players
        FROM games g
        LEFT JOIN users u ON g.Game_id = u.Game_id
        GROUP BY g.Game_id, g.Game_name, g.Game_type, g.Status
      `);
      res.json(games);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Delete game
  app.delete('/api/games/:id', async (req, res) => {
    try {
      await db.query('DELETE FROM games WHERE Game_id = ?', [req.params.id]);
      res.sendStatus(204); // No content
    } catch (error) {
      console.error('Error deleting game:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update game status
  app.patch('/api/games/:id/status', async (req, res) => {
    const { status } = req.body;
    try {
      await db.query('UPDATE games SET Status = ? WHERE Game_id = ?', [status, req.params.id]);
      res.sendStatus(204); // No content
    } catch (error) {
      console.error('Error updating game status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
// current player on games
app.patch('/api/games/:id/join', async (req, res) => {
    try {
        await db.query('UPDATE games SET current_players = current_players + 1 WHERE Game_id = ?', [req.params.id]);
        res.sendStatus(204); // No content
    } catch (error) {
        console.error('Error joining game:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Leave game
app.patch('/api/games/:id/leave', async (req, res) => {
    try {
        await db.query('UPDATE games SET current_players = GREATEST(current_players - 1, 0) WHERE Game_id = ?', [req.params.id]);
        res.sendStatus(204); // No content
    } catch (error) {
        console.error('Error leaving game:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//deposit & withdraw
app.get('/api/user/balanceById/:userId', async (req, res) => {
    const userId = req.params.userId;
    
  
    // Validate that userId is a number
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
  
    try {
      const [rows] = await db.query('SELECT balance FROM users WHERE User_id = ?', [userId]);
  
      if (rows.length > 0) {
        res.json({ balance: rows[0].balance });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });







  app.post('/api/update-balance', async (req, res) => {

    const { userId, amount } = req.body;

    if (!userId || isNaN(amount)) {
        console.warn('Invalid input data:', { userId, amount });
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const updateQuery = 'UPDATE users SET balance = balance + ? WHERE User_id = ?';
        const [updateResult] = await db.query(updateQuery, [amount, userId]);

        if (updateResult.affectedRows === 0) {
            console.warn('No rows affected during balance update for userId:', userId);
            return res.status(404).json({ error: 'User not found or balance unchanged' });
        }


        const transactionId = uuidv4();

        const insertTransactionQuery = 'INSERT INTO transactions (userId, amount, transactionId, date, status) VALUES (?, ?, ?, NOW(), ?)';
        const transactionData = [userId, amount, transactionId, 'Confirmed'];
        
        const [insertResult] = await db.query(insertTransactionQuery, transactionData);

        return res.status(200).json({ message: 'Balance updated successfully and transaction recorded' });
    } catch (error) {
        console.error('Error updating balance or recording transaction:', error);
        return res.status(500).json({ error: 'Failed to update balance or record transaction' });
    }
});



app.get('/api/user/transactions/:userId', async (req, res) => {
    const userId = req.params.userId;
    const start = Date.now(); // Start timing
    try {
        const [rows] = await db.query('SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC limit 3', [userId]);
        const end = Date.now(); // End timing
        res.json(rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.post('/api/update-withdraw-balance', async (req, res) => {

    const { userId, amount } = req.body;

    if (!userId || isNaN(amount)) {
        console.warn('Invalid input data:', { userId, amount });
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const updateQuery = 'UPDATE users SET balance = balance - (?+0.01) WHERE User_id = ?';
        const [updateResult] = await db.query(updateQuery, [amount, userId]);

        if (updateResult.affectedRows === 0) {
            console.warn('No rows affected during balance update for userId:', userId);
            return res.status(404).json({ error: 'User not found or balance unchanged' });
        }


        const transactionId = uuidv4();

        const insertTransactionQuery = 'INSERT INTO transactions (userId, amount, transactionId, date, status) VALUES (?, -?.01, ?, NOW(), ?)';
        const transactionData = [userId, amount, transactionId, 'Confirmed'];
        
        const [insertResult] = await db.query(insertTransactionQuery, transactionData);

        return res.status(200).json({ message: 'Balance updated successfully and transaction recorded' });
    } catch (error) {
        console.error('Error updating balance or recording transaction:', error);
        return res.status(500).json({ error: 'Failed to update balance or record transaction' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});