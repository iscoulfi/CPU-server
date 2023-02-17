import { Router } from 'express';
import { register, login, getMe, getAll, removeUser, updateUser, getProfile } from '../controllers/auth.js';
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

// Get Profile
// http://localhost:5001/api/auth/profile/:userId
router.get('/profile/:userId', checkRole(['admin']), getProfile);

// Get All
// http://localhost:5001/api/auth/all
router.get('/all', checkRole(['admin']), getAll);

// Remove User
// http://localhost:5001/api/auth/:id
router.delete('/:id', checkRole(['admin']), removeUser);

// Update User
// http://localhost:5001/api/auth/:userId
router.put('/:userId', checkRole(['admin']), updateUser);

export default router;
