import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Skeleton } from '../ui/Spinner';
import { Activity } from 'lucide-react';

const CARD: React.CSSProperties = {
  background: 'white', padding: '20px', borderRadius: 16,
  border: '1px solid #F1F3F5', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
};

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', padding: '10px 14px', borderRadius: 10, border: '1px solid #F1F3F5', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#1A202C', margin: '0 0 6px' }}>{label}</p>
      {payload.map((it: any, i: number) => (
        <p key={i} style={{ fontSize: 12, color: '#6C7681', margin: '2px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: it.color, flexShrink: 0 }} />
          {it.name}: <strong style={{ color: '#1A202C' }}>{it.value}</strong>
        </p>
      ))}
    </div>
  );
};

export const ActivityChart = () => {
  const { chartData, loadChartData } = useDashboardStore();

  useEffect(() => { loadChartData(); }, [loadChartData]);

  if (!chartData) {
    return (
      <div style={CARD}>
        <Skeleton className="h-5 w-1/3 mb-4" variant="rounded" />
        <Skeleton className="h-72" variant="rounded" />
      </div>
    );
  }

  return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 28, height: 28, background: 'rgba(30,138,76,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity style={{ width: 14, height: 14, color: 'var(--color-primary)' }} />
        </div>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-neutral-600)', textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0 }}>
          Actividad Mensual
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData.monthlyActivity} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F4F5F7" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<Tip />} />
          <Legend
            iconType="circle" iconSize={7}
            formatter={(v) => <span style={{ fontSize: 12, color: '#6C7681', marginLeft: 2 }}>{v}</span>}
          />
          <Line
            type="monotone" dataKey="envios" name="Envíos"
            stroke="var(--color-primary)" strokeWidth={2.5}
            dot={{ fill: 'var(--color-primary)', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
          <Line
            type="monotone" dataKey="entregas" name="Entregas"
            stroke="var(--color-secondary)" strokeWidth={2.5}
            dot={{ fill: 'var(--color-secondary)', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
