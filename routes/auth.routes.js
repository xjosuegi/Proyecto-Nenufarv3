import express from 'express';
import { register, login, profile } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', express.json(), register);
router.post('/login', express.json(), login);
router.get('/profile', authMiddleware, profile);

export default router;