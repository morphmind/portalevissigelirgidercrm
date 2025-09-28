import React from 'react';
export function AdminDashboardPage() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Yönetim Paneli</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-6"
      >
        <div className="flex flex-col items-center gap-1 text-center p-8">
          <h3 className="text-2xl font-bold tracking-tight">
            Yönetim Paneline Hoş Geldiniz
          </h3>
          <p className="text-sm text-muted-foreground">
            Kategorileri yönetmek ve raporları görüntülemek için kenar çubuğunu kullanın.
          </p>
        </div>
      </div>
    </div>
  );
}