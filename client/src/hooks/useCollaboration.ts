import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  CollaborationEvent, 
  UserPresence, 
  CollaborationState, 
  COLLABORATION_CONFIG 
} from '@shared/collaboration';

interface UseCollaborationOptions {
  projectId: string;
  userId: string;
  userName: string;
  enabled?: boolean;
}

interface UseCollaborationReturn {
  isConnected: boolean;
  isConnecting: boolean;
  users: UserPresence[];
  currentUser: UserPresence | null;
  sendEvent: (event: Omit<CollaborationEvent, 'projectId' | 'userId' | 'sessionId' | 'timestamp'>) => void;
  updateCursor: (x: number, y: number) => void;
  selectComponent: (componentId: string | null) => void;
  lockComponent: (componentId: string, lockType: 'edit' | 'style' | 'content') => void;
  unlockComponent: (componentId: string) => void;
  error: string | null;
  stats: {
    activeUsers: number;
    totalConnections: number;
  };
}

export function useCollaboration({
  projectId,
  userId,
  userName,
  enabled = true
}: UseCollaborationOptions): UseCollaborationReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [currentUser, setCurrentUser] = useState<UserPresence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ activeUsers: 0, totalConnections: 0 });

  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string>('');
  const cursorThrottleRef = useRef<NodeJS.Timeout>();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!enabled || !projectId || !userId || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/collaboration?projectId=${encodeURIComponent(projectId)}&userId=${encodeURIComponent(userId)}&userName=${encodeURIComponent(userName)}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Collaboration WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const collaborationEvent: CollaborationEvent = JSON.parse(event.data);
          handleCollaborationEvent(collaborationEvent);
        } catch (error) {
          console.error('Failed to parse collaboration event:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('Collaboration WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;

        // Reconnexion automatique avec backoff
        if (enabled && reconnectAttemptsRef.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('Collaboration WebSocket error:', error);
        setError('Erreur de connexion collaborative');
        setIsConnecting(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setError('Impossible de se connecter au mode collaboratif');
      setIsConnecting(false);
    }
  }, [enabled, projectId, userId, userName]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setUsers([]);
    setCurrentUser(null);
  }, []);

  const sendEvent = useCallback((event: Omit<CollaborationEvent, 'projectId' | 'userId' | 'sessionId' | 'timestamp'>) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const fullEvent: CollaborationEvent = {
      ...event,
      projectId,
      userId,
      sessionId: sessionIdRef.current,
      timestamp: Date.now()
    };

    try {
      wsRef.current.send(JSON.stringify(fullEvent));
    } catch (error) {
      console.error('Failed to send collaboration event:', error);
    }
  }, [projectId, userId]);

  const updateCursor = useCallback((x: number, y: number) => {
    if (cursorThrottleRef.current) {
      clearTimeout(cursorThrottleRef.current);
    }

    cursorThrottleRef.current = setTimeout(() => {
      sendEvent({
        type: 'cursor_move',
        data: { cursor: { x, y } }
      });
    }, COLLABORATION_CONFIG.CURSOR_UPDATE_THROTTLE);
  }, [sendEvent]);

  const selectComponent = useCallback((componentId: string | null) => {
    sendEvent({
      type: 'component_select',
      data: { componentId }
    });
  }, [sendEvent]);

  const lockComponent = useCallback((componentId: string, lockType: 'edit' | 'style' | 'content') => {
    sendEvent({
      type: 'project_lock',
      data: { componentId, lockType }
    });
  }, [sendEvent]);

  const unlockComponent = useCallback((componentId: string) => {
    sendEvent({
      type: 'project_unlock',
      data: { componentId }
    });
  }, [sendEvent]);

  const handleCollaborationEvent = useCallback((event: CollaborationEvent) => {
    switch (event.type) {
      case 'user_join':
        if (event.data?.state) {
          const state: CollaborationState = event.data.state;
          setUsers(state.users);
          setStats({
            activeUsers: state.users.filter(u => u.isActive).length,
            totalConnections: state.users.length
          });
        }
        if (event.data?.user && event.sessionId !== sessionIdRef.current) {
          setUsers(prev => {
            const filtered = prev.filter(u => u.sessionId !== event.sessionId);
            return [...filtered, event.data.user];
          });
        }
        if (event.sessionId === sessionIdRef.current || event.userId === userId) {
          sessionIdRef.current = event.sessionId;
          setCurrentUser(event.data?.user || null);
        }
        break;

      case 'user_leave':
        setUsers(prev => prev.filter(u => u.sessionId !== event.sessionId));
        setStats(prev => ({
          activeUsers: Math.max(0, prev.activeUsers - 1),
          totalConnections: Math.max(0, prev.totalConnections - 1)
        }));
        break;

      case 'cursor_move':
        if (event.sessionId !== sessionIdRef.current) {
          setUsers(prev => prev.map(u => 
            u.sessionId === event.sessionId 
              ? { ...u, cursor: event.data?.cursor }
              : u
          ));
        }
        break;

      case 'component_select':
        if (event.sessionId !== sessionIdRef.current) {
          setUsers(prev => prev.map(u => 
            u.sessionId === event.sessionId 
              ? { ...u, selectedComponent: event.data?.componentId }
              : u
          ));
        }
        break;

      case 'component_add':
      case 'component_update':
      case 'component_delete':
      case 'style_change':
      case 'content_change':
        // Ces événements seront gérés par les composants de l'éditeur
        console.log('Collaboration event received:', event.type, event.data);
        break;

      case 'project_lock':
        if (event.data?.error) {
          setError(event.data.error);
          setTimeout(() => setError(null), 3000);
        }
        break;

      case 'project_unlock':
        // Gestion du déverrouillage de composant
        break;
    }
  }, [userId]);

  // Connexion au montage du composant
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  // Nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (cursorThrottleRef.current) {
        clearTimeout(cursorThrottleRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    users: users.filter(u => u.sessionId !== sessionIdRef.current),
    currentUser,
    sendEvent,
    updateCursor,
    selectComponent,
    lockComponent,
    unlockComponent,
    error,
    stats
  };
}