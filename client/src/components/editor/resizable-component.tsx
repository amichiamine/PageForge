
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
    let newLeft = parseInt(component.styles?.left?.replace('px', '') || '0');
    let newTop = parseInt(component.styles?.top?.replace('px', '') || '0');

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
    return <div ref={elementRef}>{children}</div>;
  }

  return (
    <div
      ref={elementRef}
      className={cn(
        "relative",
        isSelected && "ring-2 ring-blue-500 ring-offset-1 rounded-lg",
        isResizing && "z-50"
      )}
      style={{
        cursor: isResizing ? 'grabbing' : 'default'
      }}
    >
      {children}
      
      {/* Resize Handles - Positionnés correctement */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner handles */}
          <div
            className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize opacity-90 hover:opacity-100 pointer-events-auto shadow-md"
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
            title="Redimensionner (haut-gauche)"
          />
          <div
            className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize opacity-90 hover:opacity-100 pointer-events-auto shadow-md"
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
            title="Redimensionner (haut-droite)"
          />
          <div
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize opacity-90 hover:opacity-100 pointer-events-auto shadow-md"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
            title="Redimensionner (bas-gauche)"
          />
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize opacity-90 hover:opacity-100 pointer-events-auto shadow-md"
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
            title="Redimensionner (bas-droite)"
          />

          {/* Edge handles */}
          <div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-n-resize opacity-90 hover:opacity-100 pointer-events-auto shadow-md"
            onMouseDown={(e) => handleResizeStart(e, 'top')}
            title="Redimensionner (haut)"
          />
          <div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-s-resize opacity-90 hover:opacity-100 pointer-events-auto shadow-md"
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            title="Redimensionner (bas)"
          />
          <div
            className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-w-resize opacity-90 hover:opacity-100 pointer-events-auto shadow-md"
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            title="Redimensionner (gauche)"
          />
          <div
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-e-resize opacity-90 hover:opacity-100 pointer-events-auto shadow-md"
            onMouseDown={(e) => handleResizeStart(e, 'right')}
            title="Redimensionner (droite)"
          />

          {/* Position/Size Info Tooltip avec style amélioré */}
          <div className="absolute -top-20 left-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-95 pointer-events-none whitespace-nowrap z-50 border border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-blue-300">Position:</span>
              <span>{component.styles?.left || '0'}, {component.styles?.top || '0'}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-green-300">Taille:</span>
              <span>{component.styles?.width || 'auto'} × {component.styles?.height || 'auto'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
