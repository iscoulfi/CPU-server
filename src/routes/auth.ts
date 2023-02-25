import { Router } from 'express';
import { register, login, getMe, getAll, removeUser, updateUser, getProfile } from '../controllers/auth.js';
import { checkAuth } from '../utils/checkAuth.js';
import { checkRole } from '../utils/checkRole.js';
const router = Router();

router.post('/register', register);

router.post('/login', login);

router.get('/me', checkAuth, getMe);

router.get('/profile/:userId', checkRole(['admin']), getProfile);

router.get('/all', checkRole(['admin']), getAll);

router.delete('/:id', checkRole(['admin']), removeUser);

router.put('/:userId', checkRole(['admin']), updateUser);

export default router;
