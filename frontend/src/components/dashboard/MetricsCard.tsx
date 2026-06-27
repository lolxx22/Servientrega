import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Users, Truck, CheckCircle, Clock, Building2, TrendingUp } from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Skeleton } from '../ui/Spinner';

const CARD_STYLE: React.CSSProperties = {
  background: 'white',
  padding: '20px',
  borderRadius: 16,
  border: '1px solid #F1F3F5',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  position: 'relative',
  overflow: 'hidden',
};

const MetricCard = ({
  title, value, Icon, bg, trend, trendUp,
}: {
  title: string; value: number; Icon: React.ElementType;
  bg: string; trend?: string; trendUp?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(30,138,76,0.1)' }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    style={CARD_STYLE}
  >
    {/* subtle accent orb */}
    <div style={{ position: 'absolute', top: -24, right: -24, width: 80, height: 80, background: 'rgba(30,138,76,0.04)', borderRadius: '50%' }} />

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-neutral-400)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
          {title}
        </p>
        <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-neutral-900)', fontFamily: 'var(--font-mono)', margin: '0 0 6px', fontVariantNumeric: 'tabular-nums' }}>
          {(value ?? 0).toLocaleString('es-EC')}
        </p>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: trendUp !== false ? 'var(--color-success)' : 'var(--color-neutral-400)' }}>
            {trendUp !== false && <TrendingUp style={{ width: 12, height: 12 }} />}
            {trend}
          </div>
        )}
      </div>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
        <Icon style={{ width: 20, height: 20, color: 'white' }} />
      </div>
    </div>
  </motion.div>
);

export const DashboardMetrics = () => {
  const { metrics, isLoading, loadMetrics } = useDashboardStore();

  useEffect(() => { loadMetrics(); }, [loadMetrics]);

  if (isLoading || !metrics) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="metrics-grid">
        <style>{`@media(max-width:900px){.metrics-grid{grid-template-columns:repeat(2,1fr)}} @media(max-width:500px){.metrics-grid{grid-template-columns:1fr}}`}</style>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton className="h-3 w-1/2" variant="rounded" />
            <Skeleton className="h-7 w-1/3" variant="rounded" />
          </div>
        ))}
      </div>
    );
  }

  const pct = metrics.totalShipments > 0
    ? Math.round((metrics.deliveredShipments / metrics.totalShipments) * 100)
    : 0;

  const cards = [
    { title: 'Total Envíos',  value: metrics.totalShipments,    Icon: Package,    bg: 'linear-gradient(135deg,#1E8A4C,#0B5C30)', trend: '+12% este mes',                   trendUp: true  },
    { title: 'En Tránsito',   value: metrics.activeShipments,   Icon: Truck,      bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', trend: `${metrics.activeShipments} activos`, trendUp: true  },
    { title: 'Entregados',    value: metrics.deliveredShipments, Icon: CheckCircle,bg: 'linear-gradient(135deg,#10B981,#059669)', trend: `${pct}% total`,                  trendUp: true  },
    { title: 'Pendientes',    value: metrics.pendingShipments,  Icon: Clock,      bg: 'linear-gradient(135deg,#F59E0B,#D97706)', trend: `${metrics.pendingShipments} por entregar`, trendUp: false },
    { title: 'Usuarios',      value: metrics.totalUsers,        Icon: Users,      bg: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', trend: 'Registrados' },
    { title: 'Sucursales',    value: metrics.totalBranches,     Icon: Building2,  bg: 'linear-gradient(135deg,#EC4899,#DB2777)', trend: 'Activas' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="metrics-grid">
      <style>{`@media(max-width:900px){.metrics-grid{grid-template-columns:repeat(2,1fr)}} @media(max-width:500px){.metrics-grid{grid-template-columns:1fr}}`}</style>
      {cards.map(c => <MetricCard key={c.title} {...c} />)}
    </div>
  );
};
