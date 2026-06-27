import api from './api';
import type { ApiResponse, DashboardMetrics, ChartData } from '../types';

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const { data } = await api.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics');
    return data.data!;
  },

  async getChartData(): Promise<ChartData> {
    const { data } = await api.get<ApiResponse<ChartData>>('/dashboard/charts');
    return data.data!;
  },
};
