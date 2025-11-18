import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createHistory, listHistory, removeHistory } from '../controllers/history.controller.js';

const router = express.Router();

router.post('/', authMiddleware, express.json(), createHistory);
router.get('/', authMiddleware, listHistory);
router.delete('/:id', authMiddleware, removeHistory);

export default router;