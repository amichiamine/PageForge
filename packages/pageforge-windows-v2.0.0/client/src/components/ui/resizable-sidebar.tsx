import React from 'react';
import { ResizablePanel } from '@/components/ui/resizable-panel';
import { cn } from '@/lib/utils';

interface ResizableSidebarProps {
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  storageKey: string;
  direction?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  title?: string;
  collapsible?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ResizableSidebar({
  children,
  defaultWidth = 256,
  minWidth = 200,
  maxWidth = 400,
  storageKey,
  direction = 'right',
  className,
  disabled = false,
  title,
  collapsible = false,
  isCollapsed = false,
  onToggleCollapse
}: ResizableSidebarProps) {
  if (isCollapsed) {
    return (
      <div 
        className={cn(
          'w-12 flex-shrink-0 bg-white border-gray-200 flex flex-col items-center py-2',
          direction === 'left' ? 'border-r' : 'border-l',
          className
        )}
      >
        {collapsible && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={`Ouvrir ${title || 'le panneau'}`}
          >
            <div className="w-4 h-4 border-2 border-gray-400 rounded" />
          </button>
        )}
      </div>
    );
  }

  return (
    <ResizablePanel
      defaultWidth={defaultWidth}
      minWidth={minWidth}
      maxWidth={maxWidth}
      storageKey={storageKey}
      direction={direction}
      className={cn('flex-shrink-0', className)}
      disabled={disabled}
      title={title}
      showResetButton={false}
    >
      {children}
    </ResizablePanel>
  );
}

export default ResizableSidebar;