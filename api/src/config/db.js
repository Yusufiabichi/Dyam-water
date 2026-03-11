import mysql from 'mysql2';

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root@123',
  database: process.env.DB_NAME || 'dyam_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to MySQL database successfully');
  }
});

export const validateDbConnection = () =>
  new Promise((resolve, reject) => {
    db.query('SELECT 1 AS ok', (err, rows) => {
      if (err) return reject(err);
      return resolve(rows?.[0]?.ok === 1);
    });
  });

export default db;
