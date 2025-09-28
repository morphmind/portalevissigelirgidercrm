import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, Scale, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/dashboard/Header';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { TransactionsTable } from '@/components/dashboard/TransactionsTable';
import { TransactionDialog } from '@/components/dashboard/TransactionDialog';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api-client';
import type { Transaction, TransactionsApiResponse, NewTransaction, Category } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
const SKELETON_COUNT = 4;
export function HomePage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: transactionsData, isLoading: isLoadingTransactions, isError: isTransactionsError, error: transactionsError } = useQuery<TransactionsApiResponse>({
    queryKey: ['transactions'],
    queryFn: () => api('/api/transactions'),
  });
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api('/api/categories'),
  });
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setDialogOpen(false);
      setSelectedTransaction(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'An unexpected error occurred.');
    },
  };
  const createMutation = useMutation({
    mutationFn: (newTransaction: NewTransaction) => api<Transaction>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(newTransaction),
    }),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Transaction created successfully!');
      mutationOptions.onSuccess();
    },
  });
  const updateMutation = useMutation({
    mutationFn: (transaction: Omit<Transaction, 'category'>) => api<Transaction>(`/api/transactions/${transaction.id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    }),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Transaction updated successfully!');
      mutationOptions.onSuccess();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api<{ id: string; deleted: boolean }>(`/api/transactions/${id}`, {
      method: 'DELETE',
    }),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Transaction deleted successfully!');
      mutationOptions.onSuccess();
    },
  });
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setDialogOpen(true);
  };
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };
  const handleDeleteTransaction = (id: string) => {
    deleteMutation.mutate(id);
  };
  const handleDialogSave = (transactionData: NewTransaction | Omit<Transaction, 'category'>) => {
    if ('id' in transactionData) {
      updateMutation.mutate(transactionData as Omit<Transaction, 'category'>);
    } else {
      createMutation.mutate(transactionData as NewTransaction);
    }
  };
  const summary = transactionsData?.summary;
  const transactions = transactionsData?.transactions ?? [];
  const categories = categoriesData ?? [];
  const isLoading = isLoadingTransactions || isLoadingCategories;
  if (isTransactionsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-red-500">
        Error: {transactionsError.message}
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header onAddTransaction={handleAddTransaction} />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {isLoadingTransactions ? (
                Array.from({ length: SKELETON_COUNT }).map((_, i) => <Skeleton key={i} className="h-[108px] w-full" />)
              ) : (
                <>
                  <SummaryCard
                    title="Toplam Gelir"
                    value={formatCurrency(summary?.totalIncome ?? 0)}
                    icon={<ArrowUpRight className="h-5 w-5 text-green-500" />}
                    className="text-green-600"
                  />
                  <SummaryCard
                    title="Toplam Gider"
                    value={formatCurrency(summary?.totalExpenses ?? 0)}
                    icon={<ArrowDownLeft className="h-5 w-5 text-red-500" />}
                    className="text-red-600"
                  />
                  <SummaryCard
                    title="Net Kazanç"
                    value={formatCurrency(summary?.netProfit ?? 0)}
                    icon={<Scale className="h-5 w-5 text-muted-foreground" />}
                    className={(summary?.netProfit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}
                  />
                  <SummaryCard
                    title="Güncel Bakiye"
                    value={formatCurrency(summary?.currentBalance ?? 0)}
                    icon={<Wallet className="h-5 w-5 text-muted-foreground" />}
                  />
                </>
              )}
            </div>
            <div>
              <TransactionsTable
                transactions={transactions}
                isLoading={isLoadingTransactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        </main>
        <footer className="text-center py-8 text-muted-foreground/80">
          <p>© 2025 PortaLevissi. Tüm hakları saklıdır.</p>
        </footer>
      </div>
      <TransactionDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedTransaction(null);
        }}
        onSave={handleDialogSave}
        transaction={selectedTransaction}
        isSaving={createMutation.isPending || updateMutation.isPending}
        categories={categories}
      />
    </>
  );
}