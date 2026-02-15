import express from 'express';
import { login, me, refresh } from '../controllers/admin.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticateJWT, me);
router.post('/refresh', authenticateJWT, refresh);

export default router;
