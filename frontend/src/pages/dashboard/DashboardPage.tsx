import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot, LayoutDashboard, Package, Users, LogOut,
  Bell, Search, ChevronLeft, BarChart3, Settings, Menu, X, MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { DashboardMetrics } from '../../components/dashboard/MetricsCard';
import { StatusChart } from '../../components/dashboard/StatusChart';
import { CityChart } from '../../components/dashboard/CityChart';
import { ActivityChart } from '../../components/dashboard/ActivityChart';
import { ShipmentsSection } from '../../components/dashboard/ShipmentsSection';
import { UsersSection } from '../../components/dashboard/UsersSection';
import { Avatar } from '../../components/ui/Avatar';

type Section = 'dashboard' | 'envios' | 'usuarios' | 'reportes' | 'conversaciones' | 'configuracion';

const NAV: { key: Section; icon: React.ElementType; label: string }[] = [
  { key: 'dashboard',       icon: LayoutDashboard, label: 'Dashboard'       },
  { key: 'envios',          icon: Package,         label: 'Envíos'           },
  { key: 'usuarios',        icon: Users,           label: 'Usuarios'         },
  { key: 'reportes',        icon: BarChart3,       label: 'Reportes'         },
  { key: 'conversaciones',  icon: MessageSquare,   label: 'Conversaciones'   },
  { key: 'configuracion',   icon: Settings,        label: 'Configuración'    },
];

const W = 252;

const SECTION_TITLES: Record<Section, string> = {
  dashboard: 'Resumen de tu plataforma',
  envios: 'Gestión de envíos',
  usuarios: 'Administración de usuarios',
  reportes: 'Métricas y estadísticas',
  conversaciones: 'Historial de conversaciones',
  configuracion: 'Configuración del sistema',
};

export const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [section, setSection] = useState<Section>('dashboard');

  useEffect(() => {
    if (!isAuthenticated || user?.rol !== 'ADMIN') navigate('/login');
  }, [isAuthenticated, user, navigate]);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches';

  const navTo = (s: Section) => { setSection(s); setMobileOpen(false); };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-neutral-100)', flexShrink: 0 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bot style={{ width: 18, height: 18, color: 'white' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--color-neutral-900)', lineHeight: 1.1 }}>
              Servi<span style={{ color: 'var(--color-primary)' }}>Bot</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-neutral-400)', marginTop: 1 }}>Panel Administrativo</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ key, icon: Icon, label }) => {
          const active = section === key;
          return (
            <button
              key={key}
              onClick={() => navTo(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, border: 'none',
                background: active ? 'rgba(30,138,76,0.08)' : 'none',
                color: active ? 'var(--color-primary)' : 'var(--color-neutral-500)',
                fontSize: 13, fontWeight: active ? 600 : 500,
                cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              {label}
              {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }} />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--color-neutral-100)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
          <Avatar name={user?.nombre || ''} size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-neutral-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.nombre}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-primary)' }}>Administrador</div>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', fontSize: 13, fontWeight: 500, color: 'var(--color-neutral-500)', border: 'none', background: 'none', borderRadius: 10, cursor: 'pointer' }}
        >
          <LogOut style={{ width: 14, height: 14 }} /> Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-neutral-50)' }}>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40 }}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar (sticky — takes natural flex space) */}
      <aside
        className="hidden lg:flex"
        style={{ width: W, minWidth: W, flexShrink: 0, height: '100vh', position: 'sticky', top: 0, background: 'white', borderRight: '1px solid var(--color-neutral-200)', flexDirection: 'column', overflowY: 'auto', zIndex: 10 }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar (fixed) */}
      <aside
        className="lg:hidden"
        style={{ position: 'fixed', left: 0, top: 0, height: '100%', width: W, background: 'white', borderRight: '1px solid var(--color-neutral-200)', flexDirection: 'column', zIndex: 50, display: 'flex', transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, border: 'none', background: 'var(--color-neutral-100)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <X style={{ width: 14, height: 14, color: 'var(--color-neutral-500)' }} />
        </button>
        {sidebarContent}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-neutral-200)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} style={{ padding: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-neutral-500)', borderRadius: 8, flexShrink: 0 }}>
            <Menu style={{ width: 20, height: 20 }} />
          </button>

          <div className="hidden sm:block" style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-neutral-900)' }}>
              {greeting}, <span style={{ color: 'var(--color-primary)' }}>{user?.nombre?.split(' ')[0]}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-neutral-400)', marginTop: 1 }}>
              {SECTION_TITLES[section]}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <div className="hidden sm:block" style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--color-neutral-400)', pointerEvents: 'none' }} />
              <input placeholder="Buscar..." style={{ width: 200, height: 34, paddingLeft: 32, paddingRight: 12, background: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)', borderRadius: 9, fontSize: 13, outline: 'none' }} />
            </div>
            <button style={{ position: 'relative', width: 34, height: 34, background: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell style={{ width: 15, height: 15, color: 'var(--color-neutral-500)' }} />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: 'var(--color-danger)', borderRadius: '50%', border: '2px solid white' }} />
            </button>
            <Link to="/" className="hidden sm:flex" style={{ alignItems: 'center', gap: 4, padding: '5px 10px', fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-500)', textDecoration: 'none', borderRadius: 8, border: '1px solid var(--color-neutral-200)' }}>
              <ChevronLeft style={{ width: 12, height: 12 }} /> Ver sitio
            </Link>
          </div>
        </div>

        {/* Content area */}
        <div style={{ padding: '28px 24px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >

              {/* ── Dashboard overview ── */}
              {section === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <section>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <h2 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-neutral-600)', textTransform: 'uppercase', letterSpacing: '0.09em', margin: 0 }}>Métricas generales</h2>
                      <span style={{ fontSize: 11, color: 'var(--color-neutral-400)', fontFamily: 'var(--font-mono)' }}>
                        {new Date().toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <DashboardMetrics />
                  </section>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="charts-2col">
                    <style>{`@media(max-width:1100px){.charts-2col{grid-template-columns:1fr!important}}`}</style>
                    <StatusChart />
                    <CityChart />
                  </div>

                  <ActivityChart />
                </div>
              )}

              {/* ── Envíos ── */}
              {section === 'envios' && <ShipmentsSection />}

              {/* ── Usuarios ── */}
              {section === 'usuarios' && <UsersSection />}

              {/* ── Reportes (charts) ── */}
              {section === 'reportes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)', margin: '0 0 4px' }}>Reportes</h2>
                    <p style={{ fontSize: 13, color: 'var(--color-neutral-400)', margin: 0 }}>Estadísticas y gráficos de la plataforma</p>
                  </div>
                  <DashboardMetrics />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="charts-2col">
                    <StatusChart />
                    <CityChart />
                  </div>
                  <ActivityChart />
                </div>
              )}

              {/* ── Conversaciones / Configuración — placeholders ── */}
              {(section === 'conversaciones' || section === 'configuracion') && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360, gap: 14, textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, background: 'var(--color-neutral-100)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {section === 'conversaciones'
                      ? <MessageSquare style={{ width: 28, height: 28, color: 'var(--color-neutral-400)' }} />
                      : <Settings style={{ width: 28, height: 28, color: 'var(--color-neutral-400)' }} />
                    }
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-700)', margin: '0 0 6px' }}>
                      {section === 'conversaciones' ? 'Conversaciones' : 'Configuración'}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--color-neutral-400)', margin: 0 }}>
                      Esta sección estará disponible próximamente.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
