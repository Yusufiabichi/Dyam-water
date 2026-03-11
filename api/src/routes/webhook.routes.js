import express from 'express';
import * as webhookController from '../controllers/webhook.controller.js';

const router = express.Router();

router.post('/', webhookController.handleWebhook);

export default router;
