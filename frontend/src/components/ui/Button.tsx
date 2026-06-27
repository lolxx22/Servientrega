import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading,
  leftIcon,
  rightIcon,
  fullWidth,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer disabled:cursor-not-allowed';

  const variants = {
    primary: [
      'bg-brand-green-600 text-white',
      'shadow-md shadow-brand-green-600/20',
      'hover:bg-brand-green-900 hover:shadow-lg hover:shadow-brand-green-600/25',
      'active:shadow-sm',
      'focus-visible:outline-brand-green-400',
    ].join(' '),
    secondary: [
      'bg-neutral-900 text-white',
      'shadow-md shadow-neutral-900/20',
      'hover:bg-neutral-800 hover:shadow-lg',
      'active:shadow-sm',
      'focus-visible:outline-neutral-900',
    ].join(' '),
    outline: [
      'bg-transparent text-brand-green-600',
      'border-2 border-brand-green-600/20',
      'hover:bg-brand-green-600/5 hover:border-brand-green-600/30',
      'active:bg-brand-green-600/10',
      'focus-visible:outline-brand-green-400',
    ].join(' '),
    ghost: [
      'bg-transparent text-neutral-600',
      'hover:bg-neutral-100 hover:text-neutral-dark',
      'active:bg-neutral-200',
      'focus-visible:outline-neutral-400',
    ].join(' '),
    danger: [
      'bg-danger text-white',
      'shadow-md shadow-danger/20',
      'hover:bg-red-600 hover:shadow-lg hover:shadow-danger/25',
      'active:shadow-sm',
      'focus-visible:outline-danger',
    ].join(' '),
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
    md: 'h-10 px-4 text-sm gap-2 rounded-xl',
    lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
    xl: 'h-14 px-8 text-lg gap-3 rounded-2xl',
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.01 } : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && (
            <span className="flex-shrink-0 w-6 h-6 -mr-1 ml-0.5 rounded-full bg-white/15 flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </motion.button>
  );
};
