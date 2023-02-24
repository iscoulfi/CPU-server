import { Router } from 'express';
import { getAll, getById, getMyCollections, removeCollection, createCollection, updateCollection, removeAllCollections, } from '../controllers/collections.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = Router();
router.post('/', checkAuth, createCollection);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/user/:userId', checkAuth, getMyCollections);
router.put('/:id', checkAuth, updateCollection);
router.delete('/delete/:id', checkAuth, removeCollection);
router.delete('/remove/:id', checkAuth, removeAllCollections);
export default router;
//# sourceMappingURL=collections.js.map