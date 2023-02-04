import { Router } from 'express';
import { getAll, getById, getMyCollections, removeCollection } from '../controllers/collections.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = Router();
router.get('/', getAll);
router.get('/:id', getById);
router.get('/user/me', checkAuth, getMyCollections);
router.delete('/:id', checkAuth, removeCollection);
export default router;
//# sourceMappingURL=collections.js.map