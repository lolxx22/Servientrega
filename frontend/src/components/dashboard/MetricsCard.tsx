import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Users, Truck, CheckCircle, Clock, Building2, TrendingUp } from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboardStore';
import { Skeleton } from '../ui/Spinner';

const MetricsCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendUp,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend?: string;
  trendUp?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(30, 138, 76, 0.12)' }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm hover:border-primary/20 transition-colors duration-300 group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
    <div className="relative flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-neutral-900 tracking-tight font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {(value ?? 0).toLocaleString('es-EC')}
        </p>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp !== false ? 'text-success' : 'text-neutral-400'}`}>
            {trendUp !== false && <TrendingUp className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </motion.div>
);

export const DashboardMetrics = () => {
  const { metrics, isLoading, loadMetrics } = useDashboardStore();

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm">
            <div className="space-y-3">
              <Skeleton className="h-3 w-1/2" variant="rounded" />
              <Skeleton className="h-8 w-1/3" variant="rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const metricsData = [
    {
      title: 'Total Envíos',
      value: metrics.totalShipments,
      icon: Package,
      color: 'bg-gradient-to-br from-primary to-primary-dark',
      trend: '+12% este mes',
      trendUp: true,
    },
    {
      title: 'En Tránsito',
      value: metrics.activeShipments,
      icon: Truck,
      color: 'bg-gradient-to-br from-info to-blue-600',
      trend: `${metrics.activeShipments} activos`,
      trendUp: true,
    },
    {
      title: 'Entregados',
      value: metrics.deliveredShipments,
      icon: CheckCircle,
      color: 'bg-gradient-to-br from-success to-emerald-600',
      trend: `${metrics.totalShipments > 0 ? Math.round((metrics.deliveredShipments / metrics.totalShipments) * 100) : 0}% total`,
      trendUp: true,
    },
    {
      title: 'Pendientes',
      value: metrics.pendingShipments,
      icon: Clock,
      color: 'bg-gradient-to-br from-warning to-amber-600',
      trend: `${metrics.pendingShipments} por entregar`,
      trendUp: false,
    },
    {
      title: 'Usuarios',
      value: metrics.totalUsers,
      icon: Users,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      trend: 'Registrados',
    },
    {
      title: 'Sucursales',
      value: metrics.totalBranches,
      icon: Building2,
      color: 'bg-gradient-to-br from-secondary to-pink-600',
      trend: 'Activas',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricsData.map((metric) => (
        <MetricsCard key={metric.title} {...metric} />
      ))}
    </div>
  );
};
