import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-white dark:bg-[#1A211D] border border-[#E4E9E4] dark:border-[#2C3830] shadow-card',
    muted:
      'bg-[#FAFBF9] dark:bg-[#161C18] border border-[#E4E9E4] dark:border-[#2C3830]',
    glass:
      'bg-white/80 dark:bg-[#1A211D]/80 backdrop-blur-md border border-[#E4E9E4]/80 dark:border-[#2C3830]/80 shadow-card',
  }[variant];

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding];

  return (
    <div
      className={`rounded-2xl transition-all duration-150 ${variantStyles} ${paddingStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
