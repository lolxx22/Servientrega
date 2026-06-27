import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Avatar } from '../ui/Avatar';

const testimonials = [
  {
    name: 'María García',
    role: 'Directora de Logística, EcoCommerce',
    content: 'Servibot AI ha transformado la forma en que gestiono mis envíos. El chatbot es increíblemente rápido y preciso. Redujimos el tiempo de atención en un 60%.',
    rating: 5,
  },
  {
    name: 'Carlos López',
    role: 'Fundador, TechStore Online',
    content: 'La capacidad de rastreo en tiempo real y la atención automatizada han mejorado la satisfacción de mis clientes significativamente.',
    rating: 5,
  },
  {
    name: 'Ana Martínez',
    role: 'Emprendedora Freelance',
    content: 'Increíble poder crear envíos simplemente hablando con el asistente. La inteligencia artificial funciona perfectamente para mi negocio.',
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-white">
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
            Testimonios
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight mb-4 font-display" style={{ textWrap: 'balance' }}>
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-neutral-500 text-lg leading-relaxed">
            Empresas y profesionales que ya confían en Servibot AI.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-neutral-50 border border-neutral-200 rounded-2xl p-7 hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-primary/10">
                <Quote className="w-8 h-8" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-neutral-600 mb-6 leading-relaxed text-[15px] relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-neutral-200">
                <Avatar name={testimonial.name} size="md" />
                <div>
                  <div className="font-semibold text-neutral-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-neutral-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-neutral-50 rounded-2xl border border-neutral-200 p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '4.9/5', label: 'Calificación promedio' },
              { value: '2,500+', label: 'Empresas activas' },
              { value: '98%', label: 'Satisfacción' },
              { value: '<30s', label: 'Tiempo de respuesta' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary font-mono">{stat.value}</div>
                <div className="text-xs text-neutral-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
