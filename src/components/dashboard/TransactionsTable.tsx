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
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100">Giren</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="px-6 py-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {format(new Date(transaction.date), 'dd.MM.yyyy', { locale: tr })}
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-md text-xs font-medium">
                      {transaction.category?.name ?? 'Diğer'}
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
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-md ${
                      transaction.type === 'income'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                    }`}>
                      {transaction.type === 'income' ? 'Gelir' : 'Gider'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md">
                      {transaction.user || 'Bilinmiyor'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-200"
                        title="Düzenle"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="px-3 py-1 text-xs font-medium text-rose-700 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50 rounded-md transition-colors duration-200"
                        title="Sil"
                      >
                        Sil
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
      <div className="md:hidden space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="space-y-4">
              {/* Header with date and type */}
              <div className="flex justify-between items-start">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {format(new Date(transaction.date), 'dd.MM.yyyy', { locale: tr })}
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${
                  transaction.type === 'income'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                }`}>
                  {transaction.type === 'income' ? 'Gelir' : 'Gider'}
                </span>
              </div>

              {/* Category */}
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">Kategori: </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {transaction.category?.name ?? 'Diğer'}
                </span>
              </div>

              {/* Description */}
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">Açıklama: </span>
                <span className="text-gray-600 dark:text-gray-400">{transaction.description}</span>
              </div>

              {/* User */}
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">İşlemi Giren: </span>
                <span className="text-gray-600 dark:text-gray-400">{transaction.user || 'Bilinmiyor'}</span>
              </div>

              {/* Amount and actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className={`text-xl font-bold ${
                  transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-200"
                    title="Düzenle"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="px-3 py-1 text-xs font-medium text-rose-700 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50 rounded-md transition-colors duration-200"
                    title="Sil"
                  >
                    Sil
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