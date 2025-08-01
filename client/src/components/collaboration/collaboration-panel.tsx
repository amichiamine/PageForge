import React from 'react';
import { UserPresence } from '@shared/collaboration';
import { 
  Users, 
  Wifi, 
  WifiOff, 
  Loader2, 
  AlertCircle,
  Circle,
  MousePointer2,
  Lock,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CollaborationPanelProps {
  isConnected: boolean;
  isConnecting: boolean;
  users: UserPresence[];
  currentUser: UserPresence | null;
  error: string | null;
  stats: {
    activeUsers: number;
    totalConnections: number;
  };
  onToggleCollaboration?: () => void;
}

export function CollaborationPanel({
  isConnected,
  isConnecting,
  users,
  currentUser,
  error,
  stats,
  onToggleCollaboration
}: CollaborationPanelProps) {
  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isConnecting) return 'text-yellow-500';
    if (isConnected) return 'text-green-500';
    return 'text-gray-500';
  };

  const getStatusIcon = () => {
    if (isConnecting) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (isConnected) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (error) return 'Erreur de connexion';
    if (isConnecting) return 'Connexion...';
    if (isConnected) return 'Connecté';
    return 'Déconnecté';
  };

  const formatLastSeen = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    return `Il y a ${Math.floor(diff / 3600000)} h`;
  };

  return (
    <Card className="w-80 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Collaboration
          </div>
          <button
            onClick={onToggleCollaboration}
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span className="hidden sm:inline">{getStatusText()}</span>
          </button>
        </CardTitle>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3 fill-current" style={{ color: currentUser?.color }} />
            <span>{stats.activeUsers} actifs</span>
          </div>
          <div>{stats.totalConnections} connectés</div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Utilisateur actuel */}
        {currentUser && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: currentUser.color }}
              />
              <span className="font-medium text-blue-900">Vous</span>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                {currentUser.name}
              </Badge>
            </div>
            {currentUser.selectedComponent && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Eye className="w-3 h-3" />
                Composant sélectionné
              </div>
            )}
          </div>
        )}

        {/* Liste des utilisateurs */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Utilisateurs connectés ({users.length})
          </h4>
          
          {users.length === 0 && isConnected && (
            <div className="text-center py-6 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun autre utilisateur connecté</p>
            </div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.sessionId}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: user.color }}
                  />
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {user.name}
                      </span>
                      {!user.isActive && (
                        <Circle className="w-2 h-2 fill-gray-400 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {formatLastSeen(user.lastSeen)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {user.selectedComponent && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Eye className="w-3 h-3 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Édite un composant</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  
                  {user.cursor && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <MousePointer2 className="w-3 h-3 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Curseur visible</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conseils de collaboration */}
        {isConnected && users.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h5 className="text-sm font-medium text-yellow-800 mb-1">
              💡 Conseils de collaboration
            </h5>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Les modifications sont synchronisées en temps réel</li>
              <li>• Les composants sont verrouillés pendant l'édition</li>
              <li>• Communiquez vos intentions aux autres utilisateurs</li>
            </ul>
          </div>
        )}

        {/* Indicateurs de performance */}
        {isConnected && (
          <div className="mt-4 text-xs text-gray-500 border-t pt-3">
            <div className="flex justify-between">
              <span>Latence</span>
              <span className="text-green-600">Faible</span>
            </div>
            <div className="flex justify-between">
              <span>Synchronisation</span>
              <span className="text-green-600">Active</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}