import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import shipmentRoutes from './shipment.routes';
import aiRoutes from './ai.routes';
import dashboardRoutes from './dashboard.routes';
import { INSTANCE_ID } from '../../../index';

const router = Router();

// Ruta pública - retorna el instanceId del servidor
router.get('/status', (req, res) => {
  res.json({ instanceId: INSTANCE_ID });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/ai', aiRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
