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
// http://localhost:5001/api/items/:colid
router.post('/:colid', checkAuth, createItem);

// Get All Items
// http://localhost:5001/api/items
router.get('/', getAll);

// Get Item By Id
// http://localhost:5001/api/items/:id
router.get('/:id', getById);

// Get Collection Items
// http://localhost:5001/api/items/coll/:colid
router.get('/coll/:colid', getCollectionItems);

// Update Item
// http://localhost:5001/api/items/:id
router.put('/:id', checkAuth, updateItem);

// Remove Item
// http://localhost:5001/api/items/:colid/:id
router.delete('/:colid/:id', checkAuth, removeItem);

// Get Last Tags
// http://localhost:5001/api/items/tags/last
router.get('/tags/last', getLastTags);

// Get Post Comments
// http://localhost:5001/api/items/comments/:id
router.get('/comments/:id', getItemComments);

// Like
// http://localhost:5001/api/items/:id/like
router.patch('/:id/like', checkAuth, likePost);

export default router;
