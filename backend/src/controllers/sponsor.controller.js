import db from '../config/db.js';

export const createSponsor = (req, res) => {
  const { full_name, email, phone_number, distributed_to, selected_plan, amount } = req.body;

  if (!full_name || !email || !phone_number || !distributed_to || !selected_plan || amount == null) {
    return res.status(400).json({ message: 'Missing required sponsor fields' });
  }

  const query = `
    INSERT INTO sponsors (full_name, email, phone_number, distributed_to, selected_plan, amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [full_name, email, phone_number, distributed_to, selected_plan, amount],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to create sponsor' });
      }

      return res.status(201).json({
        id: result.insertId,
        full_name,
        email,
        phone_number,
        distributed_to,
        selected_plan,
        amount
      });
    }
  );
};

export const getSponsors = (req, res) => {
  db.query('SELECT * FROM sponsors', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch sponsors' });
    }

    return res.status(200).json(rows);
  });
};

export const getSponsorById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM sponsors WHERE id = ? LIMIT 1', [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch sponsor' });
    }

    if (!rows.length) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }

    return res.status(200).json(rows[0]);
  });
};

export const deleteSponsor = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM sponsors WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete sponsor' });
    }

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }

    return res.status(204).send();
  });
};
