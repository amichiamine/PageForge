import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { 
  CollaborationEvent, 
  UserPresence, 
  ProjectLock, 
  CollaborationState,
  USER_COLORS,
  COLLABORATION_CONFIG
} from '@shared/collaboration';
import { randomUUID } from 'crypto';

interface CollaborationConnection {
  ws: WebSocket;
  userId: string;
  sessionId: string;
  projectId: string;
  user: UserPresence;
}

export class CollaborationManager {
  private wss: WebSocketServer;
  private connections: Map<string, CollaborationConnection> = new Map();
  private projectStates: Map<string, CollaborationState> = new Map();
  private projectLocks: Map<string, Map<string, ProjectLock>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/collaboration',
      verifyClient: (info) => {
        const url = new URL(info.req.url!, `http://${info.req.headers.host}`);
        return url.searchParams.has('projectId') && url.searchParams.has('userId');
      }
    });

    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    // Nettoyage périodique des connexions inactives
    setInterval(() => {
      this.cleanupInactiveConnections();
    }, COLLABORATION_CONFIG.PRESENCE_UPDATE_INTERVAL);

    console.log('Collaboration WebSocket server initialized');
  }

  private handleConnection(ws: WebSocket, req: any) {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const projectId = url.searchParams.get('projectId');
    const userId = url.searchParams.get('userId');
    const userName = url.searchParams.get('userName') || 'Utilisateur anonyme';

    if (!projectId || !userId) {
      ws.close(1008, 'Missing projectId or userId');
      return;
    }

    const sessionId = randomUUID();
    const userColor = this.assignUserColor(projectId);

    const user: UserPresence = {
      userId,
      sessionId,
      name: userName,
      color: userColor,
      isActive: true,
      lastSeen: Date.now()
    };

    const connection: CollaborationConnection = {
      ws,
      userId,
      sessionId,
      projectId,
      user
    };

    this.connections.set(sessionId, connection);
    this.addUserToProject(projectId, user);

    // Événements WebSocket
    ws.on('message', (data) => {
      try {
        const event: CollaborationEvent = JSON.parse(data.toString());
        this.handleCollaborationEvent(sessionId, event);
      } catch (error) {
        console.error('Invalid collaboration event:', error);
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(sessionId);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.handleDisconnection(sessionId);
    });

    // Envoyer l'état initial
    this.sendToConnection(sessionId, {
      type: 'user_join',
      projectId,
      userId,
      sessionId,
      timestamp: Date.now(),
      data: {
        state: this.getProjectState(projectId),
        user
      }
    });

    // Notifier les autres utilisateurs
    this.broadcastToProject(projectId, {
      type: 'user_join',
      projectId,
      userId,
      sessionId,
      timestamp: Date.now(),
      data: { user }
    }, sessionId);

    console.log(`User ${userId} joined project ${projectId} (session: ${sessionId})`);
  }

  private handleCollaborationEvent(senderSessionId: string, event: CollaborationEvent) {
    const connection = this.connections.get(senderSessionId);
    if (!connection) return;

    const { projectId, userId } = connection;

    // Mettre à jour la dernière activité
    connection.user.lastSeen = Date.now();
    connection.user.isActive = true;

    switch (event.type) {
      case 'cursor_move':
        this.handleCursorMove(connection, event);
        break;
      
      case 'component_select':
        this.handleComponentSelect(connection, event);
        break;
      
      case 'component_add':
      case 'component_update':
      case 'component_delete':
        this.handleComponentChange(connection, event);
        break;
      
      case 'style_change':
      case 'content_change':
        this.handleContentChange(connection, event);
        break;
      
      case 'project_lock':
        this.handleProjectLock(connection, event);
        break;
      
      case 'project_unlock':
        this.handleProjectUnlock(connection, event);
        break;
    }
  }

  private handleCursorMove(connection: CollaborationConnection, event: CollaborationEvent) {
    connection.user.cursor = event.data?.cursor;
    
    // Diffuser la position du curseur aux autres utilisateurs (throttlé)
    this.broadcastToProject(connection.projectId, event, connection.sessionId);
  }

  private handleComponentSelect(connection: CollaborationConnection, event: CollaborationEvent) {
    connection.user.selectedComponent = event.data?.componentId;
    
    this.broadcastToProject(connection.projectId, event, connection.sessionId);
  }

  private handleComponentChange(connection: CollaborationConnection, event: CollaborationEvent) {
    // Vérifier si le composant est verrouillé par un autre utilisateur
    const lock = this.getComponentLock(connection.projectId, event.data?.componentId);
    if (lock && lock.userId !== connection.userId) {
      this.sendToConnection(connection.sessionId, {
        type: 'project_lock',
        projectId: connection.projectId,
        userId: lock.userId,
        sessionId: lock.sessionId,
        timestamp: Date.now(),
        data: { 
          error: 'Component is locked by another user',
          lock 
        }
      });
      return;
    }

    // Incrémenter la version du projet
    const state = this.getProjectState(connection.projectId);
    state.version++;
    state.lastUpdated = Date.now();

    // Diffuser le changement
    this.broadcastToProject(connection.projectId, {
      ...event,
      data: {
        ...event.data,
        version: state.version
      }
    });
  }

  private handleContentChange(connection: CollaborationConnection, event: CollaborationEvent) {
    // Similaire à handleComponentChange mais pour les modifications de contenu/style
    this.handleComponentChange(connection, event);
  }

  private handleProjectLock(connection: CollaborationConnection, event: CollaborationEvent) {
    const { componentId, lockType } = event.data;
    
    const lock: ProjectLock = {
      componentId,
      userId: connection.userId,
      sessionId: connection.sessionId,
      lockedAt: Date.now(),
      lockType: lockType || 'edit',
      expiresAt: Date.now() + COLLABORATION_CONFIG.LOCK_DURATION
    };

    this.setComponentLock(connection.projectId, componentId, lock);
    
    this.broadcastToProject(connection.projectId, {
      ...event,
      data: { lock }
    });
  }

  private handleProjectUnlock(connection: CollaborationConnection, event: CollaborationEvent) {
    const { componentId } = event.data;
    
    this.removeComponentLock(connection.projectId, componentId);
    
    this.broadcastToProject(connection.projectId, event);
  }

  private handleDisconnection(sessionId: string) {
    const connection = this.connections.get(sessionId);
    if (!connection) return;

    const { projectId, userId } = connection;

    // Supprimer la connexion
    this.connections.delete(sessionId);

    // Retirer l'utilisateur du projet
    this.removeUserFromProject(projectId, userId, sessionId);

    // Supprimer les verrous de cet utilisateur
    this.removeUserLocks(projectId, userId, sessionId);

    // Notifier les autres utilisateurs
    this.broadcastToProject(projectId, {
      type: 'user_leave',
      projectId,
      userId,
      sessionId,
      timestamp: Date.now(),
      data: { userId, sessionId }
    });

    console.log(`User ${userId} left project ${projectId} (session: ${sessionId})`);
  }

  private addUserToProject(projectId: string, user: UserPresence) {
    let state = this.projectStates.get(projectId);
    if (!state) {
      state = {
        projectId,
        users: [],
        locks: [],
        version: 1,
        lastUpdated: Date.now()
      };
      this.projectStates.set(projectId, state);
    }

    // Retirer l'utilisateur existant s'il y en a un
    state.users = state.users.filter(u => u.userId !== user.userId);
    
    // Ajouter le nouvel utilisateur
    state.users.push(user);
    
    // Limiter le nombre d'utilisateurs
    if (state.users.length > COLLABORATION_CONFIG.MAX_USERS_PER_PROJECT) {
      state.users = state.users.slice(-COLLABORATION_CONFIG.MAX_USERS_PER_PROJECT);
    }
  }

  private removeUserFromProject(projectId: string, userId: string, sessionId: string) {
    const state = this.projectStates.get(projectId);
    if (!state) return;

    state.users = state.users.filter(u => 
      u.userId !== userId || u.sessionId !== sessionId
    );

    if (state.users.length === 0) {
      this.projectStates.delete(projectId);
      this.projectLocks.delete(projectId);
    }
  }

  private assignUserColor(projectId: string): string {
    const state = this.getProjectState(projectId);
    const usedColors = state.users.map(u => u.color);
    const availableColors = USER_COLORS.filter(color => !usedColors.includes(color));
    
    return availableColors.length > 0 
      ? availableColors[0] 
      : USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
  }

  private getProjectState(projectId: string): CollaborationState {
    let state = this.projectStates.get(projectId);
    if (!state) {
      state = {
        projectId,
        users: [],
        locks: [],
        version: 1,
        lastUpdated: Date.now()
      };
      this.projectStates.set(projectId, state);
    }
    return state;
  }

  private setComponentLock(projectId: string, componentId: string, lock: ProjectLock) {
    let locks = this.projectLocks.get(projectId);
    if (!locks) {
      locks = new Map();
      this.projectLocks.set(projectId, locks);
    }
    locks.set(componentId, lock);
  }

  private getComponentLock(projectId: string, componentId: string): ProjectLock | undefined {
    const locks = this.projectLocks.get(projectId);
    if (!locks) return undefined;
    
    const lock = locks.get(componentId);
    if (!lock) return undefined;
    
    // Vérifier si le verrou a expiré
    if (Date.now() > lock.expiresAt) {
      locks.delete(componentId);
      return undefined;
    }
    
    return lock;
  }

  private removeComponentLock(projectId: string, componentId: string) {
    const locks = this.projectLocks.get(projectId);
    if (locks) {
      locks.delete(componentId);
    }
  }

  private removeUserLocks(projectId: string, userId: string, sessionId: string) {
    const locks = this.projectLocks.get(projectId);
    if (!locks) return;

    for (const [componentId, lock] of locks.entries()) {
      if (lock.userId === userId && lock.sessionId === sessionId) {
        locks.delete(componentId);
      }
    }
  }

  private broadcastToProject(projectId: string, event: CollaborationEvent, excludeSessionId?: string) {
    for (const [sessionId, connection] of this.connections.entries()) {
      if (connection.projectId === projectId && sessionId !== excludeSessionId) {
        this.sendToConnection(sessionId, event);
      }
    }
  }

  private sendToConnection(sessionId: string, event: CollaborationEvent) {
    const connection = this.connections.get(sessionId);
    if (!connection || connection.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      connection.ws.send(JSON.stringify(event));
    } catch (error) {
      console.error('Failed to send message:', error);
      this.handleDisconnection(sessionId);
    }
  }

  private cleanupInactiveConnections() {
    const now = Date.now();
    const inactiveSessionIds: string[] = [];

    for (const [sessionId, connection] of this.connections.entries()) {
      if (now - connection.user.lastSeen > COLLABORATION_CONFIG.INACTIVE_THRESHOLD) {
        inactiveSessionIds.push(sessionId);
      }
    }

    inactiveSessionIds.forEach(sessionId => {
      this.handleDisconnection(sessionId);
    });

    // Nettoyer les verrous expirés
    for (const [projectId, locks] of this.projectLocks.entries()) {
      for (const [componentId, lock] of locks.entries()) {
        if (now > lock.expiresAt) {
          locks.delete(componentId);
        }
      }
    }
  }

  public getProjectStats() {
    return {
      activeProjects: this.projectStates.size,
      totalConnections: this.connections.size,
      totalLocks: Array.from(this.projectLocks.values()).reduce((sum, locks) => sum + locks.size, 0)
    };
  }
}

export let collaborationManager: CollaborationManager;