import { Router } from 'express';
import { register, login, getMe } from '../controlers/auth.js';
import { checkAuth } from '../utils/checkAuth.js';
import { checkRole } from '../utils/checkRole.js';
const router = Router();

// Register
// http://localhost:5001/api/auth/register
router.post('/register', register);

// Login
// http://localhost:5001/api/auth/login
router.post('/login', login);

// Get Profile
// http://localhost:5001/api/auth/me
router.get('/me', checkAuth, getMe);

export default router;

// checkRole(['admin'])
