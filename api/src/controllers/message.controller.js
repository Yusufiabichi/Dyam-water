import db from '../config/db.js';

export const createMessage = (req, res) => {
  const { full_name, email_address, phone, partnership_type, message } = req.body;

  if (!full_name || !email_address || !phone || !partnership_type || !message) {
    return res.status(400).json({ message: 'Missing required message fields' });
  }

  const query = `
    INSERT INTO messages (full_name, email_address, phone, partnership_type, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [full_name, email_address, phone, partnership_type, message], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to create message' });
    }

    return res.status(201).json({
      id: result.insertId,
      full_name,
      email_address,
      phone,
      partnership_type,
      message
    });
  });
};

export const getMessages = (req, res) => {
  db.query('SELECT * FROM messages', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch messages' });
    }

    return res.status(200).json(rows);
  });
};
