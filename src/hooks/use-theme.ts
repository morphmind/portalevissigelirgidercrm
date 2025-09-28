import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', 'dark');
        }
      } else {
        document.documentElement.classList.remove('dark');
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', 'light');
        }
      }
    } catch { /* ignore localStorage errors */ }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return { isDark, toggleTheme };
}
