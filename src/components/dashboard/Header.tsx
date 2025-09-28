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
    <header className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                PortaLevissi
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <ThemeToggle className="relative top-auto right-auto" />
              {isAuthenticated && (
                <button
                  onClick={handleAdminClick}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleAddTransactionClick}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Yeni İşlem
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center py-2">
              <ThemeToggle className="relative top-auto right-auto" />
            </div>
            {isAuthenticated && (
              <button
                onClick={handleAdminClick}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                <Shield className="w-5 h-5 mr-3" />
                Admin Panel
              </button>
            )}
            <button
              onClick={handleAddTransactionClick}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
            >
              <PlusCircle className="w-5 h-5 mr-3" />
              Yeni İşlem Ekle
            </button>
          </div>
        </div>
      )}
    </header>
  );
};