import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-12',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#344E41] hover:bg-[#283e34] text-white shadow-sm focus:ring-[#344E41]/50 border border-transparent',
    brand:
      'bg-[#24372E] hover:bg-[#1B2922] text-white shadow-sm focus:ring-[#24372E]/50 border border-transparent',
    secondary:
      'bg-[#E7EDE8] hover:bg-[#d9e2db] text-[#1F2722] dark:bg-[#202923] dark:text-[#E7EDE8] dark:hover:bg-[#27332c] focus:ring-[#344E41]/30 border border-[#D5E0D7] dark:border-[#2F3C33]',
    outline:
      'bg-transparent hover:bg-[#F3F6F3] dark:hover:bg-[#1F2621] text-[#1F2722] dark:text-[#E7EDE8] border border-[#E4E9E4] dark:border-[#2D3830] focus:ring-[#344E41]/30',
    ghost:
      'bg-transparent hover:bg-[#F3F6F3] dark:hover:bg-[#1E2520] text-[#1F2722] dark:text-[#E7EDE8] focus:ring-transparent',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500/50 border border-transparent',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
