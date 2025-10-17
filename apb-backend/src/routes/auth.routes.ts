import express from 'express';
import { login, register, getProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateLogin } from '../middleware/validation.middleware';

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register', register);
router.get('/profile', authenticateToken, getProfile);

export default router;