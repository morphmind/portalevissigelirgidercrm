import { IndexedEntity } from "./core-utils";
import type { Transaction, Category } from "@shared/types";
// TRANSACTION ENTITY: one DO instance per transaction
export class TransactionEntity extends IndexedEntity<Transaction> {
  static readonly entityName = "transaction";
  static readonly indexName = "transactions";
  static readonly initialState: Transaction = {
    id: "",
    date: new Date().toISOString(),
    type: 'expense',
    categoryId: '',
    amount: 0,
  };
}
// CATEGORY ENTITY: one DO instance per category
export class CategoryEntity extends IndexedEntity<Category> {
  static readonly entityName = "category";
  static readonly indexName = "categories";
  static readonly initialState: Category = {
    id: "",
    name: "",
    type: 'expense',
  };
  static readonly seedData: ReadonlyArray<Category> = [
    // Income
    { id: 'cat_inc_1', name: 'Kira', type: 'income' },
    { id: 'cat_inc_2', name: 'Bonus', type: 'income' },
    // Expense
    { id: 'cat_exp_1', name: 'Alışveriş', type: 'expense' },
    { id: 'cat_exp_2', name: 'Temizlik', type: 'expense' },
    { id: 'cat_exp_3', name: 'Havuz', type: 'expense' },
    { id: 'cat_exp_4', name: 'Muhasebe', type: 'expense' },
    { id: 'cat_exp_5', name: 'Kira', type: 'expense' },
    { id: 'cat_exp_6', name: 'Vergi', type: 'expense' },
    { id: 'cat_exp_7', name: 'Bakım-Tadilat', type: 'expense' },
    { id: 'cat_exp_8', name: 'Websiteleri', type: 'expense' },
    { id: 'cat_exp_9', name: 'Sosyal Medya', type: 'expense' },
    { id: 'cat_exp_10', name: 'Sefa', type: 'expense' },
    { id: 'cat_exp_11', name: 'Kaan', type: 'expense' },
    { id: 'cat_exp_12', name: 'Çalışan Maaş', type: 'expense' },
  ];
}