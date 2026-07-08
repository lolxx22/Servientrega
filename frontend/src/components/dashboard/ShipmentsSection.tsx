import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, X, ChevronLeft, ChevronRight, Package, RefreshCw } from 'lucide-react';
import { useShipmentStore } from '../../stores/shipmentStore';
import type { Shipment, EstadoEnvio, CreateShipmentInput } from '../../types';

/* ── Status config ── */
const STATUS: Record<EstadoEnvio, { label: string; color: string; bg: string }> = {
  GENERADO:         { label: 'Generado',         color: '#92400E', bg: '#FEF3C7' },
  RECIBIDO_AGENCIA: { label: 'Recibido Agencia', color: '#1D4ED8', bg: '#DBEAFE' },
  EN_TRANSITO:      { label: 'En Tránsito',      color: '#5B21B6', bg: '#EDE9FE' },
  EN_DISTRIBUCION:  { label: 'En Distribución',  color: '#0E7490', bg: '#CFFAFE' },
  ENTREGADO:        { label: 'Entregado',        color: '#065F46', bg: '#D1FAE5' },
  CANCELADO:        { label: 'Cancelado',        color: '#991B1B', bg: '#FEE2E2' },
};

const ESTADOS = Object.entries(STATUS) as [EstadoEnvio, typeof STATUS[EstadoEnvio]][];

const StatusBadge = ({ estado }: { estado: string }) => {
  const s = STATUS[estado as EstadoEnvio] ?? { label: estado, color: '#6B7280', bg: '#F3F4F6' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
};

/* ── Modal wrapper ── */
const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }}
      onClick={e => e.stopPropagation()}
      style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
    >
      {children}
    </motion.div>
  </motion.div>
);

const ModalHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F1F3F5' }}>
    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-neutral-900)' }}>{title}</h2>
    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'var(--color-neutral-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <X style={{ width: 15, height: 15, color: 'var(--color-neutral-500)' }} />
    </button>
  </div>
);

/* ── Field helper ── */
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const INPUT: React.CSSProperties = {
  width: '100%', height: 40, padding: '0 12px', boxSizing: 'border-box',
  border: '1px solid var(--color-neutral-200)', borderRadius: 10,
  fontSize: 13, color: 'var(--color-neutral-900)', background: 'white', outline: 'none',
};

/* ── Create shipment modal ── */
const EMPTY_FORM: CreateShipmentInput = {
  origen: '', destino: '', peso: 0,
  remitenteNombre: '', remitenteTelefono: '', remitenteDireccion: '',
  destinatarioNombre: '', destinatarioTelefono: '', destinatarioDireccion: '',
  tipoProducto: '',
};

const CreateModal = ({ onClose }: { onClose: () => void }) => {
  const { create } = useShipmentStore();
  const [form, setForm] = useState<CreateShipmentInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const f = (k: keyof CreateShipmentInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: k === 'peso' ? parseFloat(e.target.value) || 0 : e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.origen || !form.destino || !form.peso) return setError('Origen, destino y peso son obligatorios.');
    setSaving(true);
    setError('');
    try {
      await create(form);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || 'Error al crear el envío.');
    } finally {
      setSaving(false);
    }
  };

  const CITIES = ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Riobamba', 'Loja', 'Manta', 'Esmeraldas', 'Ibarra', 'Santo Domingo'];

  const sectionTitle = (t: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-neutral-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, paddingTop: 4 }}>{t}</div>
  );

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Nuevo Envío" onClose={onClose} />
      <form onSubmit={submit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, fontSize: 13, color: '#991B1B' }}>{error}</div>}

        {sectionTitle('Información de ruta')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label="Origen">
            <select value={form.origen} onChange={f('origen')} required style={INPUT}>
              <option value="">Seleccionar...</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Destino">
            <select value={form.destino} onChange={f('destino')} required style={INPUT}>
              <option value="">Seleccionar...</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Peso (kg)">
            <input type="number" step="0.1" min="0.1" value={form.peso || ''} onChange={f('peso')} required style={INPUT} placeholder="0.0" />
          </Field>
        </div>
        <Field label="Tipo de producto">
          <input value={form.tipoProducto || ''} onChange={f('tipoProducto')} style={INPUT} placeholder="Ej: Documentos, Paquete, Mercancía..." />
        </Field>

        {sectionTitle('Datos del remitente')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nombre completo">
            <input value={form.remitenteNombre} onChange={f('remitenteNombre')} required style={INPUT} placeholder="Nombre del remitente" />
          </Field>
          <Field label="Teléfono">
            <input value={form.remitenteTelefono} onChange={f('remitenteTelefono')} required style={INPUT} placeholder="+593..." />
          </Field>
        </div>
        <Field label="Dirección">
          <input value={form.remitenteDireccion} onChange={f('remitenteDireccion')} required style={INPUT} placeholder="Dirección completa" />
        </Field>

        {sectionTitle('Datos del destinatario')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nombre completo">
            <input value={form.destinatarioNombre} onChange={f('destinatarioNombre')} required style={INPUT} placeholder="Nombre del destinatario" />
          </Field>
          <Field label="Teléfono">
            <input value={form.destinatarioTelefono} onChange={f('destinatarioTelefono')} required style={INPUT} placeholder="+593..." />
          </Field>
        </div>
        <Field label="Dirección">
          <input value={form.destinatarioDireccion} onChange={f('destinatarioDireccion')} required style={INPUT} placeholder="Dirección completa" />
        </Field>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 20px', fontSize: 13, fontWeight: 500, background: 'var(--color-neutral-100)', border: 'none', borderRadius: 10, cursor: 'pointer', color: 'var(--color-neutral-600)' }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving} style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Creando...' : 'Crear Envío'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

/* ── Update status modal ── */
const UpdateStatusModal = ({ shipment, onClose }: { shipment: Shipment; onClose: () => void }) => {
  const { updateStatus } = useShipmentStore();
  const [estado, setEstado] = useState<EstadoEnvio>(shipment.estado);
  const [ubicacion, setUbicacion] = useState('');
  const [saving, setSaving] = useState(false);

  const getAutoUbicacion = (nuevoEstado: EstadoEnvio): string => {
    switch (nuevoEstado) {
      case 'RECIBIDO_AGENCIA':
        return `Servientrega ${shipment.destino} - Centro de Soluciones`;
      case 'EN_DISTRIBUCION':
        return `En distribución - ${shipment.destino}`;
      case 'ENTREGADO':
        return shipment.destinatarioDireccion || 'Entregado en destino';
      default:
        return '';
    }
  };

  const handleEstadoChange = (nuevoEstado: EstadoEnvio) => {
    setEstado(nuevoEstado);
    const autoUbicacion = getAutoUbicacion(nuevoEstado);
    setUbicacion(autoUbicacion);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStatus(shipment.id, estado, ubicacion || undefined);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isAutoFilled = ['RECIBIDO_AGENCIA', 'EN_DISTRIBUCION', 'ENTREGADO'].includes(estado);

  return (
    <Modal onClose={onClose}>
      <ModalHeader title={`Actualizar estado — ${shipment.numeroGuia}`} onClose={onClose} />
      <form onSubmit={submit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '12px 16px', background: 'var(--color-neutral-50)', borderRadius: 10, fontSize: 13 }}>
          <span style={{ color: 'var(--color-neutral-500)' }}>De: </span>
          <strong style={{ color: 'var(--color-neutral-900)' }}>{shipment.origen}</strong>
          <span style={{ color: 'var(--color-neutral-400)', margin: '0 6px' }}>→</span>
          <strong style={{ color: 'var(--color-neutral-900)' }}>{shipment.destino}</strong>
          <span style={{ marginLeft: 12 }}><StatusBadge estado={shipment.estado} /></span>
        </div>
        <Field label="Nuevo estado">
          <select value={estado} onChange={e => handleEstadoChange(e.target.value as EstadoEnvio)} style={INPUT}>
            {ESTADOS.map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>
        <Field label={isAutoFilled ? 'Ubicación (auto-completada)' : 'Ubicación'}>
          <input
            value={ubicacion} onChange={e => setUbicacion(e.target.value)}
            style={{
              ...INPUT,
              background: isAutoFilled ? '#F0FDF4' : 'white',
              borderColor: isAutoFilled ? '#86EFAC' : undefined,
            }}
            placeholder="Ej: Quito - Bodega Central"
          />
          {isAutoFilled && (
            <span style={{ fontSize: 11, color: '#059669', marginTop: 4, display: 'block' }}>
              ✓ Ubicación auto-completada según el estado seleccionado
            </span>
          )}
        </Field>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
          <button type="button" onClick={onClose} style={{ padding: '9px 20px', fontSize: 13, fontWeight: 500, background: 'var(--color-neutral-100)', border: 'none', borderRadius: 10, cursor: 'pointer', color: 'var(--color-neutral-600)' }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving} style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
            {saving ? 'Guardando...' : 'Actualizar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

/* ── Main section ── */
export const ShipmentsSection = () => {
  const { shipments, total, page, limit, isLoading, statusFilter, load, setStatusFilter, setPage } = useShipmentStore();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [updating, setUpdating] = useState<Shipment | null>(null);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / limit);

  const visible = search.trim()
    ? shipments.filter(s =>
        s.numeroGuia.toLowerCase().includes(search.toLowerCase()) ||
        s.remitenteNombre.toLowerCase().includes(search.toLowerCase()) ||
        s.destinatarioNombre.toLowerCase().includes(search.toLowerCase())
      )
    : shipments;

  const FILTERS = [['', 'Todos'], ...ESTADOS.map(([k, v]) => [k, v.label])] as [string, string][];

  return (
    <div>
      <AnimatePresence>
        {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
        {updating && <UpdateStatusModal shipment={updating} onClose={() => setUpdating(null)} />}
      </AnimatePresence>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)' }}>Gestión de Envíos</h2>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-neutral-400)' }}>{total} envíos en total</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => load()} style={{ width: 36, height: 36, border: '1px solid var(--color-neutral-200)', borderRadius: 9, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw style={{ width: 15, height: 15, color: 'var(--color-neutral-500)' }} />
          </button>
          <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus style={{ width: 16, height: 16 }} /> Nuevo Envío
          </button>
        </div>
      </div>

      {/* search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--color-neutral-400)', pointerEvents: 'none' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por guía, remitente..."
            style={{ width: 220, height: 36, paddingLeft: 32, paddingRight: 12, border: '1px solid var(--color-neutral-200)', borderRadius: 9, fontSize: 13, background: 'white', color: 'var(--color-neutral-700)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setStatusFilter(k)}
              style={{
                padding: '5px 12px', fontSize: 12, fontWeight: 500, borderRadius: 20, border: '1px solid',
                borderColor: statusFilter === k ? 'var(--color-primary)' : 'var(--color-neutral-200)',
                background: statusFilter === k ? 'rgba(30,138,76,0.08)' : 'white',
                color: statusFilter === k ? 'var(--color-primary)' : 'var(--color-neutral-500)',
                cursor: 'pointer',
              }}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* table */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #F1F3F5', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Package style={{ width: 32, height: 32, color: 'var(--color-neutral-300)', margin: '0 auto 8px' }} />
            <p style={{ color: 'var(--color-neutral-400)', fontSize: 13, margin: 0 }}>Cargando envíos...</p>
          </div>
        ) : visible.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Package style={{ width: 40, height: 40, color: 'var(--color-neutral-300)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--color-neutral-400)', fontSize: 14, margin: 0 }}>No hay envíos que mostrar</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#FAFBFC', borderBottom: '1px solid #F1F3F5' }}>
                  {['Guía', 'Remitente', 'Destinatario', 'Ruta', 'Peso', 'Estado', 'Fecha', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--color-neutral-400)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid #F8F9FA' }}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>{s.numeroGuia}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-neutral-700)', whiteSpace: 'nowrap' }}>{s.remitenteNombre}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-neutral-700)', whiteSpace: 'nowrap' }}>{s.destinatarioNombre}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ color: 'var(--color-neutral-600)' }}>{s.origen}</span>
                      <span style={{ color: 'var(--color-neutral-300)', margin: '0 4px' }}>→</span>
                      <span style={{ color: 'var(--color-neutral-600)' }}>{s.destino}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-neutral-500)', whiteSpace: 'nowrap' }}>{s.peso} kg</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}><StatusBadge estado={s.estado} /></td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-neutral-400)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(s.fechaCreacion).toLocaleDateString('es-EC', { timeZone: 'America/Guayaquil', day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => setUpdating(s)}
                        style={{ padding: '5px 12px', fontSize: 12, fontWeight: 500, background: 'rgba(30,138,76,0.08)', color: 'var(--color-primary)', border: '1px solid rgba(30,138,76,0.2)', borderRadius: 8, cursor: 'pointer' }}
                      >
                        Estado
                      </button>
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
            Página {page} de {totalPages} · {total} registros
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--color-neutral-200)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
              <ChevronLeft style={{ width: 14, height: 14 }} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const n = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
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
