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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (action === 'drag') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    } else if (action === 'resize') {
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const parentRect = elementRef.current?.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const newLeft = e.clientX - parentRect.left - dragStart.x;
      const newTop = e.clientY - parentRect.top - dragStart.y;

      const updatedComponent = {
        ...component,
        styles: {
          ...component.styles,
          position: component.styles?.position || 'absolute',
          left: `${Math.max(0, newLeft)}px`,
          top: `${Math.max(0, newTop)}px`
        }
      };

      onUpdate(updatedComponent);
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(50, resizeStart.width + deltaX);
      const newHeight = Math.max(30, resizeStart.height + deltaY);

      const updatedComponent = {
        ...component,
        styles: {
          ...component.styles,
          width: `${newWidth}px`,
          height: `${newHeight}px`
        }
      };

      onUpdate(updatedComponent);
    }
  }, [isDragging, isResizing, dragStart, resizeStart, component, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "relative group",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
        (isDragging || isResizing) && "z-50"
      )}
      style={{
        ...component.styles,
        cursor: isDragging ? 'grabbing' : isSelected ? 'grab' : 'default'
      }}
    >
      {children}
      
      {/* Drag Handle */}
      {isSelected && (
        <>
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
            title="Déplacer le composant"
          />
          
          {/* Resize Handle */}
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={(e) => handleMouseDown(e, 'resize')}
            title="Redimensionner le composant"
          />

          {/* Alignment Guides */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical center line */}
            <div 
              className="absolute w-px bg-blue-300 opacity-30" 
              style={{ 
                left: '50%', 
                top: 0, 
                height: '100%',
                transform: 'translateX(-50%)'
              }} 
            />
            {/* Horizontal center line */}
            <div 
              className="absolute h-px bg-blue-300 opacity-30" 
              style={{ 
                top: '50%', 
                left: 0, 
                width: '100%',
                transform: 'translateY(-50%)'
              }} 
            />
          </div>

          {/* Position Info Tooltip */}
          <div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {component.styles?.position || 'static'}: 
            {component.styles?.left && ` left: ${component.styles.left}`}
            {component.styles?.top && ` top: ${component.styles.top}`}
            {component.styles?.width && ` w: ${component.styles.width}`}
            {component.styles?.height && ` h: ${component.styles.height}`}
          </div>
        </>
      )}
    </div>
  );
}