import { motion } from 'motion/react';
import { Truck, Globe, Search, Bot } from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Envíos Nacionales',
    description: 'Envía paquetes a cualquier parte del país de forma rápida y segura con seguimiento en tiempo real.',
    color: 'bg-primary',
  },
  {
    icon: Globe,
    title: 'Envíos Internacionales',
    description: 'Conecta con el mundo mediante nuestros servicios de envío internacional a más de 8 países.',
    color: 'bg-primary-dark',
  },
  {
    icon: Search,
    title: 'Rastreo de Guías',
    description: 'Consulta el estado de tu envío en tiempo real con solo el número de guía.',
    color: 'bg-secondary',
  },
  {
    icon: Bot,
    title: 'Atención Inteligente',
    description: 'Asistente virtual con IA para resolver tus consultas las 24 horas del día, los 7 días de la semana.',
    color: 'bg-primary',
  },
];

export const ServicesSection = () => {
  return (
    <section id="servicios" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            Servicios
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight mb-4 font-display" style={{ textWrap: 'balance' }}>
            Soluciones logísticas completas
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Impulsadas por tecnología de vanguardia e inteligencia artificial para optimizar cada envío.
          </p>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-5 items-stretch">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(30, 138, 76, 0.1)' }}
              className="group bg-white border border-neutral-200 rounded-2xl p-7 hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-5">
                <div className={`flex-shrink-0 w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 tracking-tight font-display">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
