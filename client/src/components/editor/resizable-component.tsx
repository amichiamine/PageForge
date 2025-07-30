
import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ComponentDefinition } from "@shared/schema";

interface ResizableComponentProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onUpdate: (component: ComponentDefinition) => void;
  children: React.ReactNode;
}

export default function ResizableComponent({ 
  component, 
  isSelected, 
  onUpdate, 
  children 
}: ResizableComponentProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const elementRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height
    });
  }, []);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    let newLeft = parseInt(component.styles?.left || '0');
    let newTop = parseInt(component.styles?.top || '0');

    // Handle different resize directions
    if (resizeDirection.includes('right')) {
      newWidth = Math.max(50, resizeStart.width + deltaX);
    }
    if (resizeDirection.includes('left')) {
      newWidth = Math.max(50, resizeStart.width - deltaX);
      newLeft = newLeft + deltaX;
    }
    if (resizeDirection.includes('bottom')) {
      newHeight = Math.max(30, resizeStart.height + deltaY);
    }
    if (resizeDirection.includes('top')) {
      newHeight = Math.max(30, resizeStart.height - deltaY);
      newTop = newTop + deltaY;
    }

    const updatedComponent = {
      ...component,
      styles: {
        ...component.styles,
        width: `${newWidth}px`,
        height: `${newHeight}px`,
        left: `${Math.max(0, newLeft)}px`,
        top: `${Math.max(0, newTop)}px`
      }
    };

    onUpdate(updatedComponent);
  }, [isResizing, resizeStart, resizeDirection, component, onUpdate]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection('');
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  if (!isSelected) {
    return <>{children}</>;
  }

  return (
    <div
      ref={elementRef}
      className={cn(
        "relative group",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
        isResizing && "z-50"
      )}
      style={{
        cursor: isResizing ? 'grabbing' : 'default'
      }}
    >
      {children}
      
      {/* Resize Handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize opacity-80 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
            title="Redimensionner (haut-gauche)"
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize opacity-80 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
            title="Redimensionner (haut-droite)"
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize opacity-80 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
            title="Redimensionner (bas-gauche)"
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize opacity-80 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
            title="Redimensionner (bas-droite)"
          />

          {/* Edge handles */}
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-n-resize opacity-80 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
            title="Redimensionner (haut)"
          />
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-s-resize opacity-80 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            title="Redimensionner (bas)"
          />
          <div
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-w-resize opacity-80 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            title="Redimensionner (gauche)"
          />
          <div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white cursor-e-resize opacity-80 hover:opacity-100"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
            title="Redimensionner (droite)"
          />

          {/* Position/Size Info Tooltip */}
          <div className="absolute -top-16 left-0 bg-black text-white text-xs px-2 py-1 rounded opacity-90 pointer-events-none whitespace-nowrap z-50">
            <div>Position: {component.styles?.left || '0'}, {component.styles?.top || '0'}</div>
            <div>Taille: {component.styles?.width || 'auto'} × {component.styles?.height || 'auto'}</div>
          </div>
        </>
      )}
    </div>
  );
}
