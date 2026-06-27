import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, ArrowRight, Sparkles, Globe, Clock, Shield, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroSection = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const routeLineRef = useRef<SVGLineElement>(null);
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/tracking?guia=${trackingNumber}`);
    }
  };

  useEffect(() => {
    const el = routeLineRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.strokeDashoffset = '0';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate');
        }
      },
      { threshold: 0.5 }
    );

    const parent = el.closest('section');
    if (parent) observer.observe(parent);

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '50M+', label: 'Envíos entregados', icon: Package },
    { value: '24/7', label: 'Soporte activo', icon: Clock },
    { value: '+8', label: 'Países', icon: Globe },
  ];

  return (
    <section className="relative min-h-[100dvh] flex items-center bg-gradient-to-br from-primary-dark via-primary-dark to-primary overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Glow accents */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-light/10 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-light" />
              Impulsado por Inteligencia Artificial
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] tracking-tight font-display" style={{ textWrap: 'balance' }}>
              Envía y rastrea tus paquetes de forma{' '}
              <span className="relative inline-block">
                <span className="text-primary-light">inteligente</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-light via-white/50 to-primary-light rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-white/60 max-w-lg leading-relaxed"
            >
              La nueva experiencia digital de Servientrega. Atención 24/7,
              seguimiento en tiempo real y gestión automatizada de envíos.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/tracking">
                <Button size="lg" leftIcon={<Package className="w-5 h-5" />} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Consultar Guía
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('chat-widget')?.click()}
                className="border-white/20 text-white hover:bg-white/5 hover:border-white/30"
              >
                Hablar con ServiBot AI
                <Sparkles className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-6 pt-4"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {i > 0 && <div className="w-px h-8 bg-white/10" />}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-primary-light" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
                      <div className="text-[11px] text-white/40 font-medium">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Tracking Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full max-w-md lg:mx-auto"
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 via-primary-light/10 to-primary/5 rounded-3xl blur-2xl opacity-60" />

              {/* Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Green header bar */}
                <div className="bg-gradient-to-r from-primary to-primary-dark px-7 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight font-display">Rastrea tu envío</h3>
                      <p className="text-sm text-white/70">Ingresa tu número de guía</p>
                    </div>
                  </div>
                </div>

                {/* Form body */}
                <div className="p-7">
                  <form onSubmit={handleTrack} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Número de guía
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Ej: SV-123456"
                        className="w-full h-12 px-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none transition-all duration-200 font-mono"
                      />
                    </div>
                    <Button type="submit" fullWidth size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                      Rastrear Ahora
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-neutral-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {[
                        { value: '24/7', label: 'Disponible', icon: Clock },
                        { value: '100%', label: 'Automatizado', icon: Zap },
                        { value: 'IA', label: 'Avanzada', icon: Shield },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1.5">
                          <item.icon className="w-4 h-4 text-primary mx-auto" />
                          <div className="text-base font-bold text-neutral-900 font-mono">{item.value}</div>
                          <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Route line */}
            <div className="hidden lg:flex justify-center mt-8">
              <svg width="2" height="80" viewBox="0 0 2 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line
                  ref={routeLineRef}
                  x1="1" y1="0" x2="1" y2="80"
                  stroke="#3FC97A"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="route-line"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
