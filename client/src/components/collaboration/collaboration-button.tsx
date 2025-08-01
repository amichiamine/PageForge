import React, { useState } from 'react';
import { Users, Wifi, WifiOff, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { UserPresence } from '@shared/collaboration';

interface CollaborationButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  users: UserPresence[];
  stats: {
    activeUsers: number;
    totalConnections: number;
  };
  onToggle: () => void;
  onOpenPanel: () => void;
  error?: string | null;
}

export function CollaborationButton({
  isConnected,
  isConnecting,
  users,
  stats,
  onToggle,
  onOpenPanel,
  error
}: CollaborationButtonProps) {
  const getStatusIcon = () => {
    if (isConnecting) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (isConnected) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (error) return 'destructive';
    if (isConnecting) return 'secondary';
    if (isConnected) return 'default';
    return 'outline';
  };

  const formatUserList = (users: UserPresence[]) => {
    if (users.length === 0) return 'Aucun utilisateur connecté';
    if (users.length === 1) return `1 utilisateur connecté`;
    return `${users.length} utilisateurs connectés`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={getStatusColor()}
          size="sm" 
          className="relative gap-2 px-3"
        >
          {getStatusIcon()}
          <Users className="w-4 h-4" />
          
          {/* Badge de nombre d'utilisateurs */}
          {stats.activeUsers > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-[1.25rem] h-5"
            >
              {stats.activeUsers}
            </Badge>
          )}
          
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {/* Statut de connexion */}
        <div className="px-2 py-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Collaboration</span>
            <div className="flex items-center gap-1 text-xs">
              {getStatusIcon()}
              <span className={`${error ? 'text-red-600' : isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                {error ? 'Erreur' : isConnecting ? 'Connexion...' : isConnected ? 'Connecté' : 'Déconnecté'}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-1">
            {formatUserList(users)}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Actions */}
        <DropdownMenuItem onClick={onToggle}>
          {isConnected ? (
            <>
              <WifiOff className="w-4 h-4 mr-2" />
              Se déconnecter
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 mr-2" />
              Se connecter
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onOpenPanel}>
          <Users className="w-4 h-4 mr-2" />
          Voir les utilisateurs
        </DropdownMenuItem>

        {/* Liste des utilisateurs connectés */}
        {users.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs text-gray-500 font-medium">
              Utilisateurs actifs
            </div>
            
            <div className="max-h-32 overflow-y-auto">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user.sessionId}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm"
                >
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="truncate flex-1">{user.name}</span>
                  {user.selectedComponent && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" title="Édite un composant" />
                  )}
                </div>
              ))}
              
              {users.length > 5 && (
                <div className="px-2 py-1 text-xs text-gray-500">
                  +{users.length - 5} autres...
                </div>
              )}
            </div>
          </>
        )}

        {/* Message d'erreur */}
        {error && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-red-600">
              {error}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}