import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, Scale, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
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
      <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900">
        <Header onAddTransaction={handleAddTransaction} />

        {/* Industrial Header Bar */}
        <div className="bg-slate-800 border-b-4 border-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white font-mono">
                  VILLA MANAGEMENT SYSTEM
                </h1>
                <p className="text-orange-400 font-mono text-sm mt-1">
                  OPERATIONAL CONTROL PANEL // STATUS: ACTIVE
                </p>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-mono text-sm">SYSTEM ONLINE</div>
                <div className="text-gray-400 font-mono text-xs">ID: PLS-{new Date().getFullYear()}</div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Financial Metrics Grid */}
          <div className="mb-8">
            <div className="bg-slate-800 text-white p-4 border-l-4 border-orange-500 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-mono">FİNANSAL METRİKLER</h2>
                  <p className="text-gray-400 font-mono text-sm">Gerçek zamanlı gelir analizi ve operasyonel veri</p>
                </div>
                <button
                  onClick={() => setIsMetricsOpen(!isMetricsOpen)}
                  className="md:hidden flex items-center px-3 py-2 text-orange-400 hover:text-orange-300 border border-orange-500 hover:bg-slate-700"
                >
                  {isMetricsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 ${!isMetricsOpen ? 'hidden md:grid' : ''}`}>
              {isLoadingTransactions ? (
                Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-600 h-32">
                    <Skeleton className="h-full w-full" />
                  </div>
                ))
              ) : (
                <>
                  <SummaryCard
                    title="GELİR AKIŞI"
                    value={formatCurrency(summary?.totalIncome ?? 0)}
                    className="text-green-500 dark:text-green-400"
                    type="income"
                  />
                  <SummaryCard
                    title="OPERASYONEL MALİYETLER"
                    value={formatCurrency(summary?.totalExpenses ?? 0)}
                    className="text-red-500 dark:text-red-400"
                    type="expense"
                  />
                  <SummaryCard
                    title="NET PERFORMANS"
                    value={formatCurrency(summary?.netProfit ?? 0)}
                    className={(summary?.netProfit ?? 0) >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}
                    type={(summary?.netProfit ?? 0) >= 0 ? 'profit' : 'loss'}
                  />
                  <SummaryCard
                    title="GÜNCEL BAKİYE"
                    value={formatCurrency(summary?.currentBalance ?? 0)}
                    className="text-blue-500 dark:text-blue-400"
                    type="balance"
                  />
                </>
              )}
            </div>
          </div>

          {/* Transaction Log Section */}
          <div className="mb-8">
            <div className="bg-slate-800 text-white p-4 border-l-4 border-orange-500 mb-6">
              <h2 className="text-lg font-bold font-mono">İŞLEM KAYITLARI</h2>
              <p className="text-gray-400 font-mono text-sm">Tüm finansal operasyonların kronolojik kaydı</p>
            </div>

            <div className="bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-600">
              <TransactionsTable
                transactions={transactions}
                isLoading={isLoadingTransactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        </main>
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