import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const THEME_STORAGE_KEY = 'vault_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // ignore
    }

    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#F8FAFC';
      document.body.style.color = '#0F172A';
    } else {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
      document.body.style.backgroundColor = '#0A0A0B';
      document.body.style.color = '#FFFFFF';
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}
