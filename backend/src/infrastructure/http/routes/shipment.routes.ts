import { Router } from 'express';
import { EnvioController } from '../controllers/shipment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { asyncHandler } from '../../../shared/utils/asyncHandler';

const router = Router();
const envioController = new EnvioController();

router.post('/', authenticate, authorize('ADMIN', 'OPERATOR'), asyncHandler(envioController.create));
router.get('/', authenticate, authorize('ADMIN', 'OPERATOR'), asyncHandler(envioController.findAll));
router.get('/:id', authenticate, authorize('ADMIN', 'OPERATOR'), asyncHandler(envioController.findById));
router.get('/tracking/:guia', asyncHandler(envioController.findByTrackingNumber));
router.put('/:id/status', authenticate, authorize('ADMIN', 'OPERATOR'), asyncHandler(envioController.updateStatus));

export default router;
