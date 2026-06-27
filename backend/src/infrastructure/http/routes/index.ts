import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import shipmentRoutes from './shipment.routes';
import aiRoutes from './ai.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/ai', aiRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
