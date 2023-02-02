import { Router } from 'express';
import { register, login, getMe } from '../controlers/auth.js';
import { body } from 'express-validator';
import { checkAuth } from '../utils/checkAuth.js';
import { checkRole } from '../utils/checkRole.js';
const router = Router();

// Register
// http://localhost:5001/api/auth/register
router.post(
  '/register',
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
  body('email').isEmail().withMessage('E-mail must contain a valid email adress.'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.'),
  register,
);

// Login
// http://localhost:5001/api/auth/login
router.post('/login', login);

// Get Profile
// http://localhost:5001/api/auth/me
router.get('/me', checkAuth, getMe);

export default router;

// checkRole(['admin'])
