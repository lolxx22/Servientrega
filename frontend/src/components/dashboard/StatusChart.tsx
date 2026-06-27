import { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Skeleton } from '../ui/Spinner';
import { PieChart as PieIcon } from 'lucide-react';

const CARD: React.CSSProperties = {
  background: 'white', padding: '20px', borderRadius: 16,
  border: '1px solid #F1F3F5', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
};

const Tip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', padding: '8px 12px', borderRadius: 10, border: '1px solid #F1F3F5', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#1A202C', margin: '0 0 2px' }}>{payload[0].name}</p>
      <p style={{ fontSize: 12, color: '#6C7681', margin: 0 }}>{payload[0].value} envíos</p>
    </div>
  );
};

export const StatusChart = () => {
  const { chartData, loadChartData } = useDashboardStore();

  useEffect(() => { loadChartData(); }, [loadChartData]);

  if (!chartData) {
    return (
      <div style={CARD}>
        <Skeleton className="h-5 w-1/3 mb-4" variant="rounded" />
        <Skeleton className="h-64" variant="rounded" />
      </div>
    );
  }

  const data = chartData.shipmentsByStatus ?? [];
  const isEmpty = data.length === 0 || data.every(d => d.value === 0);

  return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 28, height: 28, background: 'rgba(30,138,76,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieIcon style={{ width: 14, height: 14, color: 'var(--color-primary)' }} />
        </div>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-neutral-600)', textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0 }}>
          Envíos por Estado
        </h3>
      </div>

      {isEmpty ? (
        <div style={{ height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ width: 56, height: 56, background: 'var(--color-neutral-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieIcon style={{ width: 24, height: 24, color: 'var(--color-neutral-300)' }} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-neutral-400)', margin: 0 }}>Sin datos disponibles</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="45%"
              outerRadius={95} innerRadius={55}
              paddingAngle={3} dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<Tip />} />
            <Legend
              iconType="circle" iconSize={7}
              formatter={(v) => <span style={{ fontSize: 12, color: '#6C7681', marginLeft: 2 }}>{v}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
