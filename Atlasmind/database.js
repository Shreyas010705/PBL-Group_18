const mysql = require('mysql');

// Create a connection to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shreyas@2005',  // replace with your actual password
  database: 'shreyas'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Array of users to insert or update
const users = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
  { email: 'user3@example.com', password: 'password3' },
  { email: 'user4@example.com', password: 'password4' },
  { email: 'user5@example.com', password: 'password5' }
];

// Function to insert or update users
const insertOrUpdateUsers = () => {
  let completedQueries = 0;

  users.forEach((user) => {
    // Check if user already exists
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [user.email], (err, results) => {
      if (err) {
        console.error('Error checking user existence:', err.stack);
        return;
      }

      if (results.length > 0) {
        // User exists, update the password
        const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
        connection.query(updateQuery, [user.password, user.email], (err, result) => {
          if (err) {
            console.error('Error updating user:', err.stack);
            return;
          }
          console.log(`User with email ${user.email} updated.`);
          completedQueries++;
        });
      } else {
        // User does not exist, insert a new user
        const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
        connection.query(insertQuery, [user.email, user.password], (err, result) => {
          if (err) {
            console.error('Error inserting user:', err.stack);
            return;
          }
          console.log(`User with email ${user.email} inserted.`);
          completedQueries++;
        });
      }
    });
  });

  // Check if all queries are completed, then close the connection
  const checkIfAllQueriesCompleted = setInterval(() => {
    if (completedQueries === users.length) {
      clearInterval(checkIfAllQueriesCompleted);
      connection.end((err) => {
        if (err) {
          console.error('Error closing MySQL connection:', err.stack);
        } else {
          console.log('MySQL connection closed.');
        }
      });
    }
  }, 100);  // Check every 100ms
};

// Run the function to insert or update users
insertOrUpdateUsers();
