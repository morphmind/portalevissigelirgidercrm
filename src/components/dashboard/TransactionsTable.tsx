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
      <div className="bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-gray-400 dark:border-gray-500 p-16 text-center">
        <div className="text-slate-600 dark:text-slate-300 font-mono">
          <div className="text-2xl font-bold mb-2">NO DATA ENTRIES</div>
          <div className="text-sm">SYSTEM READY FOR INPUT // AWAITING FIRST TRANSACTION</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-800">
            <thead>
              <tr className="border-b-2 border-orange-500">
                <th className="px-4 py-4 text-left text-xs font-bold text-orange-400 font-mono tracking-wider">TARİH</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-orange-400 font-mono tracking-wider">KATEGORİ</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-orange-400 font-mono tracking-wider">AÇIKLAMA</th>
                <th className="px-4 py-4 text-right text-xs font-bold text-orange-400 font-mono tracking-wider">TUTAR</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-orange-400 font-mono tracking-wider">TÜR</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-orange-400 font-mono tracking-wider">OPERATÖR</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-orange-400 font-mono tracking-wider">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="group hover:bg-slate-700/50">
                  <td className="px-4 py-4 text-sm font-mono text-white">
                    {format(new Date(transaction.date), 'dd.MM.yyyy', { locale: tr })}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className="bg-slate-600 text-white px-2 py-1 text-xs font-mono font-bold border border-gray-500">
                      {transaction.category?.name ?? 'DİĞER'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-300 max-w-xs font-mono">
                    <div className="truncate">{transaction.description}</div>
                  </td>
                  <td className={`px-4 py-4 text-lg font-bold text-right font-mono ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-mono font-bold border ${
                      transaction.type === 'income'
                        ? 'bg-green-900/30 text-green-300 border-green-500'
                        : 'bg-red-900/30 text-red-300 border-red-500'
                    }`}>
                      {transaction.type === 'income' ? 'GELİR' : 'GİDER'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-mono font-bold bg-slate-600 text-white border border-gray-500">
                      {transaction.user || 'BİLİNMİYOR'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="px-3 py-1 text-xs font-mono font-bold text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500"
                        title="Düzenle"
                      >
                        DÜZENLE
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="px-3 py-1 text-xs font-mono font-bold text-red-300 bg-red-900/30 hover:bg-red-800/50 border border-red-500"
                        title="Sil"
                      >
                        SİL
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
          <div key={transaction.id} className="bg-slate-800 border-2 border-gray-600 p-4">
            <div className="space-y-3">
              {/* Header with date and type */}
              <div className="flex justify-between items-start border-b border-orange-500 pb-2">
                <div className="text-sm font-mono font-bold text-orange-400">
                  {format(new Date(transaction.date), 'dd.MM.yyyy', { locale: tr })}
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-mono font-bold border ${
                  transaction.type === 'income'
                    ? 'bg-green-900/30 text-green-300 border-green-500'
                    : 'bg-red-900/30 text-red-300 border-red-500'
                }`}>
                  {transaction.type === 'income' ? 'GELİR' : 'GİDER'}
                </span>
              </div>

              {/* Category */}
              <div className="text-sm">
                <span className="font-mono font-bold text-gray-300">KATEGORİ: </span>
                <span className="bg-slate-600 text-white px-2 py-1 text-xs font-mono font-bold border border-gray-500">
                  {transaction.category?.name ?? 'DİĞER'}
                </span>
              </div>

              {/* Description */}
              <div className="text-sm">
                <span className="font-mono font-bold text-gray-300">AÇIKLAMA: </span>
                <span className="text-gray-400 font-mono">{transaction.description}</span>
              </div>

              {/* User */}
              <div className="text-sm">
                <span className="font-mono font-bold text-gray-300">OPERATÖR: </span>
                <span className="bg-slate-600 text-white px-2 py-1 text-xs font-mono font-bold border border-gray-500">
                  {transaction.user || 'BİLİNMİYOR'}
                </span>
              </div>

              {/* Amount and actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                <div className={`text-xl font-bold font-mono ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="px-3 py-1 text-xs font-mono font-bold text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500"
                    title="Düzenle"
                  >
                    DÜZENLE
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="px-3 py-1 text-xs font-mono font-bold text-red-300 bg-red-900/30 hover:bg-red-800/50 border border-red-500"
                    title="Sil"
                  >
                    SİL
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border-2 border-orange-500 p-6 max-w-sm w-full">
            <div className="border-b border-orange-500 pb-3 mb-4">
              <h3 className="text-lg font-mono font-bold text-orange-400">
                ONAY GEREKLİ
              </h3>
            </div>
            <p className="text-gray-300 font-mono mb-6">
              Bu işlem kalıcı olarak silinecektir. Bu eylem geri alınamaz.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-300 bg-slate-600 border border-gray-500 hover:bg-slate-700 font-mono font-bold"
              >
                İPTAL
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-white bg-red-600 border border-red-500 hover:bg-red-700 font-mono font-bold"
              >
                SİL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};