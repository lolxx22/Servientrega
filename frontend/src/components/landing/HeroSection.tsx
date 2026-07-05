import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import heroImg from '../../assets/hero.png';

const CITIES = [
  'Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Portoviejo', 'Manta', 'Loja', 'Riobamba',
  'Latacunga', 'Santo Domingo', 'Esmeraldas', 'Ibarra', 'Santa Elena', 'Salinas',
  'Tulcán', 'Milagro', 'Babahoyo', 'Guaranda', 'Azogues', 'Macas', 'Puyo', 'Tena',
  'Lago Agrio', 'Coca',
];
const TYPES = [
  'Documento', 'Encomienda', 'Paquete', 'Caja', 'Mercancía',
  'Electrodoméstico', 'Tecnología', 'Ropa y calzado', 'Muebles',
  'Alimentos', 'Medicamentos', 'Frágil', 'Líquidos',
  'Materiales', 'Repuestos', 'Libros', 'Deportivos',
];

type Region = 'sierra' | 'costa' | 'oriente';
interface CityCoord { lat: number; lng: number; region: Region }

const COORDS: Record<string, CityCoord> = {
  'Quito':         { lat: 0.1807, lng: -78.4678, region: 'sierra' },
  'Guayaquil':     { lat: -2.1894, lng: -79.8891, region: 'costa' },
  'Cuenca':        { lat: -2.9001, lng: -79.0059, region: 'sierra' },
  'Ambato':        { lat: -1.8186, lng: -78.1853, region: 'sierra' },
  'Portoviejo':    { lat: -1.0544, lng: -80.4553, region: 'costa' },
  'Manta':         { lat: -0.9680, lng: -80.7089, region: 'costa' },
  'Loja':          { lat: -3.9931, lng: -79.2042, region: 'sierra' },
  'Riobamba':      { lat: -1.6635, lng: -78.6538, region: 'sierra' },
  'Latacunga':     { lat: -0.9333, lng: -78.6167, region: 'sierra' },
  'Santo Domingo': { lat: -0.2522, lng: -79.1769, region: 'costa' },
  'Esmeraldas':    { lat: 0.9535, lng: -79.6665, region: 'costa' },
  'Ibarra':        { lat: 0.3492, lng: -78.1219, region: 'sierra' },
  'Santa Elena':   { lat: -2.2268, lng: -80.8589, region: 'costa' },
  'Salinas':       { lat: -2.2164, lng: -80.9613, region: 'costa' },
  'Tulcán':        { lat: 1.0926, lng: -77.7217, region: 'sierra' },
  'Milagro':       { lat: -2.1343, lng: -79.5941, region: 'costa' },
  'Babahoyo':      { lat: -1.8023, lng: -79.5360, region: 'costa' },
  'Guaranda':      { lat: -1.5926, lng: -78.9993, region: 'sierra' },
  'Azogues':       { lat: -2.8833, lng: -78.8333, region: 'sierra' },
  'Macas':         { lat: -2.3098, lng: -78.1834, region: 'oriente' },
  'Puyo':          { lat: -1.4900, lng: -78.0000, region: 'oriente' },
  'Tena':          { lat: -0.9980, lng: -77.8120, region: 'oriente' },
  'Lago Agrio':    { lat: 0.0864, lng: -76.8983, region: 'oriente' },
  'Coca':          { lat: -0.4600, lng: -76.9900, region: 'oriente' },
};

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcRate(o: string, d: string): [number, number, number] {
  const a = COORDS[o], b = COORDS[d];
  const dist = haversine(a.lat, a.lng, b.lat, b.lng);
  let doc: number, kg: number, min: number;
  if (dist < 60)       { doc = 1.30; kg = 1.00; min = 3.00; }
  else if (dist < 120) { doc = 1.70; kg = 1.30; min = 4.00; }
  else if (dist < 200) { doc = 2.10; kg = 1.60; min = 4.80; }
  else if (dist < 300) { doc = 2.60; kg = 1.90; min = 5.50; }
  else if (dist < 400) { doc = 3.10; kg = 2.30; min = 6.50; }
  else if (dist < 500) { doc = 3.60; kg = 2.70; min = 7.50; }
  else                 { doc = 4.20; kg = 3.20; min = 9.00; }
  if (a.region !== b.region) {
    if ((a.region === 'sierra' && b.region === 'costa') || (a.region === 'costa' && b.region === 'sierra')) { doc += 0.40; kg += 0.30; min += 1.00; }
    else if ((a.region === 'sierra' && b.region === 'oriente') || (a.region === 'oriente' && b.region === 'sierra')) { doc += 1.00; kg += 0.80; min += 2.50; }
    else if ((a.region === 'costa' && b.region === 'oriente') || (a.region === 'oriente' && b.region === 'costa')) { doc += 1.50; kg += 1.20; min += 3.50; }
  }
  return [Math.round(doc * 100) / 100, Math.round(kg * 100) / 100, Math.round(min * 100) / 100];
}

const RATES: Record<string, [number, number, number]> = {};
for (const o of CITIES) {
  for (const d of CITIES) {
    if (o !== d) RATES[`${o}-${d}`] = calcRate(o, d);
  }
}

function calcPrice(o: string, d: string, kg: number, tipo: string) {
  if (!o || !d || o === d || kg <= 0) return null;
  const [base, perKg, min] = RATES[`${o}-${d}`] ?? [3.00, 2.00, 6.00];
  return Math.max(min, tipo === 'Documento' || tipo === 'Encomienda' ? base : base + kg * perKg);
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
  const [peso,     setPeso]     = useState('5');
  const [tipo,     setTipo]     = useState('Paquete');
  const navigate = useNavigate();
  const pesoNum = parseFloat(peso) || 0;
  const price = calcPrice(origen, destino, pesoNum, tipo);

  return (
    <section style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, overflow: 'hidden' }}>
      {/* fondo full-width */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(11,20,16,0.95) 0%, rgba(11,20,16,0.82) 50%, rgba(11,20,16,0.60) 100%)' }} />

      {/* contenido */}
      <div className="page-container" style={{ position: 'relative', width: '100%', paddingTop: '3rem', paddingBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* ── Headline (arriba, ancho completo) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 700, color: 'white', lineHeight: 1.12, margin: 0 }}>
            Envíos inteligentes,<br />
            <span style={{ color: 'var(--color-primary-light)' }}>entregas a tiempo</span>
          </h1>
          <p style={{ marginTop: 10, fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 480 }}>
            La nueva experiencia digital de Servientrega impulsada por Inteligencia Artificial.
          </p>
        </motion.div>

        {/* ── Cards lado a lado en desktop ── */}
        <div style={{ display: 'grid', gap: '1.25rem' }} className="hero-cards">
          <style>{`@media(min-width:768px){.hero-cards{grid-template-columns:1fr 1fr}}`}</style>

          {/* Tracking card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
              <div className="card-inner" style={{ paddingBottom: 10 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--color-neutral-900)', margin: 0 }}>
                  Rastrea tu envío
                </h3>
                <p style={{ fontSize: 12, color: 'var(--color-neutral-400)', marginTop: 4, lineHeight: 1.5 }}>
                  Ingresa tu número de guía para conocer el estado de tu envío
                </p>
              </div>
              <form
                onSubmit={e => { e.preventDefault(); if (tracking.trim()) navigate(`/tracking?guia=${tracking}`); }}
                className="card-inner"
                style={{ paddingTop: 0 }}
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={tracking}
                    onChange={e => setTracking(e.target.value)}
                    placeholder="Ej: SV-2026-000123"
                    style={{
                      flex: 1, height: 40, padding: '0 14px',
                      background: 'var(--color-neutral-50)',
                      border: '1px solid var(--color-neutral-200)',
                      borderRadius: 10, fontSize: 13,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-neutral-900)',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      height: 40, padding: '0 16px',
                      background: 'var(--color-primary)',
                      color: 'white', border: 'none',
                      borderRadius: 10, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <Search style={{ width: 14, height: 14 }} />
                    Rastrear
                  </button>
                </div>
                {/* stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-neutral-100)', textAlign: 'center' }}>
                  {[['24/7', 'Disponibilidad'], ['100%', 'Automatizado'], ['IA', 'Avanzada']].map(([v, l]) => (
                    <div key={l}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: 'var(--color-primary)' }}>{v}</div>
                      <div style={{ fontSize: 10, color: 'var(--color-neutral-400)', marginTop: 2 }}>{l}</div>
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
            <div style={{ background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'white', margin: 0 }}>
                  Cotiza tu envío
                </h3>
              </div>

              <div className="card-inner">
                {/* fila 1: Origen + Destino + Peso + Tipo en una sola línea horizontal */}
                <div style={{ display: 'grid', gap: 10 }} className="quote-fields">
                  <style>{`@media(min-width:640px){.quote-fields{grid-template-columns:1fr 1fr 1fr 1fr}}`}</style>

                  {/* Origen */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-300)', marginBottom: 6 }}>Origen</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--color-neutral-500)', pointerEvents: 'none' }} />
                      <select value={origen} onChange={e => setOrigen(e.target.value)} style={{ ...FIELD_BASE, height: 40, paddingLeft: 34, paddingRight: 10, fontSize: 13, borderRadius: 10 }}>
                        {CITIES.map(c => <option key={c} value={c} style={{ background: '#1E293B' }}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Destino */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-300)', marginBottom: 6 }}>Destino</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--color-neutral-500)', pointerEvents: 'none' }} />
                      <select value={destino} onChange={e => setDestino(e.target.value)} style={{ ...FIELD_BASE, height: 40, paddingLeft: 34, paddingRight: 10, fontSize: 13, borderRadius: 10 }}>
                        {CITIES.map(c => <option key={c} value={c} style={{ background: '#1E293B' }}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Peso */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-300)', marginBottom: 6 }}>Peso (Kg)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text" inputMode="decimal"
                        value={peso}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '' || /^\d*\.?\d*$/.test(val)) setPeso(val);
                        }}
                        placeholder="0.0"
                        style={{ ...FIELD_BASE, height: 40, paddingLeft: 14, paddingRight: 36, fontSize: 13, borderRadius: 10 }}
                      />
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--color-neutral-500)', fontWeight: 500, pointerEvents: 'none' }}>Kg</span>
                    </div>
                  </div>

                  {/* Tipo */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-neutral-300)', marginBottom: 6 }}>Tipo</label>
                    <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...FIELD_BASE, height: 40, paddingLeft: 12, paddingRight: 10, fontSize: 13, borderRadius: 10 }}>
                      {TYPES.map(t => <option key={t} value={t} style={{ background: '#1E293B' }}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* fila 2: precio + botón */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--color-neutral-400)', marginBottom: 2 }}>Precio estimado</div>
                    {price !== null
                      ? <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: 'var(--color-primary-light)', lineHeight: 1 }}>$ {price.toFixed(2)}</div>
                      : <div style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>Selecciona ciudades distintas</div>
                    }
                  </div>
                  <button
                    onClick={() => navigate('/tracking')}
                    style={{ height: 40, padding: '0 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                  >
                    Crear envío <ArrowRight style={{ width: 14, height: 14 }} />
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
