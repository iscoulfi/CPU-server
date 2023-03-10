import { Router } from 'express';
import { createComment } from '../controllers/comments.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = Router();
router.post('/:itemId', checkAuth, createComment);
export default router;
//# sourceMappingURL=comments.js.map