import db from '../config/db.js';
import { validateWebhookSignature } from '../services/paystack.service.js';

export const handleWebhook = async (req, res) => {
  // Get signature from headers for validation
  const signature = req.headers['x-paystack-signature'];
  // Use raw body if available (required for HMAC validation)
  const rawBody = req.rawBody || JSON.stringify(req.body);

  // Validate Paystack webhook signature
  if (!validateWebhookSignature({ rawBody, signature })) {
    console.warn('Invalid webhook signature received');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const event = req.body;
  const eventType = event.event;
  const data = event.data || {};
  const reference = data.reference;
  const amount = data.amount ? data.amount / 100 : 0; // Paystack sends in kobo
  const paystackId = data.id;

  if (!reference) {
    console.warn('Webhook received without reference');
    return res.status(200).json({ message: 'OK' });
  }

  try {
    // Parse sponsor ID from reference (format: SPONSOR_${sponsorId}_${timestamp})
    const sponsorIdMatch = reference.match(/SPONSOR_(\d+)_/);
    const sponsorId = sponsorIdMatch ? sponsorIdMatch[1] : null;

    if (!sponsorId) {
      console.warn('Could not extract sponsor ID from reference:', reference);
      return res.status(200).json({ message: 'OK' });
    }

    // Fetch sponsor information
    db.query(
      'SELECT full_name, email, selected_plan FROM sponsors WHERE id = ? LIMIT 1',
      [sponsorId],
      async (err, rows) => {
        if (err) {
          console.error('Error fetching sponsor:', err);
          return res.status(200).json({ message: 'OK' });
        }

        const sponsor = rows[0] || {};
        const donorName = sponsor.full_name || 'Unknown Donor';
        const donorEmail = sponsor.email || '';
        const plan = sponsor.selected_plan || 'Unknown Plan';
        const donorInformation = donorEmail ? `${donorName} (${donorEmail})` : donorName;

        // Map Paystack event to transaction status
        let transactionStatus = 'pending';
        if (eventType === 'charge.success') {
          transactionStatus = 'success';
        } else if (eventType === 'charge.failed') {
          transactionStatus = 'failed';
        }

        // Insert transaction record
        const query = `
          INSERT INTO transactions (reference, donor_information, plan, amount, status, date_time, transaction_id, payment_method)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          query,
          [
            reference,
            donorInformation,
            plan,
            amount,
            transactionStatus,
            new Date(),
            paystackId,
            'Paystack',
          ],
          (insertErr, result) => {
            if (insertErr) {
              console.error('Failed to insert transaction:', insertErr);
              return res.status(200).json({ message: 'OK' });
            }

            console.log(
              `Transaction recorded: ID=${result.insertId}, Reference=${reference}, Status=${transactionStatus}, Amount=${amount}`
            );
            res.status(200).json({ message: 'Webhook processed successfully' });
          }
        );
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(200).json({ message: 'OK' });
  }
};
