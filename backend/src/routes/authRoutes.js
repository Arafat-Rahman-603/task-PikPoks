import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidator, validate, register);

// POST /api/auth/login
router.post('/login', loginValidator, validate, login);

// GET /api/auth/me
router.get('/me', authenticate, getMe);

export default router;
