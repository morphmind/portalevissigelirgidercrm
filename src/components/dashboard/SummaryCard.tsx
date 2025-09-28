import React from 'react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string;
  className?: string;
  type?: 'income' | 'expense' | 'profit' | 'loss' | 'balance';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, className, type = 'balance' }) => {
  const getIndicatorColor = () => {
    switch (type) {
      case 'income':
      case 'profit':
        return 'bg-green-500';
      case 'expense':
      case 'loss':
        return 'bg-red-500';
      case 'balance':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (type) {
      case 'income':
        return 'INCOMING';
      case 'expense':
        return 'OUTGOING';
      case 'profit':
        return 'PROFIT';
      case 'loss':
        return 'DEFICIT';
      case 'balance':
        return 'BALANCE';
      default:
        return 'STATUS';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-600 relative">
      {/* Top indicator bar */}
      <div className={`h-2 ${getIndicatorColor()}`} />

      {/* Content */}
      <div className="p-6">
        {/* Title and status */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 font-mono tracking-wider">
            {title}
          </h3>
          <div className={`px-2 py-1 text-xs font-mono font-bold text-white ${getIndicatorColor()}`}>
            {getStatusText()}
          </div>
        </div>

        {/* Value */}
        <div className={cn("text-2xl font-bold font-mono tracking-tight", className)}>
          {value}
        </div>

        {/* Bottom grid pattern */}
        <div className="mt-4 grid grid-cols-12 gap-1 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`h-1 ${getIndicatorColor()}`} />
          ))}
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-orange-500" />
    </div>
  );
};