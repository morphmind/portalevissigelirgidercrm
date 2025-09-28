import React from 'react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
  gradient?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, className, gradient }) => {
  return (
    <div className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
      {/* Gradient Background */}
      {gradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {title}
          </h3>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient || 'from-gray-500 to-gray-600'} shadow-lg`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
        <div className={cn("text-3xl font-bold", className)}>
          {value}
        </div>
      </div>

      {/* Subtle Border Glow */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient || 'from-gray-500 to-gray-600'} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />
    </div>
  );
};