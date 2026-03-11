import axios from 'axios';
import crypto from 'crypto';
import paystackConfig from '../config/paystack.js';

const { secretKey, webhookSecret, baseURL, timeout } = paystackConfig;

if (!secretKey) {
  throw new Error('Missing PAYSTACK_SECRET_KEY in environment');
}

const axiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    Authorization: `Bearer ${secretKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const retryRequest = async (fn, retries = 2, delay = 300) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await wait(delay);
    return retryRequest(fn, retries - 1, Math.min(delay * 2, 2000));
  }
};

export const initializePayment = async ({ email, amount, reference, callback_url, metadata, channels } = {}) => {
  if (!email || typeof amount !== 'number') {
    throw new TypeError('initializePayment requires `email` (string) and `amount` (number)');
  }

  const body = {
    email,
    amount: Math.round(amount * 100),
  };

  if (reference) body.reference = String(reference);
  if (callback_url) body.callback_url = callback_url;
  if (metadata) body.metadata = metadata;
  if (channels) body.channels = channels;

  const res = await retryRequest(() => axiosInstance.post('/transaction/initialize', body));
  return res.data;
};

export const verifyTransaction = async (reference) => {
  if (!reference) throw new TypeError('verifyTransaction requires a reference');

  const res = await retryRequest(() => axiosInstance.get(`/transaction/verify/${encodeURIComponent(String(reference))}`));
  return res.data;
};

// Validate Paystack webhook signature. Requires raw request body string and signature header value.
export const validateWebhookSignature = ({ rawBody, signature }) => {
  if (!webhookSecret) {
    console.warn('PAYSTACK_WEBHOOK_SECRET not set; webhook signature validation skipped');
    return false;
  }

  if (!signature || !rawBody) return false;

  const hash = crypto.createHmac('sha512', webhookSecret).update(rawBody).digest('hex');
  return hash === signature;
};

export default { initializePayment, verifyTransaction, validateWebhookSignature, axiosInstance };
