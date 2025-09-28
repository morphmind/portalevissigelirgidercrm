import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}
export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, className }) => {
  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 shadow-md group">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      <div className="relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", className)}>{value}</div>
        </CardContent>
      </div>
    </Card>
  );
};