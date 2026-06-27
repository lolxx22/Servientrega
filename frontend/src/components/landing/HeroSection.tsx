import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import heroImg from '../../assets/hero.png';

const CITIES = ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta', 'Loja', 'Latacunga', 'Riobamba'];
const TYPES  = ['Documento', 'Paquete', 'Electrodoméstico', 'Mercancía'];

const RATES: Record<string, [number, number, number]> = {
  'Quito-Guayaquil':  [2.50, 1.80, 5.00], 'Guayaquil-Quito':  [2.50, 1.80, 5.00],
  'Quito-Cuenca':     [3.00, 2.20, 6.00], 'Cuenca-Quito':     [3.00, 2.20, 6.00],
  'Quito-Ambato':     [2.00, 1.50, 4.00], 'Ambato-Quito':     [2.00, 1.50, 4.00],
  'Quito-Manta':      [2.80, 2.00, 5.50], 'Manta-Quito':      [2.80, 2.00, 5.50],
  'Quito-Loja':       [3.50, 2.50, 7.00], 'Loja-Quito':       [3.50, 2.50, 7.00],
  'Guayaquil-Cuenca': [2.80, 2.00, 5.50], 'Cuenca-Guayaquil': [2.80, 2.00, 5.50],
};

function calcPrice(o: string, d: string, kg: number, tipo: string) {
  if (!o || !d || o === d || kg <= 0) return null;
  const [base, perKg, min] = RATES[`${o}-${d}`] ?? [3.00, 2.00, 6.00];
  return Math.max(min, tipo === 'Documento' ? base : base + kg * perKg);
}

/* ── shared input/select base style ── */
const FIELD_BASE: React.CSSProperties = {
  width: '100%',
  height: 48,
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.06)',
  color: 'white',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s',
  appearance: 'none' as const,
};

export const HeroSection = () => {
  const [tracking, setTracking] = useState('');
  const [origen,   setOrigen]   = useState('Quito');
  const [destino,  setDestino]  = useState('Guayaquil');
  const [peso,     setPeso]     = useState(5);
  const [tipo,     setTipo]     = useState('Paquete');
  const navigate = useNavigate();
  const price = calcPrice(origen, destino, peso, tipo);

  return (
    <section style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, overflow: 'hidden' }}>
      {/* fondo full-width */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(11,20,16,0.95) 0%, rgba(11,20,16,0.82) 50%, rgba(11,20,16,0.60) 100%)' }} />

      {/* contenido */}
      <div className="page-container" style={{ position: 'relative', width: '100%', paddingTop: '4rem', paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        {/* ── Headline (arriba, ancho completo) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', fontWeight: 700, color: 'white', lineHeight: 1.12, margin: 0 }}>
            Envíos inteligentes,<br />
            <span style={{ color: 'var(--color-primary-light)' }}>entregas a tiempo</span>
          </h1>
          <p style={{ marginTop: 14, fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 560 }}>
            La nueva experiencia digital de Servientrega impulsada por Inteligencia Artificial.
          </p>
        </motion.div>

        {/* ── Cards apiladas, ancho completo ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Tracking card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
              <div className="card-inner" style={{ paddingBottom: 14 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--color-neutral-900)', margin: 0 }}>
                  Rastrea tu envío
                </h3>
                <p style={{ fontSize: 13, color: 'var(--color-neutral-400)', marginTop: 6, lineHeight: 1.5 }}>
                  Ingresa tu número de guía para conocer el estado de tu envío
                </p>
              </div>
              <form
                onSubmit={e => { e.preventDefault(); if (tracking.trim()) navigate(`/tracking?guia=${tracking}`); }}
                className="card-inner"
                style={{ paddingTop: 0 }}
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="text"
                    value={tracking}
                    onChange={e => setTracking(e.target.value)}
                    placeholder="Ej: SV-2026-000123"
                    style={{
                      flex: 1, height: 48, padding: '0 16px',
                      background: 'var(--color-neutral-50)',
                      border: '1px solid var(--color-neutral-200)',
                      borderRadius: 12, fontSize: 14,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-neutral-900)',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      height: 48, padding: '0 20px',
                      background: 'var(--color-primary)',
                      color: 'white', border: 'none',
                      borderRadius: 12, fontSize: 14, fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <Search style={{ width: 16, height: 16 }} />
                    Rastrear
                  </button>
                </div>
                {/* stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-neutral-100)', textAlign: 'center' }}>
                  {[['24/7', 'Disponibilidad'], ['100%', 'Automatizado'], ['IA', 'Avanzada']].map(([v, l]) => (
                    <div key={l}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--color-primary)' }}>{v}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-neutral-400)', marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </motion.div>

          {/* Quote card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(20px)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'white', margin: 0 }}>
                  Cotiza tu envío
                </h3>
              </div>

              <div className="card-inner">
                {/* fila 1: Origen + Destino + Peso + Tipo en una sola línea horizontal */}
                <div style={{ display: 'grid', gap: 14 }} className="quote-fields">
                  <style>{`@media(min-width:640px){.quote-fields{grid-template-columns:1fr 1fr 1fr 1fr}}`}</style>

                  {/* Origen */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-neutral-300)', marginBottom: 8 }}>Origen</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--color-neutral-500)', pointerEvents: 'none' }} />
                      <select value={origen} onChange={e => setOrigen(e.target.value)} style={{ ...FIELD_BASE, paddingLeft: 38, paddingRight: 12 }}>
                        {CITIES.map(c => <option key={c} value={c} style={{ background: '#1E293B' }}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Destino */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-neutral-300)', marginBottom: 8 }}>Destino</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--color-neutral-500)', pointerEvents: 'none' }} />
                      <select value={destino} onChange={e => setDestino(e.target.value)} style={{ ...FIELD_BASE, paddingLeft: 38, paddingRight: 12 }}>
                        {CITIES.map(c => <option key={c} value={c} style={{ background: '#1E293B' }}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Peso */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-neutral-300)', marginBottom: 8 }}>Peso</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number" min={0.1} step={0.5} value={peso}
                        onChange={e => setPeso(parseFloat(e.target.value) || 0)}
                        style={{ ...FIELD_BASE, paddingLeft: 16, paddingRight: 40 }}
                      />
                      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--color-neutral-500)', fontWeight: 500, pointerEvents: 'none' }}>Kg</span>
                    </div>
                  </div>

                  {/* Tipo */}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-neutral-300)', marginBottom: 8 }}>Tipo</label>
                    <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...FIELD_BASE, paddingLeft: 14, paddingRight: 12 }}>
                      {TYPES.map(t => <option key={t} value={t} style={{ background: '#1E293B' }}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* fila 2: precio + botón */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-neutral-400)', marginBottom: 4 }}>Precio estimado</div>
                    {price !== null
                      ? <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: 'var(--color-primary-light)', lineHeight: 1 }}>$ {price.toFixed(2)}</div>
                      : <div style={{ fontSize: 13, color: 'var(--color-neutral-500)' }}>Selecciona ciudades distintas</div>
                    }
                  </div>
                  <button
                    onClick={() => navigate('/tracking')}
                    style={{ height: 50, padding: '0 28px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
                  >
                    Crear envío <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
