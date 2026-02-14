import express from 'express';
import * as distributorController from '../controllers/distributor.controller.js';

const router = express.Router();

// Add your distributor routes here
router.post('/', distributorController.createDistributor);
router.get('/', distributorController.getDistributors);

export default router;
