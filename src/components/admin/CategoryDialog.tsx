import React, { useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';
import { Category, NewCategory } from '@shared/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
const formSchema = z.object({
  name: z.string().min(1, "İsim zorunludur."),
  type: z.enum(['income', 'expense'], {
    required_error: "Tür zorunludur.",
  }),
});
type FormValues = z.infer<typeof formSchema>;
interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewCategory | Category) => void;
  category?: Category | null;
  isSaving: boolean;
}
export const CategoryDialog: React.FC<CategoryDialogProps> = ({ isOpen, onClose, onSave, category, isSaving }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'expense',
    },
  });
  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.reset(category);
      } else {
        form.reset({
          name: '',
          type: 'expense',
        });
      }
    }
  }, [category, isOpen, form]);
  const onSubmit = (values: FormValues) => {
    if (category) {
      onSave({ ...values, id: category.id });
    } else {
      onSave(values);
    }
  };
  const title = category ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle';
  const description = category ? 'Mevcut bir kategorinin detaylarını güncelleyin.' : 'İşlemler için yeni bir kategori oluşturun.';
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">İsim</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Market Alışverişi" className="col-span-3" {...field} />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Tür</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Bir tür seçin" />
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