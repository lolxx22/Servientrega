import { motion } from 'motion/react';
import { Clock, Eye, Zap, Shield, Users, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Atención 24/7',
    description: 'Soporte disponible las 24 horas del día, los 7 días de la semana. Sin horarios, sin esperas.',
  },
  {
    icon: Eye,
    title: 'Seguimiento en tiempo real',
    description: 'Consulta el estado exacto de tu envío en cualquier momento desde cualquier dispositivo.',
  },
  {
    icon: Zap,
    title: 'Gestión automatizada',
    description: 'Procesos automatizados con IA que reducen tiempos de espera y mejoran la precisión.',
  },
  {
    icon: Shield,
    title: 'Mayor seguridad',
    description: 'Tus datos y envíos están protegidos con los más altos estándares de seguridad internacional.',
  },
  {
    icon: Users,
    title: 'Menor tiempo de espera',
    description: 'Respuestas inmediatas sin necesidad de esperar a un operador humano.',
  },
  {
    icon: TrendingUp,
    title: 'Mejor experiencia',
    description: 'Interfaz moderna e intuitiva diseñada para una experiencia excepcional.',
  },
];

export const BenefitsSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-neutral-50">
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
            Beneficios
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight mb-4 font-display" style={{ textWrap: 'balance' }}>
            Todo lo que Servibot AI puede hacer por ti
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Herramientas diseñadas para transformar la gestión de tus envíos.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -3 }}
              className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 tracking-tight font-display">
                {benefit.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
