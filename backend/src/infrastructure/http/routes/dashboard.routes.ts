import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { asyncHandler } from '../../../shared/utils/asyncHandler';

const router = Router();
const dashboardController = new DashboardController();

router.get('/metrics', authenticate, authorize('ADMIN'), asyncHandler(dashboardController.getMetrics));
router.get('/charts', authenticate, authorize('ADMIN'), asyncHandler(dashboardController.getChartData));

export default router;
