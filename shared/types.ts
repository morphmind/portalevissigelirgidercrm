export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type TransactionType = 'income' | 'expense';
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}
export type NewCategory = Omit<Category, 'id'>;
export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  description?: string;
  user: string; // Who entered the transaction (Kaan/Sefa)
  category?: Category; // Populated by the backend
}
export type NewTransaction = Omit<Transaction, 'id' | 'category'>;
export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  currentBalance: number;
}
export interface TransactionsApiResponse {
  transactions: Transaction[];
  summary: TransactionSummary;
}