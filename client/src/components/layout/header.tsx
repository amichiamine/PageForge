import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Moon, 
  Sun, 
  User, 
  Bell, 
  Menu,
  Search,
  Zap
} from 'lucide-react';
import { useLocation } from 'wouter';

interface HeaderProps {
  onToggleDarkMode?: () => void;
  isDarkMode?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({ 
  onToggleDarkMode, 
  isDarkMode = false,
  onToggleSidebar 
}: HeaderProps) {
  const [location] = useLocation();
  
  const getPageTitle = () => {
    switch (location) {
      case '/': return 'Tableau de bord';
      case '/dashboard': return 'Tableau de bord';
      case '/projects': return 'Projets';
      case '/templates': return 'Templates';
      case '/settings': return 'Paramètres';
      case '/documentation': return 'Documentation';
      case '/deployment': return 'Déploiement';
      case '/vscode': return 'VS Code';
      default: 
        if (location.startsWith('/editor')) return 'Éditeur visuel';
        return 'PageForge';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-600 dark:text-gray-300"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Page title */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
          
          {location.startsWith('/editor') && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              En cours
            </Badge>
          )}
        </div>
      </div>

      {/* Center section - Search (for larger screens) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans vos projets..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDarkMode}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* User profile */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <User className="h-5 w-5" />
        </Button>

        {/* PageForge badge */}
        <Badge variant="outline" className="ml-2 border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
          PageForge
        </Badge>
      </div>
    </header>
  );
}