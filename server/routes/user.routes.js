import express from 'express';
import { getUsers, createUser, updateUserRole, updateUserManager, deactivateUser } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/role.middleware.js';

const router = express.Router();

// Admin only routes
router.use(protect);
router.use(authorizeRole(['admin']));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.patch('/:id/role', updateUserRole);
router.patch('/:id/manager', updateUserManager);
router.patch('/:id/deactivate', deactivateUser);

export default router;
