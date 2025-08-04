import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface Colors {
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
  colors: Colors;
  updateColors: (newColors: Partial<Colors>) => void;
  resetColors: () => void;
}

const defaultColors: Colors = {
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#8b5cf6',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0'
};

const defaultDarkColors: Colors = {
  primary: '#60a5fa',
  secondary: '#94a3b8',
  accent: '#a78bfa',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [colors, setColors] = useState<Colors>(defaultColors);

  useEffect(() => {
    // Charger le thème depuis localStorage
    const savedTheme = localStorage.getItem('pageforge-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Charger les couleurs depuis localStorage
    const savedColors = localStorage.getItem('pageforge-colors');
    if (savedColors) {
      try {
        setColors(JSON.parse(savedColors));
      } catch (error) {
        console.error('Erreur lors du chargement des couleurs:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Appliquer le thème à la racine du document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Mettre à jour les variables CSS
    const root = document.documentElement;
    const currentColors = theme === 'dark' ? { ...defaultDarkColors, ...colors } : colors;
    
    root.style.setProperty('--color-primary', currentColors.primary);
    root.style.setProperty('--color-secondary', currentColors.secondary);
    root.style.setProperty('--color-accent', currentColors.accent);
    root.style.setProperty('--color-background', currentColors.background);
    root.style.setProperty('--color-surface', currentColors.surface);
    root.style.setProperty('--color-text', currentColors.text);
    root.style.setProperty('--color-text-secondary', currentColors.textSecondary);
    root.style.setProperty('--color-border', currentColors.border);
  }, [theme, colors]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pageforge-theme', newTheme);
    
    // Mettre à jour les couleurs pour le nouveau thème
    if (newTheme === 'dark') {
      setColors(defaultDarkColors);
    } else {
      setColors(defaultColors);
    }
  };

  const updateColors = (newColors: Partial<Colors>) => {
    const updatedColors = { ...colors, ...newColors };
    setColors(updatedColors);
    localStorage.setItem('pageforge-colors', JSON.stringify(updatedColors));
  };

  const resetColors = () => {
    const resetColors = theme === 'dark' ? defaultDarkColors : defaultColors;
    setColors(resetColors);
    localStorage.setItem('pageforge-colors', JSON.stringify(resetColors));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors,
        updateColors,
        resetColors,
      }}
    >
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