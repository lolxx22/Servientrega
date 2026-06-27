import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot, LayoutDashboard, Package, Users, MessageSquare, LogOut, Bell, Search,
  ChevronLeft, BarChart3, Settings, Menu, X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { DashboardMetrics } from '../../components/dashboard/MetricsCard';
import { StatusChart } from '../../components/dashboard/StatusChart';
import { CityChart } from '../../components/dashboard/CityChart';
import { ActivityChart } from '../../components/dashboard/ActivityChart';
import { Avatar } from '../../components/ui/Avatar';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '#', active: true },
  { icon: Package, label: 'Envíos', href: '#' },
  { icon: Users, label: 'Usuarios', href: '#' },
  { icon: BarChart3, label: 'Reportes', href: '#' },
  { icon: MessageSquare, label: 'Conversaciones', href: '#' },
  { icon: Settings, label: 'Configuración', href: '#' },
];

export const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.rol !== 'ADMIN') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-neutral-100">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-primary/20 transition-all duration-300">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-neutral-900 tracking-tight font-display">
                Servi<span className="text-primary">Bot</span>
              </span>
              <p className="text-[10px] text-neutral-400 font-medium -mt-0.5">Panel de Administración</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                item.active
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-primary' : ''}`} />
              {item.label}
              {item.active && (
                <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
              )}
            </a>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-neutral-100">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar name={user?.nombre || ''} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">{user?.nombre}</p>
              <p className="text-[11px] text-primary font-medium">Administrador</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-neutral-500 hover:text-danger hover:bg-danger/5 rounded-xl transition-all duration-200 cursor-pointer mt-1"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
                {greeting}, <span className="text-primary">{user?.nombre?.split(' ')[0]}</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Aquí tienes el resumen de tu plataforma
              </p>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-56 h-9 pl-10 pr-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-700 placeholder-neutral-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
                />
              </div>
              <button className="relative w-9 h-9 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer">
                <Bell className="w-4 h-4 text-neutral-500" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
              </button>
              <Link
                to="/"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Ver sitio
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Métricas</h2>
              <span className="text-xs text-neutral-400 font-mono">Actualizado: {new Date().toLocaleDateString('es-EC')}</span>
            </div>
            <DashboardMetrics />
          </motion.section>

          <section className="grid lg:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StatusChart />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <CityChart />
            </motion.div>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ActivityChart />
          </motion.section>
        </div>
      </main>
    </div>
  );
};
