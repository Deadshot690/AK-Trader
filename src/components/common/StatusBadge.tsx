import React from 'react';

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'brand';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  size = 'md',
  dot = true,
  className = '',
}) => {
  // Infer variant if not explicitly provided
  const resolvedVariant: StatusVariant =
    variant ||
    (() => {
      const lower = status.toLowerCase();
      if (
        lower.includes('active') ||
        lower.includes('paid') ||
        lower.includes('approved') ||
        lower.includes('available') ||
        lower.includes('confirmed') ||
        lower.includes('success') ||
        lower.includes('issued')
      )
        return 'success';
      if (
        lower.includes('pending') ||
        lower.includes('renewal') ||
        lower.includes('cleaning') ||
        lower.includes('due') ||
        lower.includes('advance') ||
        lower.includes('draft')
      )
        return 'warning';
      if (
        lower.includes('inactive') ||
        lower.includes('cancelled') ||
        lower.includes('rejected') ||
        lower.includes('expired') ||
        lower.includes('suspended') ||
        lower.includes('maintenance') ||
        lower.includes('danger')
      )
        return 'danger';
      if (
        lower.includes('occupied') ||
        lower.includes('checked-in') ||
        lower.includes('used') ||
        lower.includes('scanned') ||
        lower.includes('disbursed') ||
        lower.includes('redeemed')
      )
        return 'info';
      if (lower.includes('patron') || lower.includes('life')) return 'brand';
      return 'neutral';
    })();

  const variantStyles: Record<StatusVariant, { pill: string; dot: string }> = {
    success: {
      pill: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
      dot: 'bg-emerald-500',
    },
    warning: {
      pill: 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
      dot: 'bg-amber-500',
    },
    danger: {
      pill: 'bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50',
      dot: 'bg-rose-500',
    },
    info: {
      pill: 'bg-sky-50 text-sky-800 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/50',
      dot: 'bg-sky-500',
    },
    brand: {
      pill: 'bg-[#E7EDE8] text-[#24372E] border-[#D1DED3] dark:bg-[#202B24] dark:text-[#E7EDE8] dark:border-[#2F3C33]',
      dot: 'bg-[#344E41]',
    },
    neutral: {
      pill: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
      dot: 'bg-neutral-400',
    },
  };

  const current = variantStyles[resolvedVariant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${current.pill} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />}
      <span className="truncate">{status}</span>
    </span>
  );
};
