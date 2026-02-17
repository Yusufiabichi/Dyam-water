import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// Route imports
import sponsorRoutes from './routes/sponsor.routes.js';
import distributorRoutes from './routes/distributor.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import messageRoutes from './routes/message.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================
// MIDDLEWARE
// ============================================
// Middleware to capture raw body (for webhook signature validation)
const rawBodyBuffer = (req, res, buf) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString('utf8');
  }
};

// External Middleware
app.use(cors());
// Apply raw body capture only to webhook route
app.use('/api/webhooks', express.json({ verify: rawBodyBuffer }));
// Standard JSON parsing for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES
// ============================================
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/payment-success', (req, res) => {
  res.send('Your payment was successful! Thank you for your support.');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Mount route modules
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/distributors', distributorRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin', adminRoutes);

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message, status });
});

// ============================================
// 404 NOT FOUND HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', status: 404 });
});

export default app;


