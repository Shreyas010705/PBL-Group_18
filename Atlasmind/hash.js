const mysql = require('mysql2'); // Use mysql2 for better compatibility
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shreyas@2005',
    database: 'shreyas'
});

db.connect();

db.query('SELECT id, password FROM users', async (err, results) => {
    if (err) throw err;

    for (const user of results) {
        // Only hash if not already hashed
        if (!user.password.startsWith('$2a$')) {
            const hash = await bcrypt.hash(user.password, 10);
            db.query('UPDATE users SET password = ? WHERE id = ?', [hash, user.id]);
        }
    }

    console.log('All passwords hashed!');
    db.end();
});
