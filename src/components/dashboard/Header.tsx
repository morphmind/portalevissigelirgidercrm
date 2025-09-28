import { Button } from '@/components/ui/button';
import { PlusCircle, Shield } from 'lucide-react';
import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
interface HeaderProps {
  onAddTransaction: () => void;
}
export const Header: React.FC<HeaderProps> = ({ onAddTransaction }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <header className="flex items-center justify-between pb-4 border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-gray-100">
          PortaLevissi
        </h1>
        <ThemeToggle className="relative top-auto right-auto" />
      </div>
      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <Link to="/admin">
            <Button variant="outline" className="transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Button>
          </Link>
        )}
        <Button onClick={onAddTransaction} className="transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95">
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni İşlem Ekle
        </Button>
      </div>
    </header>
  );
};