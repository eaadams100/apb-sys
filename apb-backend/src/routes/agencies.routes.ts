import express from 'express';
import {
  getAllAgencies,
  getAgencyById,
  createAgency,
  getMyAgency
} from '../controllers/agencies.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { validateAgency } from '../middleware/validation.middleware';

const router = express.Router();

// Public routes (if any) would go here

// Protected routes
router.use(authenticateToken);

router.get('/', getAllAgencies);
router.get('/my-agency', getMyAgency);
router.get('/:id', getAgencyById);

// Admin only routes
router.post('/', requireRole(['admin']), validateAgency, createAgency);

export default router;