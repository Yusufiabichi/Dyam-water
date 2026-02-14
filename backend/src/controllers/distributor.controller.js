import db from '../config/db.js';

export const createDistributor = (req, res) => {
  const { full_name, phone, email, email_address, location, business_type, message } = req.body;

  // Log incoming request for debugging
  console.log('createDistributor received:', { full_name, phone, email, email_address, location, business_type, message });

  // Accept both 'email' and 'email_address' for flexibility
  const emailValue = email || email_address;

  if (!full_name || !phone || !emailValue || !location || !business_type) {
    console.log('Validation failed - missing fields');
    return res.status(400).json({ message: 'Missing required distributor fields' });
  }

  const query = `
    INSERT INTO distributors (full_name, phone, email, location, business_type, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [full_name, phone, emailValue, location, business_type, message ?? null],
    (err, result) => {
      if (err) {
        console.error('Failed to create distributor:', err);
        return res.status(500).json({ message: 'Failed to create distributor', error: err.message });
      }

      console.log('Distributor created successfully:', result.insertId);
      return res.status(201).json({
        id: result.insertId,
        full_name,
        phone,
        email: emailValue,
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
