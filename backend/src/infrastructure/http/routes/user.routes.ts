import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { changeRolSchema } from '../../../application/dto/user.dto';
import { asyncHandler } from '../../../shared/utils/asyncHandler';

const router = Router();
const userController = new UserController();

router.get('/', authenticate, authorize('ADMIN'), asyncHandler(userController.findAll));
router.put('/:id', authenticate, authorize('ADMIN'), asyncHandler(userController.update));
router.patch('/:id/rol', authenticate, authorize('ADMIN'), validate(changeRolSchema), asyncHandler(userController.changeRol));
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(userController.delete));

export default router;
