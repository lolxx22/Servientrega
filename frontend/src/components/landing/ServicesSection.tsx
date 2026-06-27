import { motion } from 'motion/react';
import { Truck, Globe, Search, Bot, ArrowRight, Package } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const services = [
  { icon: Truck,  color: '#1E8A4C', title: 'Envíos Nacionales',      desc: 'Cobertura en todo Ecuador con entregas seguras y rápidas.' },
  { icon: Globe,  color: '#0B1410', title: 'Envíos Internacionales',  desc: 'Conectamos Ecuador con el mundo de forma confiable.' },
  { icon: Search, color: '#3B82F6', title: 'Seguimiento Inteligente', desc: 'Rastrea tus envíos en tiempo real con nuestra plataforma IA.' },
  { icon: Bot,    color: '#1E8A4C', title: 'IA Conversacional',       desc: 'Habla con ServiBot AI y gestiona tus envíos de forma natural.' },
];

const chartData = [
  { name: 'Entregados',  value: 72, color: '#1E8A4C', pct: 56 },
  { name: 'En tránsito', value: 28, color: '#3FC97A', pct: 22 },
  { name: 'Pendientes',  value: 18, color: '#F59E0B', pct: 14 },
  { name: 'Cancelados',  value: 10, color: '#E2E6EA', pct:  8 },
];

const steps = [
  { n: 1, icon: Package, title: 'Solicitud',  desc: 'El cliente inicia la solicitud de envío con ServiBot AI.' },
  { n: 2, icon: Search,  title: 'Cotización', desc: 'La IA calcula el precio según origen, destino y peso.' },
  { n: 3, icon: Bot,     title: 'Generación', desc: 'Se crea la orden y se genera automáticamente la guía.' },
  { n: 4, icon: Truck,   title: 'Entrega',    desc: 'El envío es procesado y entregado en el destino final.' },
];

const Tip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid #E2E6EA', borderRadius: 12, padding: '8px 14px', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 600, color: '#0F172A' }}>{payload[0].name}</div>
      <div style={{ color: '#6C7681' }}>{payload[0].value} envíos</div>
    </div>
  );
};

export const ServicesSection = () => {
  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <>
      {/* ── Nuestros servicios ── */}
      <section id="servicios" style={{ background: 'white' }}>
        <div className="page-container section-py">
          <div style={{ display: 'grid', gap: '2.5rem', alignItems: 'start' }} className="services-grid">
            <style>{`@media(min-width:1024px){.services-grid{grid-template-columns:2fr 1fr}}`}</style>

            {/* cards */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-neutral-900)', margin: '0 0 24px' }}
              >
                Nuestros servicios
              </motion.h2>
              <div style={{ display: 'grid', gap: 16 }} className="svc-grid">
                <style>{`@media(min-width:640px){.svc-grid{grid-template-columns:1fr 1fr}}`}</style>
                {services.map((s, i) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    style={{ background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: 16, padding: '1.5rem', transition: 'box-shadow 0.2s, border-color 0.2s' }}
                    whileHover={{ boxShadow: '0 4px 20px rgba(30,138,76,0.1)', borderColor: 'rgba(30,138,76,0.3)' }}
                  >
                    <div style={{ width: 40, height: 40, background: s.color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <s.icon style={{ width: 20, height: 20, color: 'white' }} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--color-neutral-900)', margin: '0 0 8px' }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-neutral-500)', lineHeight: 1.55, margin: '0 0 16px' }}>{s.desc}</p>
                    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      Conocer más <ArrowRight style={{ width: 13, height: 13 }} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              style={{ background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: 16, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--color-neutral-900)' }}>Actividad semanal</span>
                <span style={{ fontSize: 11, color: 'var(--color-neutral-400)', background: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)', borderRadius: 8, padding: '3px 10px' }}>Esta semana</span>
              </div>

              <div style={{ position: 'relative' }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={2} dataKey="value" strokeWidth={0}>
                      {chartData.map(d => <Cell key={d.name} fill={d.color} />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--color-neutral-900)' }}>{total}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-neutral-400)' }}>Envíos</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {chartData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--color-neutral-600)' }}>{d.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-neutral-900)' }}>{d.value}</span>
                      <span style={{ fontSize: 11, color: 'var(--color-neutral-400)' }}>({d.pct}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section id="tarifas" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="page-container section-py">
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-neutral-900)', margin: '0 0 40px' }}
          >
            Cómo funciona
          </motion.h2>

          <div style={{ display: 'grid', gap: '2rem' }} className="steps-grid">
            <style>{`@media(min-width:640px){.steps-grid{grid-template-columns:1fr 1fr}} @media(min-width:1024px){.steps-grid{grid-template-columns:1fr 1fr 1fr 1fr}}`}</style>
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ position: 'relative', textAlign: 'center' }}
              >
                {/* connector */}
                {i < steps.length - 1 && (
                  <div className="step-connector" style={{ display: 'none', position: 'absolute', top: 20, left: 'calc(50% + 28px)', right: '-50%', borderTop: '2px dashed var(--color-neutral-300)', zIndex: 0 }} />
                )}
                <style>{`@media(min-width:1024px){.step-connector{display:block!important}}`}</style>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 40, height: 40, background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 12px rgba(30,138,76,0.25)' }}>
                    {step.n}
                  </div>
                  <div style={{ width: 40, height: 40, background: 'rgba(30,138,76,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <step.icon style={{ width: 20, height: 20, color: 'var(--color-primary)' }} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--color-neutral-900)', margin: '0 0 8px' }}>{step.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--color-neutral-500)', lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
