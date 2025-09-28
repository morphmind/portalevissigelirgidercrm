import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { Category, NewCategory } from '@shared/types';
import { CategoryDialog } from '@/components/admin/CategoryDialog';
export function CategoryManagementPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { data: categories = [], isLoading, isError, error } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api('/api/categories'),
  });
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Beklenmedik bir hata oluştu.');
    },
  };
  const createMutation = useMutation({
    mutationFn: (newCategory: NewCategory) => api<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(newCategory),
    }),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Kategori başarıyla oluşturuldu!');
      mutationOptions.onSuccess();
    },
  });
  const updateMutation = useMutation({
    mutationFn: (category: Category) => api<Category>(`/api/categories/${category.id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Kategori başarıyla güncellendi!');
      mutationOptions.onSuccess();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api<{ id: string; deleted: boolean }>(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
    ...mutationOptions,
    onSuccess: () => {
      toast.success('Kategori başarıyla silindi!');
      mutationOptions.onSuccess();
    },
  });
  const handleAdd = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  const handleSave = (data: NewCategory | Category) => {
    if ('id' in data) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  if (isError) {
    return <div>Hata: {error.message}</div>;
  }
  return (
    <>
      <div className="animate-fade-in space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Kategori Yönetimi</h1>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Kategori Ekle
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tüm Kategoriler</CardTitle>
            <CardDescription>Gelir ve gider kategorilerinizi yönetin.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>Tür</TableHead>
                  <TableHead><span className="sr-only">Eylemler</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">Kategori bulunamadı.</TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <Badge variant={category.type === 'income' ? 'default' : 'secondary'}
                          className={category.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}>
                          {category.type === 'income' ? 'Gelir' : 'Gider'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => handleEdit(category)}><Pencil className="mr-2 h-4 w-4" /> Düzenle</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={(e) => e.preventDefault()}><Trash2 className="mr-2 h-4 w-4" /> Sil</DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                              <AlertDialogDescription>Bu kategori kalıcı olarak silinecektir. Bu işlem geri alınamaz.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sil</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
}