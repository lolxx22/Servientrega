import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bot, LayoutDashboard, LogOut, Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuthStore } from '../../stores/authStore';
import { Avatar } from '../ui/Avatar';

const NAV_LINKS = [
  { name: 'Inicio',      path: '/' },
  { name: 'Seguimiento', path: '/tracking' },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const active = (p: string) => location.pathname === p;

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-neutral-200">
        <div className="page-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot style={{ width: 20, height: 20, color: 'white' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-neutral-900)' }}>
                Servi<span style={{ color: 'var(--color-primary)' }}>Bot</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-neutral-400)', marginLeft: 4 }}>AI</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex" style={{ gap: 4 }}>
              {NAV_LINKS.map(l => (
                <Link
                  key={l.name} to={l.path}
                  style={{
                    padding: '8px 14px',
                    fontSize: 14,
                    fontWeight: 500,
                    borderRadius: 8,
                    color: active(l.path) ? 'var(--color-primary)' : 'var(--color-neutral-600)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                >
                  {l.name}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8 }}>
              {isAuthenticated ? (
                <>
                  <button style={{ position: 'relative', padding: 8, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-neutral-500)' }}>
                    <Bell style={{ width: 20, height: 20 }} />
                    <span style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, background: 'var(--color-primary)', color: 'white', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', borderLeft: '1px solid var(--color-neutral-200)', marginLeft: 4 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-neutral-900)', lineHeight: 1.2 }}>
                        {user?.nombre?.split(' ').slice(0, 2).join(' ') || 'Usuario'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-neutral-400)', lineHeight: 1.2 }}>
                        {user?.rol === 'ADMIN' ? 'Administrador' : 'Operador'}
                      </div>
                    </div>
                    <Avatar name={user?.nombre || ''} size="sm" />
                  </div>

                  {user?.rol === 'ADMIN' && (
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 13, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none', borderRadius: 8 }}>
                      <LayoutDashboard style={{ width: 15, height: 15 }} />
                      Dashboard
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    title="Cerrar sesión"
                    style={{ padding: 8, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-neutral-400)' }}
                  >
                    <LogOut style={{ width: 16, height: 16 }} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ padding: '8px 16px', fontSize: 14, fontWeight: 500, color: 'var(--color-neutral-600)', textDecoration: 'none', borderRadius: 8 }}>
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, color: 'white', background: 'var(--color-primary)', textDecoration: 'none', borderRadius: 8 }}>
                    Registrarse
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden"
              onClick={() => setOpen(!open)}
              style={{ padding: 8, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-neutral-600)' }}
            >
              {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.2)' }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed z-50 lg:hidden"
              style={{ top: 68, left: 16, right: 16, background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid var(--color-neutral-200)', padding: 8 }}
            >
              {NAV_LINKS.map(l => (
                <Link
                  key={l.name} to={l.path}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block', padding: '10px 16px', fontSize: 14, fontWeight: 500,
                    borderRadius: 10, textDecoration: 'none', marginBottom: 2,
                    color: active(l.path) ? 'var(--color-primary)' : 'var(--color-neutral-600)',
                    background: active(l.path) ? 'rgba(30,138,76,0.06)' : 'none',
                  }}
                >
                  {l.name}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--color-neutral-100)', marginTop: 8, paddingTop: 8, display: 'flex', gap: 8 }}>
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    style={{ flex: 1, padding: '10px 16px', fontSize: 13, fontWeight: 500, color: 'var(--color-danger)', background: 'rgba(239,68,68,0.06)', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <LogOut style={{ width: 14, height: 14 }} /> Cerrar Sesión
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px 16px', fontSize: 13, fontWeight: 500, color: 'var(--color-neutral-600)', background: 'var(--color-neutral-100)', borderRadius: 10, textDecoration: 'none' }}>Iniciar Sesión</Link>
                    <Link to="/register" onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px 16px', fontSize: 13, fontWeight: 600, color: 'white', background: 'var(--color-primary)', borderRadius: 10, textDecoration: 'none' }}>Registrarse</Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
