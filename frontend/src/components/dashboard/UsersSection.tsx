import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Users, RefreshCw, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import type { User } from '../../types';

/* ── Role badge ── */
const RoleBadge = ({ rol }: { rol: User['rol'] }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
    background: rol === 'ADMIN' ? '#EDE9FE' : '#DBEAFE',
    color: rol === 'ADMIN' ? '#5B21B6' : '#1D4ED8',
  }}>
    {rol === 'ADMIN'
      ? <ShieldCheck style={{ width: 11, height: 11 }} />
      : <ShieldOff style={{ width: 11, height: 11 }} />
    }
    {rol === 'ADMIN' ? 'Admin' : 'Operador'}
  </span>
);

/* ── Delete confirmation ── */
const DeleteModal = ({ user, onClose }: { user: User; onClose: () => void }) => {
  const { deleteUser } = useUserStore();
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await deleteUser(user.id);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 8 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: 16, width: 380, padding: '28px 28px 24px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}
      >
        <div style={{ width: 48, height: 48, background: '#FEE2E2', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Trash2 style={{ width: 22, height: 22, color: '#DC2626' }} />
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-900)' }}>Eliminar usuario</h3>
        <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--color-neutral-500)', lineHeight: 1.55 }}>
          ¿Eliminar a <strong style={{ color: 'var(--color-neutral-800)' }}>{user.nombre}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', fontSize: 13, fontWeight: 500, background: 'var(--color-neutral-100)', border: 'none', borderRadius: 10, cursor: 'pointer', color: 'var(--color-neutral-600)' }}>
            Cancelar
          </button>
          <button onClick={confirm} disabled={busy} style={{ padding: '9px 18px', fontSize: 13, fontWeight: 600, background: '#DC2626', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main section ── */
export const UsersSection = () => {
  const { users, total, page, limit, isLoading, load, changeRol, setPage } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const [deleting, setDeleting] = useState<User | null>(null);
  const [changingRol, setChangingRol] = useState<number | null>(null);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  const handleRol = async (u: User) => {
    setChangingRol(u.id);
    try {
      await changeRol(u.id, u.rol === 'ADMIN' ? 'OPERATOR' : 'ADMIN');
    } finally {
      setChangingRol(null);
    }
  };

  return (
    <div>
      <AnimatePresence>
        {deleting && <DeleteModal user={deleting} onClose={() => setDeleting(null)} />}
      </AnimatePresence>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)' }}>Gestión de Usuarios</h2>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-neutral-400)' }}>{total} usuarios registrados</p>
        </div>
        <button onClick={() => load()} style={{ width: 36, height: 36, border: '1px solid var(--color-neutral-200)', borderRadius: 9, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw style={{ width: 15, height: 15, color: 'var(--color-neutral-500)' }} />
        </button>
      </div>

      {/* table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #F1F3F5', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Users style={{ width: 32, height: 32, color: 'var(--color-neutral-300)', margin: '0 auto 8px' }} />
            <p style={{ color: 'var(--color-neutral-400)', fontSize: 13, margin: 0 }}>Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Users style={{ width: 40, height: 40, color: 'var(--color-neutral-300)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--color-neutral-400)', fontSize: 14, margin: 0 }}>No hay usuarios registrados</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#FAFBFC', borderBottom: '1px solid #F1F3F5' }}>
                  {['#', 'Nombre', 'Correo', 'Rol', 'Registro', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--color-neutral-400)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid #F8F9FA' }}
                  >
                    <td style={{ padding: '12px 16px', color: 'var(--color-neutral-400)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                      #{u.id}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>
                            {u.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--color-neutral-900)' }}>{u.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-neutral-500)' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}><RoleBadge rol={u.rol} /></td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-neutral-400)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(u.createdAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {currentUser?.id !== u.id ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => handleRol(u)}
                            disabled={changingRol === u.id}
                            style={{ padding: '5px 12px', fontSize: 12, fontWeight: 500, background: u.rol === 'ADMIN' ? '#DBEAFE' : '#EDE9FE', color: u.rol === 'ADMIN' ? '#1D4ED8' : '#5B21B6', border: 'none', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', opacity: changingRol === u.id ? 0.5 : 1 }}
                          >
                            {changingRol === u.id ? '...' : u.rol === 'ADMIN' ? '→ Operador' : '→ Admin'}
                          </button>
                          <button
                            onClick={() => setDeleting(u)}
                            style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                          >
                            <Trash2 style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--color-neutral-300)' }}>Tú</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--color-neutral-400)' }}>
            Página {page} de {totalPages} · {total} usuarios
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--color-neutral-200)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
              <ChevronLeft style={{ width: 14, height: 14 }} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const n = i + 1;
              return (
                <button key={n} onClick={() => setPage(n)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid', borderColor: page === n ? 'var(--color-primary)' : 'var(--color-neutral-200)', background: page === n ? 'var(--color-primary)' : 'white', color: page === n ? 'white' : 'var(--color-neutral-700)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                  {n}
                </button>
              );
            })}
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--color-neutral-200)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === totalPages ? 0.4 : 1 }}>
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
