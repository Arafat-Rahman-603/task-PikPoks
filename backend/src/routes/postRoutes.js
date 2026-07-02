import { Router } from 'express';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPostValidator, updatePostValidator } from '../validators/postValidator.js';

const router = Router();

// All post routes require authentication + manager or admin role
router.use(authenticate, authorize('manager', 'admin'));

// GET /api/posts
router.get('/', getPosts);

// POST /api/posts
router.post('/', createPostValidator, validate, createPost);

// PUT /api/posts/:id
router.put('/:id', updatePostValidator, validate, updatePost);

// DELETE /api/posts/:id
router.delete('/:id', deletePost);

export default router;
