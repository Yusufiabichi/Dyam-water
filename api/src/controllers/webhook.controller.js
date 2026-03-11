import db from '../config/db.js';
import { validateWebhookSignature } from '../services/paystack.service.js';

export const handleWebhook = async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  if (!validateWebhookSignature({ rawBody, signature })) {
    console.warn('Invalid webhook signature received');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const event = req.body;
  const eventType = event.event;
  const data = event.data || {};
  const reference = data.reference;
  const amount = data.amount ? data.amount / 100 : 0;
  const paystackId = data.id;

  if (!reference) {
    console.warn('Webhook received without reference');
    return res.status(200).json({ message: 'OK' });
  }

  let transactionStatus = 'Pending';
  if (eventType === 'charge.success') {
    transactionStatus = 'Success';
  } else if (eventType === 'charge.failed') {
    transactionStatus = 'Failed';
  }

  try {
    const metadataSponsorId = data.metadata?.sponsor_id;
    const sponsorIdFromRef = reference.match(/SPONSOR_(\d+)_/)?.[1];
    const sponsorId = metadataSponsorId || sponsorIdFromRef;

    const upsertTransaction = (sponsorId, plan) => {
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
        [reference, sponsorId, plan, amount, transactionStatus, new Date(), paystackId, 'Paystack'],
        (upsertErr, result) => {
          if (upsertErr) {
            console.error('Failed to upsert transaction:', upsertErr);
            return res.status(200).json({ message: 'OK' });
          }

          const action = result.affectedRows === 1 ? 'inserted' : 'updated';
          console.log(
            `Transaction ${action} from webhook: Reference=${reference}, Status=${transactionStatus}, Amount=${amount}`
          );
          return res.status(200).json({ message: 'Webhook processed successfully' });
        }
      );
    };

    const fallbackPlan = data.metadata?.selected_plan || 'Unknown Plan';

    if (!sponsorId) {
      console.warn('Webhook received without sponsor_id and could not parse from reference:', reference);
      return res.status(200).json({ message: 'OK' });
    }

    db.query(
      'SELECT full_name, email, selected_plan FROM sponsors WHERE id = ? LIMIT 1',
      [sponsorId],
      (err, rows) => {
        if (err) {
          console.error('Error fetching sponsor:', err);
          return upsertTransaction(sponsorId, fallbackPlan);
        }

        const sponsor = rows[0] || {};
        const plan = sponsor.selected_plan || fallbackPlan;

        return upsertTransaction(sponsorId, plan);
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(200).json({ message: 'OK' });
  }
};
