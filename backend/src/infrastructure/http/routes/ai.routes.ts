import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { asyncHandler } from '../../../shared/utils/asyncHandler';

const router = Router();
const aiController = new AIController();

router.post('/chat', authenticate, asyncHandler(aiController.chat));

export default router;
