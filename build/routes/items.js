import { Router } from 'express';
import { createItem, getAll, getById, updateItem, getCollectionItems, removeItem, getLastTags, getItemComments, likePost, } from '../controllers/items.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = Router();
router.post('/:colid', checkAuth, createItem);
router.get('/', getAll);
router.get('/:id', getById);
router.get('/coll/:colid', getCollectionItems);
router.put('/:id', checkAuth, updateItem);
router.delete('/:colid/:id', checkAuth, removeItem);
router.get('/tags/last', getLastTags);
router.get('/comments/:id', getItemComments);
router.patch('/:id/like', checkAuth, likePost);
export default router;
//# sourceMappingURL=items.js.map