import { Router } from 'express';
import { createItem, getAll, getById, updateItem, getCollectionItems, removeItem, getLastTags, getItemComments, likePost, } from '../controllers/items.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = Router();
router.post('/:collId', checkAuth, createItem);
router.get('/', getAll);
router.get('/:itemId', getById);
router.get('/coll/:collId', getCollectionItems);
router.put('/:itemId', checkAuth, updateItem);
router.delete('/:collId/:itemId', checkAuth, removeItem);
router.get('/tags/last', getLastTags);
router.get('/comments/:itemId', getItemComments);
router.patch('/:itemId/like', checkAuth, likePost);
export default router;
//# sourceMappingURL=items.js.map