import { Router } from 'express';
import { createComment } from '../controllers/comments.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = Router();

// Create Comment
// http://localhost:5001/api/comments/:id
router.post('/:id', checkAuth, createComment);

export default router;
