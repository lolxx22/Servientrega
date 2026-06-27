import { Link } from 'react-router-dom';
import { Bot, Phone, Mail, MapPin } from 'lucide-react';

const cols = {
  servicios: [
    { name: 'Envíos Nacionales',    href: '/#servicios' },
    { name: 'Envíos Internacionales', href: '/#servicios' },
    { name: 'Rastreo de Guías',     href: '/tracking' },
    { name: 'Cotización Online',    href: '/#tarifas' },
  ],
  empresa: [
    { name: 'Sobre Nosotros',          href: '/' },
    { name: 'Trabaja con Nosotros',    href: '/' },
    { name: 'Términos y Condiciones',  href: '/' },
    { name: 'Política de Privacidad',  href: '/' },
  ],
  ayuda: [
    { name: 'Preguntas Frecuentes', href: '/' },
    { name: 'Centro de Ayuda',      href: '/' },
    { name: 'Contacto',             href: '/#contacto' },
    { name: 'Soporte 24/7',         href: '/' },
  ],
};

const socials = [
  { label: 'Facebook',  d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', fill: true },
  { label: 'Instagram', d: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11A2 2 0 0119.5 8.5v7A2 2 0 0117.5 17.5h-11A2 2 0 014.5 15.5v-7A2 2 0 016.5 6.5z', fill: false },
  { label: 'LinkedIn',  d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z', fill: true },
  { label: 'YouTube',   d: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z', fill: true },
];

const linkStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)',
  textDecoration: 'none', padding: '3px 0', transition: 'color 0.15s',
};

export const Footer = () => (
  <footer id="contacto" style={{ background: '#0B1410', color: 'white' }}>
    <div className="page-container section-py">

      {/* grid */}
      <div style={{ display: 'grid', gap: '2.5rem', marginBottom: '2.5rem' }} className="footer-grid">
        <style>{`@media(min-width:640px){.footer-grid{grid-template-columns:1fr 1fr}} @media(min-width:1024px){.footer-grid{grid-template-columns:2fr 1fr 1fr 1fr 1.4fr}}`}</style>

        {/* brand */}
        <div style={{ gridColumn: 'span 1' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: 'var(--color-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'white' }}>
              Servi<span style={{ color: 'var(--color-primary-light)' }}>Bot</span> AI
            </span>
          </Link>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', lineHeight: 1.65, marginBottom: 20, maxWidth: 260 }}>
            La nueva experiencia digital de Servientrega impulsada por Inteligencia Artificial.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {socials.map(s => (
              <a key={s.label} href="#" aria-label={s.label}
                style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', textDecoration: 'none' }}
              >
                <svg style={{ width: 15, height: 15, color: 'white' }} fill={s.fill ? 'currentColor' : 'none'} stroke={s.fill ? 'none' : 'currentColor'} strokeWidth={s.fill ? 0 : 2} viewBox="0 0 24 24">
                  <path d={s.d} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Servicios */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 16 }}>Servicios</div>
          {cols.servicios.map(l => <Link key={l.name} to={l.href} style={linkStyle}>{l.name}</Link>)}
        </div>

        {/* Empresa */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 16 }}>Empresa</div>
          {cols.empresa.map(l => <Link key={l.name} to={l.href} style={linkStyle}>{l.name}</Link>)}
        </div>

        {/* Ayuda */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 16 }}>Ayuda</div>
          {cols.ayuda.map(l => <Link key={l.name} to={l.href} style={linkStyle}>{l.name}</Link>)}
        </div>

        {/* Contacto */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 16 }}>Contacto</div>
          {[
            { Icon: Phone, text: '+593 1800-SERVI (73784)' },
            { Icon: Mail,  text: 'soporte@servientrega.com.ec' },
            { Icon: MapPin,text: 'Av. Amazonas N36-50, Quito' },
          ].map(({ Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <Icon style={{ width: 15, height: 15, color: 'var(--color-primary-light)', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.45 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          © {new Date().getFullYear()} ServiBot AI — Servientrega. Todos los derechos reservados.
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacidad', 'Términos', 'Cookies'].map(t => (
            <Link key={t} to="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>{t}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
