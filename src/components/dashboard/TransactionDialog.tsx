import React, { useEffect, useMemo, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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
      <DialogContent
        className={`bg-slate-800 border-2 border-orange-500 ${
          isMobile
            ? 'fixed inset-0 w-full h-full rounded-none m-0 p-0'
            : 'sm:max-w-[480px] max-h-[90vh] rounded-lg'
        }`}
        style={isMobile ? {
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          width: '100vw',
          height: '100vh',
          maxWidth: 'none',
          maxHeight: 'none',
          transform: 'none',
          margin: '0',
          padding: '0',
          overflow: 'hidden'
        } : {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '480px',
          maxHeight: '90vh'
        }}
      >
        <div className={`${isMobile ? 'h-full flex flex-col p-4 safe-area-inset' : 'p-6'}`}>
          {isMobile && <div className="w-12 h-1 bg-orange-500 rounded-full mx-auto mb-4"></div>}
          <DialogHeader className={`${isMobile ? 'text-center mb-4 flex-shrink-0' : 'text-left mb-4'}`}>
            <DialogTitle className={`font-mono font-bold text-orange-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>{title}</DialogTitle>
            <DialogDescription className={`text-gray-300 font-mono mt-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>{description}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`grid gap-4 ${isMobile ? 'flex-1 overflow-y-auto pb-4' : 'overflow-y-auto gap-6'}`}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className={`${isMobile ? 'space-y-2' : 'md:grid md:grid-cols-4 md:items-center gap-4 space-y-2 md:space-y-0'}`}>
                  <FormLabel className={`font-mono font-bold text-gray-300 ${isMobile ? 'text-base' : 'md:text-right'}`}>Tür</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={`bg-slate-600 border-gray-500 text-white font-mono ${isMobile ? 'h-12 text-base' : 'md:col-span-3 h-10'}`}>
                        <SelectValue placeholder="İşlem türü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-700 border-gray-500">
                      <SelectItem value="income" className="text-white hover:bg-slate-600 font-mono">Gelir</SelectItem>
                      <SelectItem value="expense" className="text-white hover:bg-slate-600 font-mono">Gider</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="md:col-start-2 md:col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className={`${isMobile ? 'space-y-2' : 'md:grid md:grid-cols-4 md:items-center gap-4 space-y-2 md:space-y-0'}`}>
                  <FormLabel className={`font-mono font-bold text-gray-300 ${isMobile ? 'text-base' : 'md:text-right'}`}>Tarih</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(`md:col-span-3 justify-start text-left font-normal bg-slate-600 border-gray-500 text-white font-mono hover:bg-slate-700 ${isMobile ? 'h-14 text-lg' : 'h-10'}`, !field.value && 'text-gray-400')}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP', { locale: tr }) : <span>Tarih seçin</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-700 border-gray-500">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="md:col-start-2 md:col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className={`${isMobile ? 'space-y-2' : 'md:grid md:grid-cols-4 md:items-center gap-4 space-y-2 md:space-y-0'}`}>
                  <FormLabel className={`font-mono font-bold text-gray-300 ${isMobile ? 'text-base' : 'md:text-right'}`}>Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={`md:col-span-3 bg-slate-600 border-gray-500 text-white font-mono ${isMobile ? 'h-14 text-lg' : 'h-10'}`}>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-700 border-gray-500">
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white hover:bg-slate-600 font-mono">{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="md:col-start-2 md:col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:items-center gap-4 space-y-2 md:space-y-0">
                  <FormLabel className={`md:text-right font-mono font-bold text-gray-300 ${isMobile ? 'text-lg' : ''}`}>Tutar</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" className={`md:col-span-3 bg-slate-600 border-gray-500 text-white font-mono placeholder:text-gray-400 ${isMobile ? 'h-14 text-lg' : 'h-10'}`} {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage className="md:col-start-2 md:col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:items-center gap-4 space-y-2 md:space-y-0">
                  <FormLabel className={`md:text-right font-mono font-bold text-gray-300 ${isMobile ? 'text-lg' : ''}`}>İşlemi Giren</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={`md:col-span-3 bg-slate-600 border-gray-500 text-white font-mono ${isMobile ? 'h-14 text-lg' : 'h-10'}`}>
                        <SelectValue placeholder="Kim girdi?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-700 border-gray-500">
                      <SelectItem value="Kaan" className="text-white hover:bg-slate-600 font-mono">Kaan</SelectItem>
                      <SelectItem value="Sefa" className="text-white hover:bg-slate-600 font-mono">Sefa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="md:col-start-2 md:col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:grid md:grid-cols-4 md:items-center gap-4 space-y-2 md:space-y-0">
                  <FormLabel className={`md:text-right font-mono font-bold text-gray-300 ${isMobile ? 'text-lg' : ''}`}>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea placeholder="İşlem açıklaması (isteğe bağlı)" className={`md:col-span-3 bg-slate-600 border-gray-500 text-white font-mono placeholder:text-gray-400 ${isMobile ? 'min-h-20 text-lg' : 'min-h-10'}`} {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage className="md:col-start-2 md:col-span-3" />
                </FormItem>
              )}
            />
            <DialogFooter className={`${isMobile ? 'flex-col gap-4 pt-6 border-t border-gray-600 mt-6' : 'md:flex-row flex-col gap-2 pt-6 border-t border-gray-600'}`}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className={`${isMobile ? 'w-full py-4 text-lg' : 'flex-1 md:flex-none'} bg-slate-600 border-gray-500 text-white font-mono font-bold hover:bg-slate-700`}
              >
                İPTAL
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className={`${isMobile ? 'w-full py-4 text-lg' : 'flex-1 md:flex-none'} bg-orange-600 border-orange-500 text-white font-mono font-bold hover:bg-orange-700`}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                KAYDET
              </Button>
            </DialogFooter>
          </form>
        </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};