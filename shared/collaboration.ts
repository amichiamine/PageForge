import { z } from 'zod';

// Types pour la collaboration en temps réel
export const CollaborationEventSchema = z.object({
  type: z.enum([
    'user_join',
    'user_leave',
    'cursor_move',
    'component_select',
    'component_add',
    'component_update',
    'component_delete',
    'style_change',
    'content_change',
    'project_lock',
    'project_unlock'
  ]),
  projectId: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  timestamp: z.number(),
  data: z.any().optional()
});

export const UserPresenceSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  color: z.string(),
  cursor: z.object({
    x: z.number(),
    y: z.number()
  }).optional(),
  selectedComponent: z.string().optional(),
  isActive: z.boolean(),
  lastSeen: z.number()
});

export const ProjectLockSchema = z.object({
  componentId: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  lockedAt: z.number(),
  lockType: z.enum(['edit', 'style', 'content']),
  expiresAt: z.number()
});

export const CollaborationStateSchema = z.object({
  projectId: z.string(),
  users: z.array(UserPresenceSchema),
  locks: z.array(ProjectLockSchema),
  version: z.number(),
  lastUpdated: z.number()
});

export type CollaborationEvent = z.infer<typeof CollaborationEventSchema>;
export type UserPresence = z.infer<typeof UserPresenceSchema>;
export type ProjectLock = z.infer<typeof ProjectLockSchema>;
export type CollaborationState = z.infer<typeof CollaborationStateSchema>;

// Couleurs d'avatars pour les utilisateurs
export const USER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

// Configuration de collaboration
export const COLLABORATION_CONFIG = {
  CURSOR_UPDATE_THROTTLE: 100, // ms
  PRESENCE_UPDATE_INTERVAL: 5000, // ms
  LOCK_DURATION: 30000, // 30 secondes
  INACTIVE_THRESHOLD: 60000, // 1 minute
  MAX_USERS_PER_PROJECT: 10
};