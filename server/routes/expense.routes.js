import express from 'express';
import { submitExpense, getMyExpenses, getExpenseById, approveExpense, rejectExpense, getPendingApprovals, adminOverride, getAllExpenses } from '../controllers/expense.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(submitExpense)
  .get(authorizeRole(['admin']), getAllExpenses);

router.get('/mine', getMyExpenses);
router.get('/pending', authorizeRole(['manager', 'admin']), getPendingApprovals);
router.get('/:id', getExpenseById);

// Action routes
router.patch('/:id/approve', authorizeRole(['manager', 'admin']), approveExpense);
router.patch('/:id/reject', authorizeRole(['manager', 'admin']), rejectExpense);
router.patch('/:id/override', authorizeRole(['admin']), adminOverride);

export default router;
