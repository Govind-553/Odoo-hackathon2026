import express from 'express';
import { getRules, createRule, updateRule, deleteRule } from '../controllers/approvalRule.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRole(['admin']));

router.route('/')
  .get(getRules)
  .post(createRule);

router.route('/:id')
  .put(updateRule)
  .delete(deleteRule);

export default router;
