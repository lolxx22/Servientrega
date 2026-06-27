import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Skeleton } from '../ui/Spinner';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-xl border border-neutral-100 shadow-lg">
        <p className="text-xs font-semibold text-neutral-900 mb-1">{label}</p>
        {payload.map((item: any, i: number) => (
          <p key={i} className="text-xs text-neutral-500">
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: item.color }} />
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ActivityChart = () => {
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
      <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-5">Actividad Mensual</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData.monthlyActivity}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
          <XAxis
            dataKey="month"
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
          <Line
            type="monotone"
            dataKey="envios"
            name="Envíos"
            stroke="#00843D"
            strokeWidth={2.5}
            dot={{ fill: '#00843D', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
          <Line
            type="monotone"
            dataKey="entregas"
            name="Entregas"
            stroke="#D9006C"
            strokeWidth={2.5}
            dot={{ fill: '#D9006C', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
