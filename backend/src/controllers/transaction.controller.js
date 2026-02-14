import db from '../config/db.js';

export const createTransaction = (req, res) => {
  const {
    reference,
    donor_information,
    plan,
    amount,
    status = 'pending',
    date_time = new Date(),
    transaction_id = null,
    payment_method = null
  } = req.body;

  if (!reference || !donor_information || !plan || amount == null) {
    return res.status(400).json({ message: 'Missing required transaction fields' });
  }

  const query = `
    INSERT INTO transactions (reference, donor_information, plan, amount, status, date_time, transaction_id, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [reference, donor_information, plan, amount, status, date_time, transaction_id, payment_method],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to create transaction' });
      }

      return res.status(201).json({
        id: result.insertId,
        reference,
        donor_information,
        plan,
        amount,
        status,
        date_time,
        transaction_id,
        payment_method
      });
    }
  );
};

export const getTransactions = (req, res) => {
  db.query('SELECT * FROM transactions', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch transactions' });
    }

    return res.status(200).json(rows);
  });
};
