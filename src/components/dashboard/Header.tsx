import React, { useState } from 'react';
import { PlusCircle, Shield, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '../ThemeToggle';

interface HeaderProps {
  onAddTransaction: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddTransaction }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
    setIsMobileMenuOpen(false);
  };

  const handleAddTransactionClick = () => {
    onAddTransaction();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative bg-slate-800 border-b-2 border-orange-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-orange-400">
                PORTALEVISSI
              </h1>
              <div className="text-xs font-mono text-gray-400">
                VILLA MANAGEMENT SYSTEM
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <ThemeToggle className="relative top-auto right-auto" />
              {isAuthenticated && (
                <button
                  onClick={handleAdminClick}
                  className="flex items-center px-4 py-2 text-xs font-mono font-bold text-gray-300 bg-slate-600 border border-gray-500 hover:bg-slate-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  YÖNETİCİ PANELİ
                </button>
              )}
              <button
                onClick={handleAddTransactionClick}
                className="flex items-center px-4 py-2 text-xs font-mono font-bold text-white bg-orange-600 border border-orange-500 hover:bg-orange-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                YENİ İŞLEM
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-orange-400 hover:text-orange-300 hover:bg-slate-700 border border-gray-600"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800 border-t border-orange-500">
            <div className="flex justify-center py-2">
              <ThemeToggle className="relative top-auto right-auto" />
            </div>
            {isAuthenticated && (
              <button
                onClick={handleAdminClick}
                className="flex items-center w-full px-3 py-2 text-sm font-mono font-bold text-gray-300 hover:text-white hover:bg-slate-700 border border-gray-600"
              >
                <Shield className="w-5 h-5 mr-3" />
                YÖNETİCİ PANELİ
              </button>
            )}
            <button
              onClick={handleAddTransactionClick}
              className="flex items-center w-full px-3 py-2 text-sm font-mono font-bold text-white bg-orange-600 hover:bg-orange-700 border border-orange-500"
            >
              <PlusCircle className="w-5 h-5 mr-3" />
              YENİ İŞLEM EKLE
            </button>
          </div>
        </div>
      )}
    </header>
  );
};