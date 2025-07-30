import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ComponentDefinition } from '@shared/schema';

interface ResizableComponentProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onUpdate: (component: ComponentDefinition) => void;
  onSelect: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
  showGuides?: boolean;
}

export default function ResizableComponent({
  component,
  isSelected,
  onUpdate,
  onSelect,
  onDelete,
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

  // Obtenir les dimensions et position actuelles avec gestion des valeurs auto
  const parseValue = (value: string | undefined, defaultValue: number) => {
    if (!value || value === 'auto' || value === 'undefined' || value === 'NaN' || value.trim() === '') {
      return defaultValue;
    }
    const parsed = parseInt(value.replace(/px|%|em|rem|pt|vh|vw/g, ''));
    return isNaN(parsed) || parsed < 0 ? defaultValue : parsed;
  };

  const currentLeft = parseValue(component.styles?.left, 0);
  const currentTop = parseValue(component.styles?.top, 0);
  const currentWidth = parseValue(component.styles?.width, 100);
  const currentHeight = parseValue(component.styles?.height, 50);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.component-content')) {
      e.preventDefault();
      e.stopPropagation();

      onSelect();

      if (!isSelected) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        // Calculer l'offset relatif au conteneur parent
        const relativeX = e.clientX - containerRect.left;
        const relativeY = e.clientY - containerRect.top;
        const componentX = currentLeft;
        const componentY = currentTop;
        
        setIsDragging(true);
        setDragStart({
          x: relativeX - componentX,
          y: relativeY - componentY
        });
      }
    }
  }, [isSelected, onSelect, currentLeft, currentTop]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.component-content')) {
      e.stopPropagation();

      onSelect();

      if (!isSelected) return;

      const touch = e.touches[0];
      const rect = elementRef.current?.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (rect && touch && containerRect) {
        // Calculer l'offset relatif au conteneur parent
        const relativeX = touch.clientX - containerRect.left;
        const relativeY = touch.clientY - containerRect.top;
        const componentX = currentLeft;
        const componentY = currentTop;
        
        setIsDragging(true);
        setDragStart({
          x: relativeX - componentX,
          y: relativeY - componentY
        });
      }
    }
  }, [isSelected, onSelect, currentLeft, currentTop]);

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startWidth = parseInt(component.styles?.width?.replace('px', '') || '100');
    const startHeight = parseInt(component.styles?.height?.replace('px', '') || '50');
    const startLeft = parseInt(component.styles?.left?.replace('px', '') || '0');
    const startTop = parseInt(component.styles?.top?.replace('px', '') || '0');

    const handleResize = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      switch (direction) {
        case 'se': // Bottom-right
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case 'sw': // Bottom-left
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          newLeft = startLeft + (startWidth - newWidth);
          break;
        case 'ne': // Top-right
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newTop = startTop + (startHeight - newHeight);
          break;
        case 'nw': // Top-left
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newLeft = startLeft + (startWidth - newWidth);
          newTop = startTop + (startHeight - newHeight);
          break;
        case 'n': // Top
          newHeight = Math.max(20, startHeight - deltaY);
          newTop = startTop + (startHeight - newHeight);
          break;
        case 's': // Bottom
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case 'w': // Left
          newWidth = Math.max(20, startWidth - deltaX);
          newLeft = startLeft + (startWidth - newWidth);
          break;
        case 'e': // Right
          newWidth = Math.max(20, startWidth + deltaX);
          break;
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
    };

    const handleResizeEnd = () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResize);
      document.removeEventListener('touchend', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
    document.addEventListener('touchmove', handleResize);
    document.addEventListener('touchend', handleResizeEnd);
  }, [component, onUpdate]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (isDragging && elementRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeft = Math.max(0, Math.min(
        clientX - containerRect.left - dragStart.x,
        containerRect.width - currentWidth
      ));
      const newTop = Math.max(0, Math.min(
        clientY - containerRect.top - dragStart.y,
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
      const deltaX = clientX - resizeStart.x;
      const deltaY = clientY - resizeStart.y;

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

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX, touch.clientY);
    }
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      document.body.style.cursor = isDragging ? 'move' : 'resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleTouchMove, handleMouseUp]);

  // Obtenir le conteneur parent pour les calculs de bounds
  useEffect(() => {
    if (elementRef.current) {
      const container = elementRef.current.closest('.visual-editor-container');
      if (container) {
        containerRef.current = container as HTMLDivElement;
      }
    }
  }, []);

  const componentStyle: React.CSSProperties = {
    // Appliquer d'abord les styles du composant
    ...component.styles,
    // Puis forcer les valeurs critiques pour le positionnement
    position: 'absolute',
    left: currentLeft + 'px',
    top: currentTop + 'px',
    width: currentWidth + 'px',
    height: currentHeight + 'px',
    minWidth: '20px',
    minHeight: '20px',
    zIndex: parseInt(component.styles?.zIndex || '1000'),
    cursor: isDragging ? 'grabbing' : 'grab',
    transform: isDragging ? 'scale(1.02)' : 'scale(1)',
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    touchAction: 'none',
    userSelect: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div
      ref={elementRef}
      className={`component-wrapper ${isSelected ? 'selected' : ''}`}
      style={componentStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={() => {
        setIsDragging(false);
        setIsResizing(false);
      }}
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

      {/* Resize handles */}
      {isSelected && showGuides && (
        <>
          {/* Corner handles */}
          <div 
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize resize-handle hover:bg-blue-600 transition-colors"
            style={{ top: '-8px', left: '-8px', zIndex: 1002 }}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            onTouchStart={(e) => handleResizeStart(e, 'nw')}
          />
          <div 
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize resize-handle hover:bg-blue-600 transition-colors"
            style={{ top: '-8px', right: '-8px', zIndex: 1002 }}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            onTouchStart={(e) => handleResizeStart(e, 'ne')}
          />
          <div 
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize resize-handle hover:bg-blue-600 transition-colors"
            style={{ bottom: '-8px', left: '-8px', zIndex: 1002 }}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            onTouchStart={(e) => handleResizeStart(e, 'sw')}
          />
          <div 
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize resize-handle hover:bg-blue-600 transition-colors"
            style={{ bottom: '-8px', right: '-8px', zIndex: 1002 }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            onTouchStart={(e) => handleResizeStart(e, 'se')}
          />

          {/* Edge handles */}
          <div 
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-n-resize resize-handle hover:bg-blue-600 transition-colors"
            style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)', zIndex: 1002 }}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            onTouchStart={(e) => handleResizeStart(e, 'n')}
          />
          <div 
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-s-resize resize-handle hover:bg-blue-600 transition-colors"
            style={{ bottom: '-8px', left: '50%', transform: 'translateX(-50%)', zIndex: 1002 }}
            onMouseDown={(e) => handleResizeStart(e, 's')}
            onTouchStart={(e) => handleResizeStart(e, 's')}
          />
          <div 
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-w-resize resize-handle hover:bg-blue-600 transition-colors"
            style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)', zIndex: 1002 }}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            onTouchStart={(e) => handleResizeStart(e, 'w')}
          />
          <div 
            className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-e-resize resize-handle hover:bg-blue-600 transition-colors"
            style={{ right: '-8px', top: '50%', transform: 'translateY(-50%)', zIndex: 1002 }}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            onTouchStart={(e) => handleResizeStart(e, 'e')}
          />
        </>
      )}

      <style jsx>{`
        .component-wrapper {
          transition: none;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .component-wrapper.selected {
          z-index: 1001;
        }
        .component-wrapper:hover {
          outline: 1px dashed #60a5fa;
        }

        /* Amélioration pour les écrans tactiles */
        @media (hover: none) and (pointer: coarse) {
          .component-wrapper {
            min-width: 44px;
            min-height: 44px;
          }

          .component-wrapper:active {
            transform: scale(1.02);
            transition: transform 0.1s ease;
          }
        }

        /* Poignées de redimensionnement plus grandes sur tactile */
        @media (hover: none) and (pointer: coarse) {
          .component-wrapper .resize-handle {
            width: 20px !important;
            height: 20px !important;
            border-width: 2px !important;
          }
        }
      `}</style>
    </div>
  );
}