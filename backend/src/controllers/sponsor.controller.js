import db from '../config/db.js';
import { initializePayment } from '../services/paystack.service.js';

export const createSponsor = (req, res) => {
  // Accept both backend-expected and frontend payload keys
  const {
    full_name,
    name,
    email,
    email_address,
    phone_number,
    phone,
    distributed_to,
    distributeTo,
    selected_plan,
    planName,
    amount
  } = req.body;

  const fullName = full_name ?? name ?? null;
  const emailAddr = email ?? email_address ?? null;
  const phoneNumber = phone_number ?? phone ?? null;
  const distributedTo = distributed_to ?? distributeTo ?? null;
  const selectedPlan = selected_plan ?? planName ?? null;
  const sponsorAmount = amount ?? null;

  if (!fullName || !emailAddr || !phoneNumber || !distributedTo || !selectedPlan || sponsorAmount == null) {
    return res.status(400).json({ message: 'Missing required sponsor fields' });
  }

  const query = `
    INSERT INTO sponsors (full_name, email, phone_number, distributed_to, selected_plan, amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [fullName, emailAddr, phoneNumber, distributedTo, selectedPlan, sponsorAmount],
    async (err, result) => {
      if (err) {
        console.error('Failed to create sponsor:', err);
        return res.status(500).json({ message: 'Failed to create sponsor' });
      }

      const sponsorId = result.insertId;

      try {
        // Initialize Paystack payment with sponsor data and plan amount
        const paymentData = await initializePayment({
          email: emailAddr,
          amount: sponsorAmount,
          reference: `SPONSOR_${sponsorId}_${Date.now()}`,
          metadata: {
            sponsor_id: sponsorId,
            full_name: fullName,
            phone_number: phoneNumber,
            distributed_to: distributedTo,
            selected_plan: selectedPlan,
          },
        });

        return res.status(201).json({
          id: sponsorId,
          full_name: fullName,
          email: emailAddr,
          phone_number: phoneNumber,
          distributed_to: distributedTo,
          selected_plan: selectedPlan,
          amount: sponsorAmount,
          payment: {
            authorization_url: paymentData.data?.authorization_url,
            access_code: paymentData.data?.access_code,
            reference: paymentData.data?.reference,
          },
        });
      } catch (paymentErr) {
        console.error('Payment initialization failed:', paymentErr.message);
        // Sponsor was saved but payment failed—return sponsor with error flag
        return res.status(201).json({
          id: sponsorId,
          full_name: fullName,
          email: emailAddr,
          phone_number: phoneNumber,
          distributed_to: distributedTo,
          selected_plan: selectedPlan,
          amount: sponsorAmount,
          payment_error: true,
          payment_message: 'Sponsor saved, but payment initialization failed. Please retry.',
        });
      }
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
