import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Transaction } from '@shared/types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const SKELETON_ROWS = 5;

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, isLoading, onEdit, onDelete }) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <div key={index} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-36 rounded-full" />
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-10 w-20 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Villa işlemleriniz burada görünecek</p>
        <p className="text-gray-500 dark:text-gray-400">Kiralama gelirlerini ve işletme giderlerini takip etmek için ilk işleminizi ekleyin</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Tarih</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Kategori</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Açıklama</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">Tutar</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100">Tür</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="px-6 py-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    📅 {format(new Date(transaction.date), 'dd.MM.yyyy', { locale: tr })}
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                      🏷️ {transaction.category?.name ?? 'Diğer'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                    <div className="truncate font-medium">{transaction.description}</div>
                  </td>
                  <td className={`px-6 py-5 text-lg font-bold text-right ${
                    transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                      transaction.type === 'income'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-rose-500 to-red-600 text-white'
                    }`}>
                      {transaction.type === 'income' ? '💰 Villa Geliri' : '💸 İşletme Gideri'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200"
                        title="Düzenle"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg transition-colors duration-200"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
            {/* Background Gradient based on type */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
              transaction.type === 'income'
                ? 'from-emerald-500 to-green-600'
                : 'from-rose-500 to-red-600'
            } opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

            <div className="relative z-10 space-y-4">
              {/* Header with date and type */}
              <div className="flex justify-between items-start">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  📅 {format(new Date(transaction.date), 'dd.MM.yyyy', { locale: tr })}
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-md ${
                  transaction.type === 'income'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                    : 'bg-gradient-to-r from-rose-500 to-red-600 text-white'
                }`}>
                  {transaction.type === 'income' ? '💰 Villa Geliri' : '💸 İşletme Gideri'}
                </span>
              </div>

              {/* Category */}
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-gray-100">🏷️ Kategori:</span>
                <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-lg text-xs font-medium">
                  {transaction.category?.name ?? 'Diğer'}
                </span>
              </div>

              {/* Description */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">📝 Açıklama:</span>
                <p className="mt-1 text-gray-700 dark:text-gray-300">{transaction.description}</p>
              </div>

              {/* Amount and actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className={`text-2xl font-bold ${
                  transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors duration-200"
                    title="Düzenle"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-3 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-colors duration-200"
                    title="Sil"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Emin misiniz?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bu işlem kalıcı olarak silinecektir. Bu eylem geri alınamaz.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};