import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-[#F3F6F3] dark:bg-[#1A211D] rounded-xl border border-[#E4E9E4] dark:border-[#2C3830] ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 select-none ${
              isActive
                ? 'bg-white dark:bg-[#242F28] text-[#1F2722] dark:text-[#F0F5F1] shadow-xs'
                : 'text-[#68736C] dark:text-[#95A59A] hover:text-[#1F2722] dark:hover:text-[#F0F5F1]'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-[#E7EDE8] dark:bg-[#344E41] text-[#24372E] dark:text-white'
                    : 'bg-[#E4E9E4] dark:bg-[#202923] text-[#68736C] dark:text-[#95A59A]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
