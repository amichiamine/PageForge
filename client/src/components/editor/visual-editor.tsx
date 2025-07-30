import React, { useState, useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trash2, Move, Copy } from "lucide-react";
import type { Project, ComponentDefinition } from "@shared/schema";
import { createComponent } from "@/lib/editor-utils";

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

interface DroppableComponentProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onSelect: (component: ComponentDefinition) => void;
  onUpdate: (component: ComponentDefinition) => void;
  onDelete: (componentId: string) => void;
  depth: number;
}

function DroppableComponent({ 
  component, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete,
  depth 
}: DroppableComponentProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { type: "component", component },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ["component", "palette-item"],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;
      
      if (item.fromPalette && item.type) {
        // Add new component from palette
        const newComponent = createComponent(item.type);
        
        const updatedComponent = {
          ...component,
          children: [...(component.children || []), newComponent]
        };
        onUpdate(updatedComponent);
      } else if (item.component && item.component.id !== component.id) {
        // Move existing component
        const updatedComponent = {
          ...component,
          children: [...(component.children || []), item.component]
        };
        onUpdate(updatedComponent);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  drag(drop(ref));

  const renderComponent = () => {
    const baseStyle: React.CSSProperties = {
      ...component.styles,
      opacity: isDragging ? 0.5 : 1,
      position: 'relative',
      border: isSelected ? '2px solid #007bff' : isOver ? '2px dashed #007bff' : '1px solid transparent',
      borderRadius: '4px',
      padding: component.styles?.padding || '8px',
      margin: '4px 0'
    };

    const attributes = component.attributes || {};
    const { className, ...otherAttributes } = attributes;

    const renderSpecializedComponent = () => {
      switch (component.type) {
        case 'image':
          return (
            <div style={baseStyle} className={cn("group hover:outline-2 hover:outline-blue-400 hover:outline-dashed cursor-pointer", className)}>
              {attributes.src ? (
                <img 
                  src={attributes.src} 
                  alt={attributes.alt || 'Image'} 
                  style={{
                    width: component.styles?.width || '100%',
                    height: component.styles?.height || 'auto',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  {...otherAttributes}
                />
              ) : (
                <div 
                  style={{
                    width: component.styles?.width || '200px',
                    height: component.styles?.height || '150px',
                    backgroundColor: '#f5f5f5',
                    border: '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: '#666'
                  }}
                >
                  Cliquez pour ajouter une image
                </div>
              )}
            </div>
          );

        case 'carousel':
          const activeSlideIndex = 0; // Pour l'éditeur, montrer toujours le premier slide
          const slides = component.children?.filter(child => child.type === 'carousel-item') || [];
          
          return (
            <div style={baseStyle} className={cn("group hover:outline-2 hover:outline-blue-400 hover:outline-dashed cursor-pointer carousel", className)}>
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                {slides.length > 0 ? (
                  slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      style={{
                        ...slide.styles,
                        display: index === activeSlideIndex ? 'block' : 'none',
                        minHeight: '200px'
                      }}
                      className={slide.attributes?.className}
                    >
                      {slide.content && <span dangerouslySetInnerHTML={{ __html: slide.content }} />}
                    </div>
                  ))
                ) : (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f5f5f5',
                    border: '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    Carrousel vide - Ajoutez des slides via le panneau de propriétés
                  </div>
                )}
                
                {/* Carousel indicators */}
                {slides.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '5px'
                  }}>
                    {slides.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: index === activeSlideIndex ? '#007bff' : '#ccc'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );

        case 'button':
          const Tag = component.tag as keyof JSX.IntrinsicElements || 'button';
          return (
            <Tag 
              style={baseStyle} 
              className={cn("group hover:outline-2 hover:outline-blue-400 hover:outline-dashed cursor-pointer", className)}
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
              className={cn("group hover:outline-2 hover:outline-blue-400 hover:outline-dashed cursor-pointer", className)}
              {...otherAttributes}
              onClick={(e) => e.preventDefault()} // Prevent navigation in editor
            >
              {component.content || 'Lien'}
            </a>
          );

        default:
          const DefaultTag = component.tag as keyof JSX.IntrinsicElements || 'div';
          return (
            <DefaultTag 
              style={baseStyle} 
              className={cn("group hover:outline-2 hover:outline-blue-400 hover:outline-dashed cursor-pointer", className)}
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
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(component);
        }}
      >
        {/* Component controls */}
        {isSelected && (
          <div className="absolute -top-8 left-0 flex gap-1 bg-blue-500 text-white text-xs rounded px-2 py-1 z-10">
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

        {/* Render specialized component */}
        {renderSpecializedComponent()}

        {/* Render children for container components */}
        {component.children && component.children.length > 0 && component.type !== 'carousel' && (
          <div className="pl-4 space-y-2">
            {component.children.map((child) => (
              <DroppableComponent
                key={child.id}
                component={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                depth={depth + 1}
              />
            ))}
          </div>
        )}

        {/* Drop indicator */}
        {isOver && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 border-2 border-dashed border-blue-400 rounded" />
        )}
      </div>
    );
  };

  return renderComponent();
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
        
        // Create new component
        const newComponent = createComponent(item.type);
        console.log("Created component:", newComponent);
        
        // Add to page structure
        const updatedStructure = [...pageStructure, newComponent];
        console.log("Updated structure:", updatedStructure);
        
        // Ensure we have a page to work with
        const pages = project.content?.pages || [];
        let updatedPages;
        
        if (pages.length === 0) {
          // Create a new page if none exists
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
          // Update existing page
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
        if (comp.children) {
          return { ...comp, children: updateInStructure(comp.children) };
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
      return components.filter(comp => comp.id !== componentId)
        .map(comp => ({
          ...comp,
          children: comp.children ? removeFromStructure(comp.children) : []
        }));
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
        "w-full min-h-96 bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors",
        isOver && "border-primary bg-primary/5"
      )}
    >
      {pageStructure.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">Zone d'édition vide</p>
            <p className="text-sm">Glissez des composants depuis la palette pour commencer</p>
            <p className="text-xs mt-2">Projet: {project.name}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {pageStructure.map((component) => (
            <DroppableComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onSelect={onComponentSelect}
              onUpdate={handleComponentUpdate}
              onDelete={handleComponentDelete}
              depth={0}
            />
          ))}
        </div>
      )}
      
      {/* Debug info */}
      {showCode && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <strong>Debug:</strong> {pageStructure.length} composants chargés
          <br />
          Page: {currentPage?.name || 'Aucune page'}
          <br />
          Projet: {project.name}
        </div>
      )}
    </div>
  );
}