import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.PAYSTACK_SECRET_KEY || null;
const publicKey = process.env.PAYSTACK_PUBLIC_KEY || null;
const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET || null;
const baseURL = 'https://api.paystack.co';
const timeout = 10000;

if (!secretKey) {
	console.warn('PAYSTACK_SECRET_KEY is not set. Paystack API calls will fail.');
}

export default { secretKey, publicKey, webhookSecret, baseURL, timeout };
