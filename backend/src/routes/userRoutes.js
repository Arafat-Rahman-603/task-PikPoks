import { Router } from 'express';
import { getProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/users/me
router.get('/me', authenticate, getProfile);

export default router;
