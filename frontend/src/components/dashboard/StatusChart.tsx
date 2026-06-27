import { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Skeleton } from '../ui/Spinner';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-xl border border-neutral-100 shadow-lg">
        <p className="text-xs font-semibold text-neutral-900">{payload[0].name}</p>
        <p className="text-xs text-neutral-500">{payload[0].value} envíos</p>
      </div>
    );
  }
  return null;
};

export const StatusChart = () => {
  const { chartData, loadChartData } = useDashboardStore();

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  if (!chartData) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
        <Skeleton className="h-6 w-1/3 mb-4" variant="rounded" />
        <Skeleton className="h-64" variant="rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
      <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-5">Envíos por Estado</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData.shipmentsByStatus}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            innerRadius={60}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.shipmentsByStatus.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-neutral-600 ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
