import express from 'express';
import cors from 'cors';
import db from './config/db.js';

// Route imports
import sponsorRoutes from './routes/sponsor.routes.js';
import distributorRoutes from './routes/distributor.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import messageRoutes from './routes/message.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================
// MIDDLEWARE
// ============================================
// External Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES
// ============================================
app.get('/', (req, res) => {
  res.send('Hello, World!');
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


