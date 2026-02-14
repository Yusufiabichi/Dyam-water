import express from 'express';
import * as sponsorController from '../controllers/sponsor.controller.js';

const router = express.Router();

router.post('/', sponsorController.createSponsor);
router.get('/', sponsorController.getSponsors);
router.get('/:id', sponsorController.getSponsorById);
router.delete('/:id', sponsorController.deleteSponsor);

export default router;
