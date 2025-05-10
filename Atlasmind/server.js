const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// VERY IMPORTANT - Add CORS properly
app.use(cors({
    origin: '*',       // allow all origins (you can restrict later)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());

// Use a connection pool instead of a single connection
const db = mysql.createPool({
    connectionLimit: 10, // max number of connections in pool
    host: 'localhost',
    user: 'root',
    password: 'Shreyas@2005',
    database: 'shreyas'
});

// Helper function to query the database with promises (optional but recommended)
function query(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

// API route for login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt received. Email:", email);

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' });
    }

    try {
        const results = await query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Email or password is incorrect.' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing password:', err);
                return res.status(500).json({ message: 'Server error. Please try again later.' });
            }

            if (isMatch) {
                return res.status(200).json({ message: 'Login successful' });
            } else {
                return res.status(401).json({ message: 'Email or password is incorrect.' });
            }
        });
    } catch (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// API route for verifying access code
const ACCESS_KEY = "Atlas";

app.post('/verify-access-code', (req, res) => {
    const { accessCode } = req.body;

    if (!accessCode) {
        return res.status(400).json({ message: 'Please provide an access code' });
    }

    if (accessCode === ACCESS_KEY) {
        return res.status(200).json({ message: 'Access code verified successfully' });
    } else {
        return res.status(403).json({ message: 'Incorrect access code' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
