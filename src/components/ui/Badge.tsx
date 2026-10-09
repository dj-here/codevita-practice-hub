import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'gold' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    gold: 'bg-brand-sand text-brand-maroon border-brand-gold/40 font-medium',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
