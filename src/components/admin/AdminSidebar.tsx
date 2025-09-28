import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Shapes, BarChart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Kontrol Paneli' },
  { to: '/admin/categories', icon: Shapes, label: 'Kategoriler' },
  { to: '/admin/reports', icon: BarChart, label: 'Raporlar' },
];
export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
      isActive && 'bg-muted text-primary'
    );
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/admin" className="flex items-center gap-2 font-semibold font-display">
            <span className="">VillaFlow</span>
          </NavLink>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end className={navLinkClasses}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 space-y-2">
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="w-full justify-start gap-3" onClick={() => navigate('/')}>
                  <Home className="h-4 w-4" />
                  <span className="hidden lg:inline">Ana Sayfaya Dön</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                <p>Ana Sayfaya Dön</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="w-full justify-start gap-3" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Çıkış Yap</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                <p>Çıkış Yap</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};