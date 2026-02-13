import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root@123',
  database: 'dyam_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    // Retry connection after 5 seconds
    setTimeout(() => db.connect(), 5000);
  } else {
    console.log('Connected to MySQL database successfully');
  }
});

export default db;
