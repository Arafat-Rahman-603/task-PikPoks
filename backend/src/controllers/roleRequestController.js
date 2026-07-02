import RoleRequest from '../models/RoleRequest.js';
import User from '../models/User.js';

/**
 * POST /api/role-requests
 * Create a role request. Prevents duplicate pending requests.
 * Only users with role "user" can request.
 */
export const createRequest = async (req, res, next) => {
  try {
    // Only users with role "user" can request manager access
    if (req.user.role !== 'user') {
      return res.status(400).json({
        message: `You already have the "${req.user.role}" role. No need to request.`,
      });
    }

    // Check for existing pending request
    const existingPending = await RoleRequest.findOne({
      user: req.user._id,
      status: 'pending',
    });

    if (existingPending) {
      return res.status(409).json({ message: 'You already have a pending request' });
    }

    const roleRequest = await RoleRequest.create({
      user: req.user._id,
    });

    res.status(201).json({ roleRequest });
  } catch (error) {
    // Handle unique index violation (race condition)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You already have a pending request' });
    }
    next(error);
  }
};

/**
 * GET /api/role-requests/me
 * Get all role requests for the current user.
 */
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await RoleRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email');

    res.json({ requests });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/role-requests
 * Admin: Get all role requests.
 */
export const getAllRequests = async (req, res, next) => {
  try {
    const requests = await RoleRequest.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email role')
      .populate('reviewedBy', 'name email');

    res.json({ requests });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/role-requests/:id/approve
 * Admin: Approve a role request and change user role to manager.
 */
export const approveRequest = async (req, res, next) => {
  try {
    const roleRequest = await RoleRequest.findById(req.params.id).populate('user', 'name email role');

    if (!roleRequest) {
      return res.status(404).json({ message: 'Role request not found' });
    }

    if (roleRequest.status !== 'pending') {
      return res.status(400).json({
        message: `Request has already been ${roleRequest.status}`,
      });
    }

    // Update request status
    roleRequest.status = 'approved';
    roleRequest.reviewedBy = req.user._id;
    roleRequest.reviewedAt = new Date();
    await roleRequest.save();

    // Promote user to manager
    await User.findByIdAndUpdate(roleRequest.user._id, { role: 'manager' });

    await roleRequest.populate('reviewedBy', 'name email');

    res.json({
      message: 'Request approved. User has been promoted to manager.',
      roleRequest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/role-requests/:id/reject
 * Admin: Reject a role request.
 */
export const rejectRequest = async (req, res, next) => {
  try {
    const roleRequest = await RoleRequest.findById(req.params.id).populate('user', 'name email role');

    if (!roleRequest) {
      return res.status(404).json({ message: 'Role request not found' });
    }

    if (roleRequest.status !== 'pending') {
      return res.status(400).json({
        message: `Request has already been ${roleRequest.status}`,
      });
    }

    roleRequest.status = 'rejected';
    roleRequest.reviewedBy = req.user._id;
    roleRequest.reviewedAt = new Date();
    await roleRequest.save();

    await roleRequest.populate('reviewedBy', 'name email');

    res.json({
      message: 'Request rejected.',
      roleRequest,
    });
  } catch (error) {
    next(error);
  }
};
