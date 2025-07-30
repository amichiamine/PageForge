
import React, { useState, useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trash2, Move, Copy } from "lucide-react";
import type { Project, ComponentDefinition } from "@shared/schema";
import { createComponent } from "@/lib/editor-utils";
import ResizableComponent from "./resizable-component";

interface VisualEditorProps {
  project: Project;
  selectedComponent: ComponentDefinition | null;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentUpdate: (project: Project) => void;
  showCode: boolean;
}

interface DragItem {
  type: string;
  component?: ComponentDefinition;
  fromPalette?: boolean;
}

interface FreePositionComponentProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onSelect: (component: ComponentDefinition) => void;
  onUpdate: (component: ComponentDefinition) => void;
  onDelete: (componentId: string) => void;
}

function FreePositionComponent({ 
  component, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete
}: FreePositionComponentProps): JSX.Element {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !e.currentTarget.contains(e.target as Node)) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = elementRef.current?.getBoundingClientRect();
    const containerRect = elementRef.current?.parentElement?.getBoundingClientRect();
    
    if (!rect || !containerRect) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    onSelect(component);
  }, [component, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const containerRect = elementRef.current?.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const newLeft = Math.max(0, e.clientX - containerRect.left - dragOffset.x);
    const newTop = Math.max(0, e.clientY - containerRect.top - dragOffset.y);

    const updatedComponent = {
      ...component,
      styles: {
        ...component.styles,
        position: 'absolute',
        left: `${newLeft}px`,
        top: `${newTop}px`,
        zIndex: isSelected ? '1000' : (component.styles?.zIndex || '1')
      }
    };

    onUpdate(updatedComponent);
  }, [isDragging, dragOffset, component, onUpdate, isSelected]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const renderComponentContent = () => {
    const baseStyle: React.CSSProperties = {
      ...component.styles,
      position: 'absolute',
      left: component.styles?.left || '0px',
      top: component.styles?.top || '0px',
      width: component.styles?.width || 'auto',
      height: component.styles?.height || 'auto',
      minWidth: '50px',
      minHeight: '30px',
      border: isSelected ? '2px solid #007bff' : '1px solid transparent',
      borderRadius: component.styles?.borderRadius || '4px',
      padding: component.styles?.padding || '8px',
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
      zIndex: isSelected ? 1000 : (component.styles?.zIndex || 1)
    };

    const attributes = component.attributes || {};
    const { className, ...otherAttributes } = attributes;

    switch (component.type) {
      case 'image':
        return (
          <div style={baseStyle} className={cn("component-wrapper", className)}>
            {attributes.src ? (
              <img 
                src={attributes.src} 
                alt={attributes.alt || 'Image'} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none'
                }}
                {...otherAttributes}
              />
            ) : (
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#f5f5f5',
                  border: '2px dashed #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#666'
                }}
              >
                Image
              </div>
            )}
          </div>
        );

      case 'button':
        const Tag = component.tag as keyof JSX.IntrinsicElements || 'button';
        return (
          <Tag 
            style={baseStyle} 
            className={cn("component-wrapper", className)}
            {...otherAttributes}
          >
            {component.content || 'Bouton'}
          </Tag>
        );

      case 'link':
        return (
          <a 
            href={attributes.href || '#'} 
            target={attributes.target || '_self'}
            style={baseStyle} 
            className={cn("component-wrapper", className)}
            {...otherAttributes}
            onClick={(e) => e.preventDefault()}
          >
            {component.content || 'Lien'}
          </a>
        );

      default:
        const DefaultTag = component.tag as keyof JSX.IntrinsicElements || 'div';
        return (
          <DefaultTag 
            style={baseStyle} 
            className={cn("component-wrapper", className)}
            {...otherAttributes}
          >
            {component.content && (
              <span dangerouslySetInnerHTML={{ __html: component.content }} />
            )}
          </DefaultTag>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {/* Component controls */}
      {isSelected && (
        <div 
          className="absolute -top-8 left-0 flex gap-1 bg-blue-500 text-white text-xs rounded px-2 py-1 z-50"
          style={{ pointerEvents: 'all' }}
        >
          <span>{component.type}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-4 w-4 p-0 text-white hover:text-red-300"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Render component with ResizableComponent wrapper if selected */}
      {isSelected ? (
        <ResizableComponent
          component={component}
          isSelected={isSelected}
          onUpdate={onUpdate}
        >
          {renderComponentContent()}
        </ResizableComponent>
      ) : (
        renderComponentContent()
      )}
    </div>
  );
}

export default function VisualEditor({ 
  project, 
  selectedComponent, 
  onComponentSelect, 
  onComponentUpdate,
  showCode 
}: VisualEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = project.content?.pages?.[0];
  const pageStructure = currentPage?.content?.structure || [];

  const [{ isOver }, drop] = useDrop({
    accept: ["palette-item"],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;

      if (item.fromPalette && item.type) {
        console.log("Dropping component on canvas:", item.type);
        
        const dropOffset = monitor.getDropResult()?.dropOffset || monitor.getClientOffset();
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        let dropX = 50; // Position par défaut
        let dropY = 50;
        
        if (dropOffset && containerRect) {
          dropX = Math.max(0, dropOffset.x - containerRect.left - 50);
          dropY = Math.max(0, dropOffset.y - containerRect.top - 50);
        }
        
        // Create new component with absolute positioning
        const newComponent = {
          ...createComponent(item.type),
          styles: {
            ...createComponent(item.type).styles,
            position: 'absolute',
            left: `${dropX}px`,
            top: `${dropY}px`,
            zIndex: '1'
          }
        };
        
        console.log("Created component:", newComponent);
        
        // Add to page structure
        const updatedStructure = [...pageStructure, newComponent];
        console.log("Updated structure:", updatedStructure);
        
        // Ensure we have a page to work with
        const pages = project.content?.pages || [];
        let updatedPages;
        
        if (pages.length === 0) {
          updatedPages = [{
            id: 'default-page',
            name: 'index',
            path: '/',
            content: {
              structure: updatedStructure,
              styles: '',
              scripts: '',
              meta: {
                title: project.name,
                description: project.description || ''
              }
            }
          }];
        } else {
          updatedPages = pages.map((page, index) => 
            index === 0 ? {
              ...page,
              content: {
                ...page.content,
                structure: updatedStructure
              }
            } : page
          );
        }
        
        const updatedProject = {
          ...project,
          content: {
            ...project.content,
            pages: updatedPages
          }
        };
        
        console.log("Calling onComponentUpdate with updated project:", updatedProject);
        onComponentUpdate(updatedProject);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  drop(containerRef);

  const handleComponentUpdate = useCallback((updatedComponent: ComponentDefinition) => {
    console.log("Updating component:", updatedComponent);
    
    const updateInStructure = (components: ComponentDefinition[]): ComponentDefinition[] => {
      return components.map(comp => {
        if (comp.id === updatedComponent.id) {
          return updatedComponent;
        }
        return comp;
      });
    };

    const updatedStructure = updateInStructure(pageStructure);
    
    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: project.content?.pages?.map((page, index) => 
          index === 0 ? {
            ...page,
            content: {
              ...page.content,
              structure: updatedStructure
            }
          } : page
        ) || []
      }
    };

    onComponentUpdate(updatedProject);
  }, [project, pageStructure, onComponentUpdate]);

  const handleComponentDelete = useCallback((componentId: string) => {
    console.log("Deleting component:", componentId);
    
    const removeFromStructure = (components: ComponentDefinition[]): ComponentDefinition[] => {
      return components.filter(comp => comp.id !== componentId);
    };

    const updatedStructure = removeFromStructure(pageStructure);
    
    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: project.content?.pages?.map((page, index) => 
          index === 0 ? {
            ...page,
            content: {
              ...page.content,
              structure: updatedStructure
            }
          } : page
        ) || []
      }
    };
    
    // Clear selection if deleted component was selected
    if (selectedComponent?.id === componentId) {
      onComponentSelect(null);
    }

    onComponentUpdate(updatedProject);
  }, [project, pageStructure, selectedComponent, onComponentSelect, onComponentUpdate]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full min-h-96 bg-white border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden",
        "transition-colors",
        isOver && "border-primary bg-primary/5"
      )}
      style={{ 
        minHeight: '600px',
        position: 'relative'
      }}
      onClick={(e) => {
        // Déselectionner si on clique sur la zone vide
        if (e.target === e.currentTarget) {
          onComponentSelect(null);
        }
      }}
    >
      {pageStructure.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
          <div className="text-center">
            <p className="text-lg mb-2">Zone d'édition libre</p>
            <p className="text-sm">Glissez des composants depuis la palette</p>
            <p className="text-xs mt-2">Les composants seront positionnables librement</p>
            <p className="text-xs mt-1">Projet: {project.name}</p>
          </div>
        </div>
      ) : (
        <>
          {pageStructure.map((component) => (
            <FreePositionComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onSelect={onComponentSelect}
              onUpdate={handleComponentUpdate}
              onDelete={handleComponentDelete}
            />
          ))}
        </>
      )}
      
      {/* Debug info */}
      {showCode && (
        <div className="absolute bottom-2 left-2 p-2 bg-gray-100 rounded text-xs z-50">
          <strong>Debug:</strong> {pageStructure.length} composants
          <br />
          Page: {currentPage?.name || 'Aucune page'}
          <br />
          Sélectionné: {selectedComponent?.type || 'Aucun'}
        </div>
      )}
    </div>
  );
}
