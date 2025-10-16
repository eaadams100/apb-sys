import express from 'express';
import {
  createBulletin,
  getBulletins,
  getBulletin,
  updateBulletin,
  getNearbyBulletins
} from '../controllers/bulletins.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', createBulletin);
router.get('/', getBulletins);
router.get('/nearby', getNearbyBulletins);
router.get('/:id', getBulletin);
router.put('/:id', updateBulletin);

export default router;