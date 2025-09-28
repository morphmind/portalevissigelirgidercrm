import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { TransactionsApiResponse } from '@shared/types';
import { formatCurrency } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const income = payload.find(p => p.dataKey === 'income')?.value || 0;
    const expense = payload.find(p => p.dataKey === 'expense')?.value || 0;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              Net: {formatCurrency(income - expense)}
            </span>
          </div>
          <div className="flex flex-col space-y-1 text-right">
            <span className="font-bold text-green-500">{formatCurrency(income)}</span>
            <span className="font-bold text-red-500">{formatCurrency(expense)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
export function ReportsPage() {
  const { data, isLoading, isError, error } = useQuery<TransactionsApiResponse>({
    queryKey: ['transactions'],
    queryFn: () => api('/api/transactions'),
  });
  const { chartData, overallSummary } = useMemo(() => {
    if (!data) return { chartData: [], overallSummary: null };
    const monthlyTotals = data.transactions.reduce((acc, transaction) => {
      const date = parseISO(transaction.date);
      const monthKey = format(date, 'yyyy-MM');
      if (!acc[monthKey]) {
        acc[monthKey] = { income: 0, expense: 0, date: date };
      }
      if (transaction.type === 'income') {
        acc[monthKey].income += transaction.amount;
      } else {
        acc[monthKey].expense += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number; date: Date }>);
    const chartData: MonthlyData[] = Object.keys(monthlyTotals)
      .map(key => ({
        month: format(monthlyTotals[key].date, 'MMM yyyy', { locale: tr }),
        income: monthlyTotals[key].income,
        expense: monthlyTotals[key].expense,
        date: monthlyTotals[key].date,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return { chartData, overallSummary: data.summary };
  }, [data]);
  if (isError) {
    return <div>Hata: {error.message}</div>;
  }
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Finansal Raporlar</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-[108px] w-full" />
            <Skeleton className="h-[108px] w-full" />
            <Skeleton className="h-[108px] w-full" />
          </>
        ) : (
          <>
            <SummaryCard
              title="Toplam Gelir"
              value={formatCurrency(overallSummary?.totalIncome ?? 0)}
              icon={<ArrowUpRight className="h-5 w-5 text-green-500" />}
              className="text-green-600"
            />
            <SummaryCard
              title="Toplam Gider"
              value={formatCurrency(overallSummary?.totalExpenses ?? 0)}
              icon={<ArrowDownLeft className="h-5 w-5 text-red-500" />}
              className="text-red-600"
            />
            <SummaryCard
              title="Net Kazanç"
              value={formatCurrency(overallSummary?.netProfit ?? 0)}
              icon={<Scale className="h-5 w-5 text-muted-foreground" />}
              className={(overallSummary?.netProfit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}
            />
          </>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Aylık Gelir & Gider Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => formatCurrency(value as number, 'TRY').replace('₺', '')} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="income" fill="hsl(142.1 76.2% 36.1%)" name="Gelir" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="hsl(0 84.2% 60.2%)" name="Gider" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}