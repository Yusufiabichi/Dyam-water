import express from 'express';
import * as messageController from '../controllers/message.controller.js';

const router = express.Router();

router.post('/', messageController.createMessage);
router.get('/', messageController.getMessages);

export default router;
