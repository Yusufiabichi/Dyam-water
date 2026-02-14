import db from '../config/db.js';

export const createDistributor = (req, res) => {
  const { full_name, phone, email_address, location, business_type, message } = req.body;

  if (!full_name || !phone || !email_address || !location || !business_type) {
    return res.status(400).json({ message: 'Missing required distributor fields' });
  }

  const query = `
    INSERT INTO distributors (full_name, phone, email_address, location, business_type, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [full_name, phone, email_address, location, business_type, message ?? null],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to create distributor' });
      }

      return res.status(201).json({
        id: result.insertId,
        full_name,
        phone,
        email_address,
        location,
        business_type,
        message: message ?? null
      });
    }
  );
};

export const getDistributors = (req, res) => {
  db.query('SELECT * FROM distributors', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch distributors' });
    }

    return res.status(200).json(rows);
  });
};
