import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Move, MoreVertical, Copy, Trash2, Edit3, Lock, Unlock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ComponentDefinition } from '@shared/schema';

interface FreeDragComponentProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onSelect: (component: ComponentDefinition | null) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onUpdate?: (component: ComponentDefinition) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (component: ComponentDefinition) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export default function FreeDragComponent({
  component,
  isSelected,
  onSelect,
  onMove,
  onUpdate,
  onDelete,
  onDuplicate,
  containerRef
}: FreeDragComponentProps) {
  const isMobile = useIsMobile();
  const componentRef = useRef<HTMLDivElement>(null);
  
  // États pour le drag tactile
  const [isDragActive, setIsDragActive] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);
  
  // Configuration du drag React DnD
  const [{ isDragging }, dragRef] = useDrag({
    type: 'EXISTING_COMPONENT',
    item: { id: component.id, type: 'EXISTING_COMPONENT', isExisting: true },
    canDrag: !isLocked && !isMobile,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Gestion du drag tactile manuel
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isLocked) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const rect = componentRef.current?.getBoundingClientRect();
    
    if (rect) {
      setDragStartPos({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
      
      setInitialPos({
        x: component.position?.x || 0,
        y: component.position?.y || 0
      });
      
      setIsDragActive(true);
      onSelect(component);
    }
  }, [component, isLocked, onSelect]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragActive || isLocked) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const containerRect = containerRef?.current?.getBoundingClientRect();
    
    if (containerRect && componentRef.current) {
      const componentWidth = componentRef.current.offsetWidth;
      const componentHeight = componentRef.current.offsetHeight;
      
      const newX = Math.max(0, Math.min(
        containerRect.width - componentWidth,
        touch.clientX - containerRect.left - dragStartPos.x
      ));
      const newY = Math.max(0, Math.min(
        containerRect.height - componentHeight,
        touch.clientY - containerRect.top - dragStartPos.y
      ));
      
      // Mise à jour immédiate de la position
      onMove(component.id, { x: newX, y: newY });
    }
  }, [isDragActive, dragStartPos, component.id, onMove, containerRef, isLocked]);

  const handleTouchEnd = useCallback(() => {
    setIsDragActive(false);
  }, []);

  // Gestion du clic pour sélection
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component);
  }, [component, onSelect]);

  // Verrouillage du composant
  const toggleLock = useCallback(() => {
    setIsLocked(!isLocked);
    if (onUpdate) {
      onUpdate({
        ...component,
        attributes: {
          ...component.attributes,
          locked: !isLocked
        }
      });
    }
  }, [isLocked, component, onUpdate]);

  // Duplication
  const handleDuplicate = useCallback(() => {
    if (onDuplicate) {
      onDuplicate(component);
    }
  }, [component, onDuplicate]);

  // Suppression
  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(component.id);
    }
  }, [component.id, onDelete]);

  // Rendu du contenu du composant
  const renderComponentContent = () => {
    const content = component.content || 'Nouveau composant';
    const styles = {
      ...component.styles,
      pointerEvents: (isDragActive ? 'none' : 'auto') as React.CSSProperties['pointerEvents']
    };
    
    switch (component.type) {
      case 'heading':
        const level = component.attributes?.level || 'h2';
        const HeadingTag = level as keyof JSX.IntrinsicElements;
        return <HeadingTag className="font-bold" style={styles}>{content}</HeadingTag>;
        
      case 'paragraph':
        return <p style={styles}>{content}</p>;
        
      case 'button':
        return (
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" 
            style={styles}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {content}
          </button>
        );
        
      case 'image':
        const imageSrc = component.attributes?.src || component.styles?.backgroundImage;
        return imageSrc ? (
          <img
            src={imageSrc.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1')}
            alt={component.attributes?.alt || "Component image"}
            className="max-w-full h-auto object-cover rounded"
            style={styles}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div 
            className="bg-gray-200 flex items-center justify-center rounded border-2 border-dashed border-gray-300" 
            style={styles}
          >
            🖼️ Image
          </div>
        );
        
      case 'container':
        return (
          <div 
            className="border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center rounded" 
            style={styles}
          >
            📦 Container
          </div>
        );
        
      case 'card':
        return (
          <div 
            className="p-4 border rounded-lg shadow-sm bg-white" 
            style={styles}
          >
            {content}
          </div>
        );
        
      default:
        return <div style={styles}>{content}</div>;
    }
  };

  return (
    <div
      ref={(el) => {
        if (componentRef.current !== el) {
          (componentRef as any).current = el;
        }
        if (!isMobile) dragRef(el);
      }}
      className={`absolute select-none transition-all duration-200 ${
        isDragging || isDragActive ? 'z-50 scale-105 shadow-xl' : 'z-auto'
      } ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${
        isLocked ? 'opacity-75' : 'hover:shadow-md'
      } ${
        isMobile ? 'touch-none' : ''
      }`}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        width: component.position?.width || component.styles?.width || 'auto',
        height: component.position?.height || component.styles?.height || 'auto',
        transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
        cursor: isLocked ? 'default' : (isMobile ? 'grab' : 'move'),
        touchAction: 'none'
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Contenu du composant */}
      <div className="w-full h-full">
        {renderComponentContent()}
      </div>

      {/* Contrôles de sélection */}
      {isSelected && (
        <>
          {/* Poignées de sélection */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>

          {/* Barre d'outils flottante */}
          <div className="absolute -top-12 left-0 flex items-center gap-1 bg-white rounded-lg shadow-lg border px-2 py-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={toggleLock}
              title={isLocked ? "Déverrouiller" : "Verrouiller"}
            >
              {isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            </Button>
            
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                title="Déplacer"
              >
                <Move className="w-3 h-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDuplicate}
              title="Dupliquer"
            >
              <Copy className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
              onClick={handleDelete}
              title="Supprimer"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </>
      )}

      {/* Indicateur de verrouillage */}
      {isLocked && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
          <Lock className="w-2 h-2 text-white" />
        </div>
      )}

      {/* Indicateur de drag tactile */}
      {isMobile && isDragActive && (
        <div className="absolute inset-0 bg-blue-500/20 rounded border-2 border-blue-500 border-dashed pointer-events-none">
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Déplacement...
          </div>
        </div>
      )}
    </div>
  );
}