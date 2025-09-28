import React from 'react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string;
  className?: string;
  gradient?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, className, gradient }) => {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Subtle Left Border Accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient || 'from-gray-400 to-gray-600'}`} />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
          {title}
        </h3>
        <div className={cn("text-3xl font-bold leading-tight", className)}>
          {value}
        </div>
      </div>

      {/* Subtle hover background */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};