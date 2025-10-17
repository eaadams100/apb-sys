import { Router } from 'express';
import bulletinRoutes from './bulletins.routes';
import authRoutes from './auth.routes';
import agencyRoutes from './agencies.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/bulletins', bulletinRoutes);
router.use('/agencies', agencyRoutes);

export default router;