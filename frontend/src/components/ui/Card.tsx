import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'bordered' | 'dark';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'md',
}: CardProps) => {
  const variants = {
    default: 'bg-white border border-neutral-100 shadow-sm',
    elevated: 'bg-white border border-neutral-100 shadow-lg',
    glass: 'glass border border-white/20 shadow-lg',
    bordered: 'bg-white border-2 border-neutral-100',
    dark: 'bg-neutral-900 border border-neutral-800 shadow-lg',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverStyles = hover
    ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-neutral-200'
    : '';

  return (
    <motion.div
      initial={false}
      className={`rounded-2xl ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={`px-6 py-4 border-b border-neutral-100 ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardContent = ({ children, className = '', padding = 'md' }: CardContentProps) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  return (
    <div className={`${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={`px-6 py-4 border-t border-neutral-100 ${className}`}>
      {children}
    </div>
  );
};
