import React from 'react';
import { Button } from './Button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-[#E4E9E4] dark:border-[#2C3830] bg-[#FAFBF9]/50 dark:bg-[#181F1B]/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#E7EDE8] dark:bg-[#202B24] flex items-center justify-center text-[#344E41] dark:text-[#E7EDE8] mb-3.5 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-[#1F2722] dark:text-[#F0F5F1]">
        {title}
      </h3>
      <p className="mt-1 text-xs text-[#68736C] dark:text-[#95A59A] max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
