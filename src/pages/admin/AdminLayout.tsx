import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, LogOut, Menu, BarChart, Shapes, LayoutDashboard } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Kontrol Paneli' },
  { to: '/admin/categories', icon: Shapes, label: 'Kategoriler' },
  { to: '/admin/reports', icon: BarChart, label: 'Raporlar' },
];
export function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
      isActive && 'bg-muted text-foreground'
    );
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Navigasyon menüsünü aç/kapa</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <NavLink to="/admin" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <span className="font-display">VillaFlow</span>
                </NavLink>
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} end className={navLinkClasses}>
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-auto space-y-2">
                <Button variant="secondary" className="w-full" onClick={() => navigate('/')}>
                  <Home className="mr-2 h-4 w-4" /> Ana Sayfaya Dön
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add breadcrumbs or search here later */}
          </div>
        </header>
        <div className="flex flex-1 flex-col bg-gray-50 dark:bg-gray-900">
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
          <footer className="text-center py-6 text-muted-foreground/80 border-t">
            <p>Built with ❤️ at Cloudflare</p>
            <p className="mt-2">
              <Link to="/" className="text-sm hover:underline text-primary/80">
                Ana Sayfaya Dön
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}