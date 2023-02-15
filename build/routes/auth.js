import { Router } from 'express';
import { register, login, getMe, getAll, removeUser, updateUser } from '../controllers/auth.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', checkAuth, getMe);
router.get('/all', getAll);
router.delete('/:id', removeUser);
router.put('/:userId', updateUser);
export default router;
//# sourceMappingURL=auth.js.map