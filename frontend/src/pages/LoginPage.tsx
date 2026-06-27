import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bot, Eye, EyeOff, Mail, Lock, ArrowRight, Package, Clock, Globe } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user?.rol === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(axiosError.response?.data?.error?.message || 'Error al iniciar sesión');
    }
  };

  const features = [
    { icon: Package, text: 'Gestión inteligente de envíos' },
    { icon: Clock, text: 'Atención automatizada 24/7' },
    { icon: Globe, text: 'Cobertura en +8 países' },
  ];

  const stats = [
    { value: '50M+', label: 'Envíos' },
    { value: '24/7', label: 'Soporte' },
    { value: '+8', label: 'Países' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Left - Brand Panel */}
      <div className="lg:w-1/2 mesh-gradient-dark relative overflow-hidden flex items-center justify-center p-8 lg:p-12">
        {/* Noise */}
        <div className="absolute inset-0 noise pointer-events-none" />

        {/* Floating accents */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-green-600/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-green-600 to-brand-green-900 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-green-600/20">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight font-display">
              Servi<span className="text-brand-green-400">Bot</span> AI
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight font-display" style={{ textWrap: 'balance' }}>
            Bienvenido de vuelta
          </h1>
          <p className="text-neutral-400 mb-10 leading-relaxed">
            Inicia sesión para acceder a tu panel de control y gestionar tus envíos.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-10">
            {features.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-brand-green-400" />
                </div>
                <span className="text-sm text-neutral-300">{text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 pt-8 border-t border-white/10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-2">
                {i > 0 && <div className="w-px h-8 bg-white/10" />}
                <div>
                  <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
                  <div className="text-[11px] text-neutral-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Form Panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight font-display">
              Iniciar Sesión
            </h2>
            <p className="text-neutral-500">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-danger/5 border border-danger/20 text-danger px-4 py-3 rounded-xl text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}

            <Input
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="w-5 h-5" /> : undefined}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-semibold text-brand-green-600 hover:text-brand-green-900 transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
