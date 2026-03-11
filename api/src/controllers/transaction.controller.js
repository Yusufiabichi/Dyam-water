import db from '../config/db.js';
import { verifyTransaction as verifyPaystackTransaction } from '../services/paystack.service.js';

export const createTransaction = (req, res) => {
  const {
    reference,
    sponsor_id,
    plan,
    amount,
    status = 'Pending',
    paid_at = new Date(),
    transaction_id = null,
    payment_method = null
  } = req.body;

  const inferredSponsorId = reference?.match?.(/SPONSOR_(\d+)_/)?.[1];
  const sponsorId = sponsor_id ?? inferredSponsorId ?? null;
  const normalizedStatus =
    String(status).toLowerCase() === 'success'
      ? 'Success'
      : String(status).toLowerCase() === 'failed'
        ? 'Failed'
        : 'Pending';

  if (!reference || !sponsorId || !plan || amount == null) {
    return res.status(400).json({ message: 'Missing required transaction fields' });
  }

  const query = `
    INSERT INTO transactions (reference, sponsor_id, plan, amount, status, paid_at, transaction_id, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [reference, sponsorId, plan, amount, normalizedStatus, paid_at, transaction_id, payment_method],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Transaction reference already exists' });
        }
        return res.status(500).json({ message: 'Failed to create transaction' });
      }

      return res.status(201).json({
        id: result.insertId,
        reference,
        sponsor_id: sponsorId,
        plan,
        amount,
        status: normalizedStatus,
        paid_at,
        transaction_id,
        payment_method
      });
    }
  );
};

export const getTransactions = (req, res) => {
  const query = `
    SELECT
      t.*,
      CONCAT(s.full_name, ' (', s.email, ')') AS donor_information,
      t.paid_at AS date_time
    FROM transactions t
    LEFT JOIN sponsors s ON s.id = t.sponsor_id
    ORDER BY t.created_at DESC
  `;

  db.query(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch transactions' });
    }

    return res.status(200).json(rows);
  });
};

export const verifyTransactionStatus = async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({ message: 'Missing transaction reference' });
  }

  try {
    const verification = await verifyPaystackTransaction(reference);
    const data = verification?.data || {};

    const sponsorId = data.metadata?.sponsor_id || reference.match(/SPONSOR_(\d+)_/)?.[1] || null;
    const plan = data.metadata?.selected_plan || 'Unknown Plan';
    const amount = data.amount ? Number(data.amount) / 100 : 0;
    const paystackStatus = String(data.status || '').toLowerCase();
    const paystackId = data.id ? String(data.id) : null;
    const paidAt = data.paid_at ? new Date(data.paid_at) : new Date();

    const normalizedStatus =
      paystackStatus === 'success'
        ? 'Success'
        : ['failed', 'abandoned', 'reversed'].includes(paystackStatus)
          ? 'Failed'
          : 'Pending';

    if (!sponsorId) {
      return res.status(400).json({ message: 'Unable to determine sponsor for this reference' });
    }

    const upsertQuery = `
      INSERT INTO transactions (reference, sponsor_id, plan, amount, status, paid_at, transaction_id, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        sponsor_id = VALUES(sponsor_id),
        plan = VALUES(plan),
        amount = VALUES(amount),
        status = VALUES(status),
        paid_at = VALUES(paid_at),
        transaction_id = VALUES(transaction_id),
        payment_method = VALUES(payment_method)
    `;

    db.query(
      upsertQuery,
      [reference, sponsorId, plan, amount, normalizedStatus, paidAt, paystackId, 'Paystack'],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to update transaction status' });
        }

        const selectQuery = `
          SELECT
            t.reference,
            t.status,
            t.amount,
            t.plan,
            t.transaction_id,
            t.payment_method,
            t.paid_at,
            s.full_name,
            s.email,
            s.phone_number
          FROM transactions t
          LEFT JOIN sponsors s ON s.id = t.sponsor_id
          WHERE t.reference = ?
          LIMIT 1
        `;

        db.query(selectQuery, [reference], (selectErr, rows) => {
          if (selectErr || !rows?.length) {
            return res.status(200).json({
              reference,
              status: normalizedStatus,
              amount,
              paid_at: paidAt,
              plan,
              transaction_id: paystackId,
              payment_method: 'Paystack',
            });
          }

          return res.status(200).json(rows[0]);
        });
      }
    );
  } catch (error) {
    console.error('Failed to verify transaction:', error?.response?.data || error.message || error);
    return res.status(500).json({ message: 'Failed to verify transaction with Paystack' });
  }
};
