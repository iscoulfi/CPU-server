import { Router } from 'express';
import {
  createCollection,
  getAll,
  getById,
  updateCollection,
  getMyCollections,
  removeCollection,
} from '../controllers/collections.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = Router();

// Create Collection
// http://localhost:5001/api/collections
router.post('/', checkAuth, createCollection);

// Get All Collections
// http://localhost:5001/api/collections
router.get('/', getAll);

// Get Collection By Id
// http://localhost:5001/api/collections/:id
router.get('/:id', getById);

// Get My Collections
// http://localhost:5001/api/collections/user/me
router.get('/user/me', checkAuth, getMyCollections);

// Update Collection
// http://localhost:5001/api/collections/:id
router.put('/:id', checkAuth, updateCollection);

// Remove Collection
// http://localhost:5001/api/collections/:id
router.delete('/:id', checkAuth, removeCollection);

export default router;
