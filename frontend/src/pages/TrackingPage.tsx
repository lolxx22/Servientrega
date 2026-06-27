import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Package, MapPin, Clock, Calendar, Truck,
  CheckCircle, AlertCircle, CircleDot, ArrowRight, FileText,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { shipmentService } from '../services/shipment.service';
import type { TrackingInfo } from '../types';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';

/* ── Status config usando los enums reales de Prisma/backend ── */
const STATUS_MAP: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' | 'default'; icon: typeof Truck; color: string; dot: string }> = {
  PENDIENTE:    { label: 'Pendiente',       variant: 'warning', icon: Clock,        color: '#F59E0B', dot: '#F59E0B' },
  RECOGIDO:     { label: 'Recogido',        variant: 'info',    icon: Package,      color: '#3B82F6', dot: '#3B82F6' },
  EN_TRANSITO:  { label: 'En Tránsito',    variant: 'info',    icon: Truck,        color: '#3B82F6', dot: '#3B82F6' },
  EN_SUCURSAL:  { label: 'En Sucursal',    variant: 'info',    icon: MapPin,       color: '#8B5CF6', dot: '#8B5CF6' },
  EN_ENTREGA:   { label: 'En Entrega',     variant: 'info',    icon: ArrowRight,   color: '#06B6D4', dot: '#06B6D4' },
  ENTREGADO:    { label: 'Entregado',       variant: 'success', icon: CheckCircle,  color: '#10B981', dot: '#10B981' },
  CANCELADO:    { label: 'Cancelado',       variant: 'danger',  icon: AlertCircle,  color: '#EF4444', dot: '#EF4444' },
};

const DEFAULT_STATUS = { label: 'Desconocido', variant: 'default' as const, icon: CircleDot, color: '#9BA3AE', dot: '#9BA3AE' };

function getStatus(estado: string) {
  return STATUS_MAP[estado] ?? DEFAULT_STATUS;
}

function fmtDate(d: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(d).toLocaleDateString('es-EC', opts ?? { day: 'numeric', month: 'long', year: 'numeric' });
}

export const TrackingPage = () => {
  const [params] = useSearchParams();
  const [guia, setGuia]       = useState(params.get('guia') ?? '');
  const [info, setInfo]       = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!guia.trim()) return;
    setLoading(true); setError(''); setInfo(null);
    try {
      setInfo(await shipmentService.trackByNumber(guia.trim()));
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? 'Guía no encontrada. Verifica el número e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  /* auto-search si viene la guía en la URL */
  useEffect(() => { if (params.get('guia')) search(); }, []);

  const cfg = info ? getStatus(info.estado) : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-neutral-50)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 96, paddingBottom: 64 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem' }}>

          {/* header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(30,138,76,0.08)', color: 'var(--color-primary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              <Package style={{ width: 13, height: 13 }} /> Rastreo
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-neutral-900)', margin: '0 0 10px' }}>
              Rastreo de Envíos
            </h1>
            <p style={{ fontSize: 16, color: 'var(--color-neutral-500)', margin: 0 }}>
              Ingresa tu número de guía para conocer el estado de tu envío
            </p>
          </motion.div>

          {/* search form */}
          <motion.form onSubmit={search} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 28 }}>
            <div style={{ background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', display: 'flex', gap: 8, padding: 8 }}>
              <input
                value={guia} onChange={e => setGuia(e.target.value)}
                placeholder="Ej: SV-2026-000123"
                style={{ flex: 1, height: 46, padding: '0 16px', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--color-neutral-900)', background: 'transparent' }}
              />
              <button
                type="submit" disabled={loading}
                style={{ height: 46, padding: '0 22px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, opacity: loading ? 0.7 : 1 }}
              >
                <Search style={{ width: 16, height: 16 }} />
                {loading ? 'Buscando...' : 'Rastrear'}
              </button>
            </div>
          </motion.form>

          {/* loading */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
                <Spinner size="lg" />
                <p style={{ marginTop: 16, fontSize: 14, color: 'var(--color-neutral-400)' }}>Buscando información del envío...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}
              >
                <AlertCircle style={{ width: 18, height: 18, color: 'var(--color-danger)', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-danger)', margin: 0 }}>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* result */}
          <AnimatePresence>
            {info && cfg && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* status card */}
                <div style={{ background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: 18, boxShadow: '0 1px 6px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

                  {/* top bar */}
                  <div style={{ background: cfg.color, padding: '3px 0', width: '100%' }} />

                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, background: `${cfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <cfg.icon style={{ width: 26, height: 26, color: cfg.color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--color-neutral-400)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Número de guía</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--color-neutral-900)' }}>{info.numeroGuia}</div>
                        </div>
                      </div>
                      <Badge variant={cfg.variant} size="md" dot>{cfg.label}</Badge>
                    </div>
                  </div>

                  {/* info grid */}
                  <div style={{ display: 'grid', gap: 12, padding: '0 1.5rem 1.5rem' }} className="info-grid">
                    <style>{`@media(min-width:540px){.info-grid{grid-template-columns:1fr 1fr}}`}</style>

                    {[
                      { icon: MapPin,   label: 'Ubicación Actual',      value: info.ubicacion,                              color: '#1E8A4C' },
                      { icon: Clock,    label: 'Última Actualización',   value: fmtDate(info.fechaUltimaActualizacion),      color: '#3B82F6' },
                      ...(info.fechaEstimadaEntrega
                        ? [{ icon: Calendar, label: 'Entrega Estimada', value: fmtDate(info.fechaEstimadaEntrega), color: '#10B981' }]
                        : []),
                      { icon: FileText, label: 'Descripción',           value: info.descripcion,                            color: '#E91E73' },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'var(--color-neutral-50)', borderRadius: 12, padding: '12px 14px' }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon style={{ width: 15, height: 15, color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--color-neutral-400)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-neutral-900)' }}>{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* timeline */}
                <div style={{ background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: 18, padding: '1.5rem', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-neutral-900)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 24px' }}>
                    Historial de movimientos
                  </h3>

                  {/* progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
                    {Object.entries(STATUS_MAP).filter(([k]) => k !== 'CANCELADO').map(([k, s], i, arr) => {
                      const keys = arr.map(([key]) => key);
                      const currentIdx = keys.indexOf(info.estado);
                      const thisIdx = i;
                      const done = thisIdx <= currentIdx;
                      return (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 60 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? 'var(--color-primary)' : 'var(--color-neutral-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
                              <s.icon style={{ width: 14, height: 14, color: done ? 'white' : 'var(--color-neutral-400)' }} />
                            </div>
                            <span style={{ fontSize: 10, color: done ? 'var(--color-primary)' : 'var(--color-neutral-400)', fontWeight: done ? 600 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
                              {s.label}
                            </span>
                          </div>
                          {i < arr.length - 1 && (
                            <div style={{ height: 2, width: 32, background: thisIdx < currentIdx ? 'var(--color-primary)' : 'var(--color-neutral-200)', margin: '-16px 4px 0', flexShrink: 0, transition: 'background 0.3s' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* latest event */}
                  <div style={{ position: 'relative', paddingLeft: 36 }}>
                    <div style={{ position: 'absolute', left: 0, top: 4, width: 20, height: 20, borderRadius: '50%', background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, animation: 'pulse 2s infinite' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary)', background: 'rgba(30,138,76,0.08)', padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actual</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-neutral-600)', margin: '0 0 8px' }}>{info.descripcion}</p>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-neutral-400)' }}>
                        <MapPin style={{ width: 12, height: 12 }} />{info.ubicacion}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-neutral-400)' }}>
                        <Clock style={{ width: 12, height: 12 }} />
                        {fmtDate(info.fechaUltimaActualizacion, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* empty state */}
          {!info && !loading && !error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 72, height: 72, background: 'rgba(30,138,76,0.08)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Package style={{ width: 36, height: 36, color: 'var(--color-primary)' }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-neutral-500)', margin: '0 0 6px' }}>Ingresa un número de guía para comenzar</p>
              <p style={{ fontSize: 13, color: 'var(--color-neutral-400)', fontFamily: 'var(--font-mono)', margin: 0 }}>Ejemplo: SV-2026-000123</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
