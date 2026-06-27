import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Skeleton } from '../ui/Spinner';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-xl border border-neutral-100 shadow-lg">
        <p className="text-xs font-semibold text-neutral-900 mb-1">{label}</p>
        {payload.map((item: any, i: number) => (
          <p key={i} className="text-xs text-neutral-500">
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CityChart = () => {
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
      <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-5">Envíos por Ciudad</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData.shipmentsByCity}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
          <XAxis
            dataKey="city"
            tick={{ fill: '#6C7681', fontSize: 12 }}
            axisLine={{ stroke: '#E2E6EA' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6C7681', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-neutral-600 ml-1">{value}</span>}
          />
          <Bar
            dataKey="count"
            name="Envíos"
            fill="#00843D"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
