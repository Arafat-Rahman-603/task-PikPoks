import { Router } from 'express';
import {
  getAllRequests,
  approveRequest,
  rejectRequest,
} from '../controllers/roleRequestController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

// GET /api/admin/role-requests
router.get('/role-requests', getAllRequests);

// PATCH /api/admin/role-requests/:id/approve
router.patch('/role-requests/:id/approve', approveRequest);

// PATCH /api/admin/role-requests/:id/reject
router.patch('/role-requests/:id/reject', rejectRequest);

export default router;
