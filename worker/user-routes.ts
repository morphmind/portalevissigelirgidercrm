import { Hono } from "hono";
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Env } from './core-utils';
import { TransactionEntity, CategoryEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { Transaction, NewTransaction, Category, NewCategory } from "@shared/types";
const transactionSchema = z.object({
  date: z.string().datetime(),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().positive(),
  user: z.enum(['Kaan', 'Sefa']),
  description: z.string().optional(),
});
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['income', 'expense']),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is created on first request
  app.use('/api/*', async (c, next) => {
    await CategoryEntity.ensureSeed(c.env);
    await next();
  });
  // CATEGORIES
  app.get('/api/categories', async (c) => {
    const { items: categories } = await CategoryEntity.list(c.env);
    categories.sort((a, b) => a.name.localeCompare(b.name));
    return ok(c, categories);
  });
  app.post('/api/categories', zValidator('json', categorySchema), async (c) => {
    const newCategoryData = c.req.valid('json') as NewCategory;
    const id = `cat_${crypto.randomUUID()}`;
    const category: Category = { id, ...newCategoryData };
    await CategoryEntity.create(c.env, category);
    return ok(c, category);
  });
  app.put('/api/categories/:id', zValidator('json', categorySchema), async (c) => {
    const id = c.req.param('id');
    const entity = new CategoryEntity(c.env, id);
    if (!await entity.exists()) {
      return notFound(c, 'Category not found');
    }
    const updatedData = c.req.valid('json');
    const updatedCategory: Category = { id, ...updatedData };
    await entity.save(updatedCategory);
    return ok(c, updatedCategory);
  });
  app.delete('/api/categories/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    // Future enhancement: Check if category is in use before deleting
    const deleted = await CategoryEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Category not found');
    }
    return ok(c, { id, deleted: true });
  });
  // TRANSACTIONS
  app.get('/api/transactions', async (c) => {
    const [{ items: transactions }, { items: categories }] = await Promise.all([
      TransactionEntity.list(c.env),
      CategoryEntity.list(c.env)
    ]);
    const categoriesById = new Map(categories.map(cat => [cat.id, cat]));
    const populatedTransactions = transactions.map(t => ({
      ...t,
      category: categoriesById.get(t.categoryId)
    }));
    populatedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const totalIncome = populatedTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = populatedTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const startingBalance = 0;
    const currentBalance = startingBalance + netProfit;
    return ok(c, {
      transactions: populatedTransactions,
      summary: {
        totalIncome,
        totalExpenses,
        netProfit,
        currentBalance,
      }
    });
  });
  app.post('/api/transactions', zValidator('json', transactionSchema), async (c) => {
    const newTransactionData = c.req.valid('json') as NewTransaction;
    const id = `txn_${crypto.randomUUID()}`;
    const transaction: Transaction = { id, ...newTransactionData };
    await TransactionEntity.create(c.env, transaction);
    return ok(c, transaction);
  });
  app.put('/api/transactions/:id', zValidator('json', transactionSchema), async (c) => {
    const id = c.req.param('id');
    const entity = new TransactionEntity(c.env, id);
    if (!await entity.exists()) {
      return notFound(c, 'Transaction not found');
    }
    const updatedData = c.req.valid('json');
    const updatedTransaction: Transaction = { id, ...updatedData };
    await entity.save(updatedTransaction);
    return ok(c, updatedTransaction);
  });
  app.delete('/api/transactions/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const deleted = await TransactionEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Transaction not found');
    }
    return ok(c, { id, deleted: true });
  });
}