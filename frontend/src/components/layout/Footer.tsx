import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Mail, Phone, MapPin, ArrowRight, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const footerLinks = {
    servicios: [
      { name: 'Envíos Nacionales', href: '/tracking' },
      { name: 'Envíos Internacionales', href: '/tracking' },
      { name: 'Rastreo de Guías', href: '/tracking' },
      { name: 'Atención con IA', href: '/' },
    ],
    empresa: [
      { name: 'Sobre Nosotros', href: '/' },
      { name: 'Políticas de Privacidad', href: '/' },
      { name: 'Términos y Condiciones', href: '/' },
      { name: 'Soporte', href: '/' },
    ],
  };

  const socials = [
    { icon: Globe, href: '#', label: 'LinkedIn' },
    { icon: Globe, href: '#', label: 'Twitter' },
    { icon: Globe, href: '#', label: 'Instagram' },
    { icon: Globe, href: '#', label: 'Facebook' },
  ];

  return (
    <footer id="contacto" className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-10 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-lg font-bold tracking-tight font-display mb-1">Mantente actualizado</h3>
            <p className="text-sm text-neutral-400">Recibe novedades sobre logística inteligente y automatización.</p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ¡Gracias por suscribirte!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 sm:w-64 h-10 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all duration-200"
              />
              <Button type="submit" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Suscribir
              </Button>
            </form>
          )}
        </motion.div>

        {/* Main grid */}
        <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-2 md:col-span-1"
          >
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight font-display">
                Servi<span className="text-primary-light">Bot</span> AI
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              La nueva experiencia digital de Servientrega impulsada por Inteligencia Artificial.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-primary transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 mb-4">Servicios</h4>
            <ul className="space-y-2.5">
              {footerLinks.servicios.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-neutral-400">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+593 1800-SERVI</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-neutral-400">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>soporte@servientrega.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-neutral-400">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Av. Amazonas N36-50, Quito, Ecuador</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Servibot AI - Servientrega. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <Link to="/" className="hover:text-white transition-colors">Privacidad</Link>
            <Link to="/" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
