import { Request, Response } from 'express';
import { DashboardService } from '../../../application/services/dashboard.service';
import { ApiResponse } from '../../../shared/types';

const dashboardService = new DashboardService();

export class DashboardController {
  async getMetrics(req: Request, res: Response) {
    const metrics = await dashboardService.getMetrics();
    const response: ApiResponse = {
      success: true,
      data: metrics,
    };
    res.status(200).json(response);
  }

  async getChartData(req: Request, res: Response) {
    const charts = await dashboardService.getChartData();
    const response: ApiResponse = {
      success: true,
      data: charts,
    };
    res.status(200).json(response);
  }
}
