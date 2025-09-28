import { Button } from '@/components/ui/button';
import { PlusCircle, Shield } from 'lucide-react';
import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
interface HeaderProps {
  onAddTransaction: () => void;
}
export const Header: React.FC<HeaderProps> = ({ onAddTransaction }) => {
  console.log('🔥 HEADER COMPONENT RENDERING');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  console.log('🔥 Header props - onAddTransaction type:', typeof onAddTransaction);
  console.log('🔥 Header state - isAuthenticated:', isAuthenticated);

  const handleAdminClick = () => {
    console.log('🔥 ADMIN BUTTON CLICKED - FUNCTION CALLED');
    console.log('🔥 navigate function exists:', typeof navigate);
    console.log('🔥 isAuthenticated:', isAuthenticated);
    navigate('/admin');
    console.log('🔥 navigate called');
  };

  const handleAddTransactionClick = () => {
    console.log('🔥 ADD TRANSACTION BUTTON CLICKED - FUNCTION CALLED');
    console.log('🔥 onAddTransaction function exists:', typeof onAddTransaction);
    onAddTransaction();
    console.log('🔥 onAddTransaction called');
  };

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
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              console.log('🔥 ADMIN BUTTON DOM EVENT FIRED');
              console.log('🔥 Event target:', e.target);
              console.log('🔥 Event type:', e.type);
              handleAdminClick();
            }}
            onMouseDown={() => console.log('🔥 ADMIN BUTTON MOUSEDOWN')}
            onMouseUp={() => console.log('🔥 ADMIN BUTTON MOUSEUP')}
          >
            <Shield className="mr-2 h-4 w-4" />
            Admin Panel
          </Button>
        )}
        <Button
          type="button"
          onClick={(e) => {
            console.log('🔥 ADD TRANSACTION BUTTON DOM EVENT FIRED');
            console.log('🔥 Event target:', e.target);
            console.log('🔥 Event type:', e.type);
            handleAddTransactionClick();
          }}
          onMouseDown={() => console.log('🔥 ADD TRANSACTION BUTTON MOUSEDOWN')}
          onMouseUp={() => console.log('🔥 ADD TRANSACTION BUTTON MOUSEUP')}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni İşlem Ekle
        </Button>
      </div>
    </header>
  );
};