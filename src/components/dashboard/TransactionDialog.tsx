import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Transaction, NewTransaction, Category } from '@shared/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
const formSchema = z.object({
  date: z.date({
    required_error: "Tarih zorunludur.",
  }),
  type: z.enum(['income', 'expense'], {
    required_error: "Tür zorunludur.",
  }),
  categoryId: z.string().min(1, "Kategori zorunludur."),
  amount: z.coerce.number({
    invalid_type_error: "Geçerli bir tutar girin.",
    required_error: "Tutar zorunludur.",
  }).positive("Tutar pozitif bir sayı olmalıdır."),
  user: z.enum(['Kaan', 'Sefa'], {
    required_error: "Kullanıcı zorunludur.",
  }),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;
interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewTransaction | Omit<Transaction, 'category'>) => void;
  transaction?: Transaction | null;
  isSaving: boolean;
  categories: Category[];
}
export const TransactionDialog: React.FC<TransactionDialogProps> = ({ isOpen, onClose, onSave, transaction, isSaving, categories }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      type: 'expense',
      categoryId: '',
      amount: undefined,
      user: 'Kaan',
      description: '',
    },
  });
  const transactionType = form.watch('type');
  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.type === transactionType);
  }, [categories, transactionType]);
  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        form.reset({
          ...transaction,
          date: new Date(transaction.date),
          amount: transaction.amount,
        });
      } else {
        form.reset({
          date: new Date(),
          type: 'expense',
          categoryId: '',
          amount: undefined,
          user: 'Kaan',
          description: '',
        });
      }
    }
  }, [transaction, isOpen, form]);
  useEffect(() => {
    // Reset category when type changes, but only if it's a user interaction
    // form.formState.isDirty is a good proxy for this
    if (form.formState.isDirty) {
      form.setValue('categoryId', '');
    }
  }, [transactionType, form]);
  const onSubmit = (values: FormValues) => {
    const submissionData = {
      ...values,
      date: values.date.toISOString(),
    };
    if (transaction) {
      onSave({ ...submissionData, id: transaction.id });
    } else {
      onSave(submissionData);
    }
  };
  const title = transaction ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle';
  const description = transaction ? 'Mevcut bir işlemi düzenleyin.' : 'Yeni bir gelir veya gider işlemi ekleyin.';
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Tür</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="İşlem türü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Gelir</SelectItem>
                      <SelectItem value="expense">Gider</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Tarih</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('col-span-3 justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP', { locale: tr }) : <span>Tarih seçin</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Tutar</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" className="col-span-3" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">İşlemi Giren</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Kim girdi?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Kaan">Kaan</SelectItem>
                      <SelectItem value="Sefa">Sefa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Açıklama</FormLabel>
                  <FormControl>
                    <Textarea placeholder="İşlem açıklaması (isteğe bağlı)" className="col-span-3" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>İptal</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};