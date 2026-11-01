import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options = [], children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#68736C] dark:text-[#95A59A]"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-xl border bg-white dark:bg-[#1E2621] text-[#1F2722] dark:text-[#F0F5F1] text-sm py-2.5 pl-3.5 pr-10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#344E41]/30 focus:border-[#344E41] disabled:opacity-50 disabled:bg-[#F3F6F3] dark:disabled:bg-[#181E1A] ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20'
                : 'border-[#E4E9E4] dark:border-[#2C3830]'
            } ${className}`}
            {...props}
          >
            {options.length > 0
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#68736C] dark:text-[#95A59A]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#68736C] dark:text-[#95A59A]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
