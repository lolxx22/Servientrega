import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bot, Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Package, Clock, Globe } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register(nombre, email, password);
      navigate('/login');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(axiosError.response?.data?.error?.message || 'Error al registrar');
    }
  };

  const features = [
    { icon: Package, text: 'Seguimiento en tiempo real' },
    { icon: Clock, text: 'Atención con IA 24/7' },
    { icon: Globe, text: 'Gestión automatizada de envíos' },
  ];

  const stats = [
    { value: '50M+', label: 'Envíos' },
    { value: '24/7', label: 'Soporte' },
    { value: '+8', label: 'Países' },
  ];

  const passwordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(password);
  const strengthColors = ['var(--color-neutral-200)', 'var(--color-danger)', 'var(--color-warning)', '#F59E0B', 'var(--color-primary)'];
  const strengthLabels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 44, padding: '0 16px 0 42px',
    background: 'var(--color-neutral-50)',
    border: '1px solid var(--color-neutral-200)',
    borderRadius: 12, fontSize: 14, color: 'var(--color-neutral-900)',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-primary)';
    e.target.style.boxShadow = '0 0 0 3px rgba(30,138,76,0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-neutral-200)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', background: 'var(--color-surface)' }}>
      {/* Left - Brand Panel */}
      <div style={{
        width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0B1410 0%, #1E293B 100%)',
      }}
        className="register-left-panel"
      >
        <style>{`
          @media(max-width:1024px){.register-left-panel{width:100%!important;min-height:40vh}}
          @media(min-width:1025px){.register-left-panel{width:50%!important}}
        `}</style>

        {/* Floating accents */}
        <div style={{ position: 'absolute', top: '33%', left: '33%', width: 256, height: 256, background: 'rgba(30,138,76,0.12)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 10, maxWidth: 400 }}
        >
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 40, textDecoration: 'none' }}>
            <div style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(30,138,76,0.3)',
            }}>
              <Bot style={{ width: 26, height: 26, color: 'white' }} />
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Servi<span style={{ color: 'var(--color-primary-light)' }}>Bot</span> AI
            </span>
          </Link>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 700, color: 'white', lineHeight: 1.15, margin: '0 0 16px',
          }}>
            Únete a la nueva experiencia digital
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: '0 0 40px' }}>
            Crea tu cuenta y comienza a gestionar tus envíos con la potencia de la inteligencia artificial.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {features.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(30,138,76,0.1)', border: '1px solid rgba(30,138,76,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check style={{ width: 16, height: 16, color: 'var(--color-primary-light)' }} />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
            paddingTop: 40, marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            {stats.map((stat, i) => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />}
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'white' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Form Panel */}
      <div style={{
        width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem',
      }}
        className="register-right-panel"
      >
        <style>{`
          @media(max-width:1024px){.register-right-panel{width:100%!important;padding:2rem!important}}
          @media(min-width:1025px){.register-right-panel{width:50%!important}}
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700,
              color: 'var(--color-neutral-900)', margin: '0 0 8px', letterSpacing: '-0.02em',
            }}>
              Crear Cuenta
            </h2>
            <p style={{ fontSize: 14, color: 'var(--color-neutral-500)', margin: 0 }}>
              Completa tus datos para comenzar
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
                  color: 'var(--color-danger)', padding: '12px 16px', borderRadius: 12, fontSize: 13,
                }}
              >
                <svg style={{ width: 16, height: 16, flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}

            {/* Nombre */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: 8 }}>
                Nombre Completo
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--color-neutral-400)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: 8 }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--color-neutral-400)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: 8 }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--color-neutral-400)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...inputStyle, padding: '0 44px 0 42px' }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-neutral-400)', padding: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        style={{
                          height: 4, flex: 1, borderRadius: 2,
                          background: level <= strength ? strengthColors[strength] : 'var(--color-neutral-100)',
                          transition: 'background 0.3s',
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--color-neutral-400)', margin: 0 }}>
                    Fortaleza: <span style={{ fontWeight: 500 }}>{strengthLabels[strength]}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: 8 }}>
                Confirmar Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--color-neutral-400)', pointerEvents: 'none' }} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    ...inputStyle,
                    borderColor: confirmPassword && password !== confirmPassword ? 'var(--color-danger)' : undefined,
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p style={{ fontSize: 11, color: 'var(--color-danger)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg style={{ width: 12, height: 12 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', height: 48,
                background: isLoading ? 'var(--color-neutral-300)' : 'var(--color-primary)',
                color: 'white', border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s', marginTop: 4,
                boxShadow: isLoading ? 'none' : '0 4px 14px rgba(30,138,76,0.3)',
              }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = 'var(--color-primary-dark)'; }}
              onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = 'var(--color-primary)'; }}
            >
              {isLoading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Cargando...</span>
                </>
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--color-neutral-500)', margin: 0 }}>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" style={{
                fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none',
                transition: 'color 0.15s',
              }}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
