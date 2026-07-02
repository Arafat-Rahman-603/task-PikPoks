import { Router } from 'express';
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
} from '../controllers/roleRequestController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User routes
// POST /api/role-requests
router.post('/', createRequest);

// GET /api/role-requests/me
router.get('/me', getMyRequests);

export default router;
