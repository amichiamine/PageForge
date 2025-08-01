import React from 'react';
import { UserPresence } from '@shared/collaboration';
import { MousePointer2 } from 'lucide-react';

interface UserCursorsProps {
  users: UserPresence[];
  containerRef: React.RefObject<HTMLElement>;
}

export function UserCursors({ users, containerRef }: UserCursorsProps) {
  if (!containerRef.current) return null;

  return (
    <>
      {users.map((user) => {
        if (!user.cursor || !user.isActive) return null;

        return (
          <div
            key={user.sessionId}
            className="fixed pointer-events-none z-50 transition-all duration-100"
            style={{
              left: user.cursor.x,
              top: user.cursor.y,
              transform: 'translate(-2px, -2px)'
            }}
          >
            {/* Curseur */}
            <MousePointer2 
              className="w-5 h-5 drop-shadow-md" 
              style={{ color: user.color }}
              fill="currentColor"
            />
            
            {/* Nom de l'utilisateur */}
            <div 
              className="absolute top-6 left-2 px-2 py-1 text-xs text-white rounded shadow-lg whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        );
      })}
    </>
  );
}

interface ComponentHighlightProps {
  users: UserPresence[];
  selectedComponentId?: string;
}

export function ComponentHighlight({ users, selectedComponentId }: ComponentHighlightProps) {
  return (
    <>
      {users.map((user) => {
        if (!user.selectedComponent || !user.isActive) return null;

        const element = document.querySelector(`[data-component-id="${user.selectedComponent}"]`);
        if (!element) return null;

        const rect = element.getBoundingClientRect();

        return (
          <div
            key={`${user.sessionId}-${user.selectedComponent}`}
            className="fixed pointer-events-none z-40 border-2 rounded transition-all duration-200"
            style={{
              left: rect.left - 2,
              top: rect.top - 2,
              width: rect.width + 4,
              height: rect.height + 4,
              borderColor: user.color,
              backgroundColor: `${user.color}10`,
              boxShadow: `0 0 0 1px ${user.color}40`
            }}
          >
            {/* Badge utilisateur */}
            <div 
              className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded shadow-md whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name} édite
            </div>
          </div>
        );
      })}
    </>
  );
}