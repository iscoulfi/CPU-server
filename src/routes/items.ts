import { Router } from 'express';
import {
  createItem,
  getAll,
  getById,
  updateItem,
  getCollectionItems,
  removeItem,
  getLastTags,
  getItemComments,
  likePost,
} from '../controllers/items.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = Router();

// Create Item
// http://localhost:5001/api/items/:collId
router.post('/:collId', checkAuth, createItem);

// Get All Items
// http://localhost:5001/api/items
router.get('/', getAll);

// Get Item By Id
// http://localhost:5001/api/items/:itemId
router.get('/:itemId', getById);

// Get Collection Items
// http://localhost:5001/api/items/coll/:collId
router.get('/coll/:collId', getCollectionItems);

// Update Item
// http://localhost:5001/api/items/:itemId
router.put('/:itemId', checkAuth, updateItem);

// Remove Item
// http://localhost:5001/api/items/:collId/:itemId
router.delete('/:collId/:itemId', checkAuth, removeItem);

// Get Last Tags
// http://localhost:5001/api/items/tags/last
router.get('/tags/last', getLastTags);

// Get Post Comments
// http://localhost:5001/api/items/comments/:itemId
router.get('/comments/:itemId', getItemComments);

// Like
// http://localhost:5001/api/items/:itemId/like
router.patch('/:itemId/like', checkAuth, likePost);

export default router;
