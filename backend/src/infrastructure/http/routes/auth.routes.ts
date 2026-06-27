import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../../../application/dto/auth.dto';
import { asyncHandler } from '../../../shared/utils/asyncHandler';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.get('/profile', authenticate, asyncHandler(authController.getProfile));

export default router;
