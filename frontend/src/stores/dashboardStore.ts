import { create } from 'zustand';
import type { DashboardMetrics, ChartData } from '../types';
import { dashboardService } from '../services/dashboard.service';

interface DashboardState {
  metrics: DashboardMetrics | null;
  chartData: ChartData | null;
  isLoading: boolean;
  loadMetrics: () => Promise<void>;
  loadChartData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: null,
  chartData: null,
  isLoading: false,

  loadMetrics: async () => {
    set({ isLoading: true });
    try {
      const metrics = await dashboardService.getMetrics();
      set({ metrics, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error loading metrics:', error);
    }
  },

  loadChartData: async () => {
    try {
      const chartData = await dashboardService.getChartData();
      set({ chartData });
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  },
}));
