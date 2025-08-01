import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
  updateColors: (colors: Partial<ThemeColors>) => void;
  resetColors: () => void;
}

const defaultLightColors: ThemeColors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#10b981',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb'
};

const defaultDarkColors: ThemeColors = {
  primary: '#818cf8',
  secondary: '#a78bfa',
  accent: '#34d399',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('pageforge-theme') as Theme) || 'light';
  });

  const [colors, setColors] = useState<ThemeColors>(() => {
    if (typeof window === 'undefined') return defaultLightColors;
    const saved = localStorage.getItem('pageforge-colors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return theme === 'dark' ? defaultDarkColors : defaultLightColors;
      }
    }
    return theme === 'dark' ? defaultDarkColors : defaultLightColors;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply custom CSS variables
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-border', colors.border);

    localStorage.setItem('pageforge-theme', theme);
    localStorage.setItem('pageforge-colors', JSON.stringify(colors));
  }, [theme, colors]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    // Switch to default colors for the new theme
    setColors(newTheme === 'dark' ? defaultDarkColors : defaultLightColors);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setColors(newTheme === 'dark' ? defaultDarkColors : defaultLightColors);
  };

  const updateColors = (newColors: Partial<ThemeColors>) => {
    setColors(prev => ({ ...prev, ...newColors }));
  };

  const resetColors = () => {
    setColors(theme === 'dark' ? defaultDarkColors : defaultLightColors);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setTheme,
      colors,
      updateColors,
      resetColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}