
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ComponentDefinition } from '@shared/schema';

interface ResizableComponentProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onUpdate: (component: ComponentDefinition) => void;
  onSelect: () => void;
  children: React.ReactNode;
  showGuides?: boolean;
}

export default function ResizableComponent({
  component,
  isSelected,
  onUpdate,
  onSelect,
  children,
  showGuides = false
}: ResizableComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const elementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Obtenir les dimensions et position actuelles
  const currentLeft = parseInt(component.styles?.left?.replace('px', '') || '0');
  const currentTop = parseInt(component.styles?.top?.replace('px', '') || '0');
  const currentWidth = parseInt(component.styles?.width?.replace('px', '') || '100');
  const currentHeight = parseInt(component.styles?.height?.replace('px', '') || '50');

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.component-content')) {
      e.preventDefault();
      e.stopPropagation();
      
      onSelect();
      
      if (!isSelected) return;
      
      const rect = elementRef.current?.getBoundingClientRect();
      if (rect) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  }, [isSelected, onSelect]);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: currentWidth,
      height: currentHeight
    });
  }, [currentWidth, currentHeight]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && elementRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeft = Math.max(0, Math.min(
        e.clientX - containerRect.left - dragStart.x,
        containerRect.width - currentWidth
      ));
      const newTop = Math.max(0, Math.min(
        e.clientY - containerRect.top - dragStart.y,
        containerRect.height - currentHeight
      ));

      const updatedComponent = {
        ...component,
        styles: {
          ...component.styles,
          left: `${Math.round(newLeft)}px`,
          top: `${Math.round(newTop)}px`
        }
      };

      onUpdate(updatedComponent);
    }

    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newLeft = currentLeft;
      let newTop = currentTop;

      switch (resizeDirection) {
        case 'bottom-right':
          newWidth = Math.max(20, resizeStart.width + deltaX);
          newHeight = Math.max(20, resizeStart.height + deltaY);
          break;
        case 'bottom-left':
          newWidth = Math.max(20, resizeStart.width - deltaX);
          newHeight = Math.max(20, resizeStart.height + deltaY);
          newLeft = currentLeft + (resizeStart.width - newWidth);
          break;
        case 'top-right':
          newWidth = Math.max(20, resizeStart.width + deltaX);
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newTop = currentTop + (resizeStart.height - newHeight);
          break;
        case 'top-left':
          newWidth = Math.max(20, resizeStart.width - deltaX);
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newLeft = currentLeft + (resizeStart.width - newWidth);
          newTop = currentTop + (resizeStart.height - newHeight);
          break;
        case 'right':
          newWidth = Math.max(20, resizeStart.width + deltaX);
          break;
        case 'left':
          newWidth = Math.max(20, resizeStart.width - deltaX);
          newLeft = currentLeft + (resizeStart.width - newWidth);
          break;
        case 'bottom':
          newHeight = Math.max(20, resizeStart.height + deltaY);
          break;
        case 'top':
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newTop = currentTop + (resizeStart.height - newHeight);
          break;
      }

      const updatedComponent = {
        ...component,
        styles: {
          ...component.styles,
          left: `${Math.round(newLeft)}px`,
          top: `${Math.round(newTop)}px`,
          width: `${Math.round(newWidth)}px`,
          height: `${Math.round(newHeight)}px`
        }
      };

      onUpdate(updatedComponent);
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeDirection, component, currentLeft, currentTop, currentWidth, currentHeight, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'move' : 'resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // Obtenir le conteneur parent pour les calculs de bounds
  useEffect(() => {
    if (elementRef.current) {
      const container = elementRef.current.closest('.visual-editor-container');
      if (container) {
        containerRef.current = container as HTMLDivElement;
      }
    }
  }, []);

  const componentStyle = {
    position: 'absolute' as const,
    left: `${currentLeft}px`,
    top: `${currentTop}px`,
    width: `${currentWidth}px`,
    height: `${currentHeight}px`,
    minWidth: '20px',
    minHeight: '20px',
    ...component.styles,
    cursor: isDragging ? 'move' : 'pointer',
    zIndex: isSelected ? 1001 : (component.styles?.zIndex || 1000),
  };

  return (
    <div
      ref={elementRef}
      className={`component-wrapper ${isSelected ? 'selected' : ''}`}
      style={componentStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Contenu du composant */}
      <div className="component-content h-full w-full">
        {children}
      </div>

      {/* Guides d'alignement si activés */}
      {showGuides && isSelected && (
        <>
          <div 
            className="absolute border-l border-blue-400 border-dashed opacity-50"
            style={{ 
              left: 0, 
              top: -9999, 
              height: 19998,
              pointerEvents: 'none'
            }} 
          />
          <div 
            className="absolute border-t border-blue-400 border-dashed opacity-50"
            style={{ 
              top: 0, 
              left: -9999, 
              width: 19998,
              pointerEvents: 'none'
            }} 
          />
        </>
      )}

      {/* Indicateur de sélection */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none rounded-sm">
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded text-nowrap">
            {component.type} ({currentWidth}×{currentHeight})
          </div>
        </div>
      )}

      {/* Poignées de redimensionnement */}
      {isSelected && (
        <>
          {/* Coins */}
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize hover:bg-blue-600 shadow-sm"
            style={{ top: '-6px', left: '-6px' }}
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize hover:bg-blue-600 shadow-sm"
            style={{ top: '-6px', right: '-6px' }}
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize hover:bg-blue-600 shadow-sm"
            style={{ bottom: '-6px', left: '-6px' }}
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize hover:bg-blue-600 shadow-sm"
            style={{ bottom: '-6px', right: '-6px' }}
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          />

          {/* Côtés */}
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize hover:bg-blue-600 shadow-sm"
            style={{ top: '-6px', left: '50%', transform: 'translateX(-50%)' }}
            onMouseDown={(e) => handleResizeStart(e, 'top')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize hover:bg-blue-600 shadow-sm"
            style={{ bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }}
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize hover:bg-blue-600 shadow-sm"
            style={{ left: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize hover:bg-blue-600 shadow-sm"
            style={{ right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />
        </>
      )}

      <style jsx>{`
        .component-wrapper {
          transition: none;
        }
        .component-wrapper.selected {
          z-index: 1001;
        }
        .component-wrapper:hover {
          outline: 1px dashed #60a5fa;
        }
      `}</style>
    </div>
  );
}
