import React, { useCallback, useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import ResizableComponent from './resizable-component';
import type { Project, ComponentDefinition } from '@shared/schema';
import { randomId } from '@/lib/editor-utils';

interface VisualEditorProps {
  project: Project;
  selectedComponent: ComponentDefinition | null;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentUpdate: (project: Project) => void;
  showCode?: boolean;
}

export default function VisualEditor({
  project,
  selectedComponent,
  onComponentSelect,
  onComponentUpdate,
  showCode = false
}: VisualEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; type: string } | null>(null);

  const currentPage = project.content?.pages?.[0];
  const pageStructure = currentPage?.content?.structure || [];

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'component',
    hover: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (offset && containerRect) {
        setDragPreview({
          x: offset.x - containerRect.left,
          y: offset.y - containerRect.top,
          type: item.type
        });
      }
    },
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (offset && containerRect) {
        const x = Math.max(0, offset.x - containerRect.left - 50);
        const y = Math.max(0, offset.y - containerRect.top - 25);

        handleAddComponent(item, x, y);
      }

      setDragPreview(null);
      return { moved: true };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleAddComponent = useCallback((componentType: any, x: number, y: number) => {
    const newComponent: ComponentDefinition = {
      id: randomId(),
      type: componentType.type,
      tag: getDefaultTag(componentType.type),
      content: getDefaultContent(componentType.type),
      styles: {
        position: 'absolute',
        top: `${Math.round(y)}px`,
        left: `${Math.round(x)}px`,
        width: getDefaultWidth(componentType.type),
        height: getDefaultHeight(componentType.type),
        zIndex: '1000',
        margin: '0',
        padding: getDefaultPadding(componentType.type),
        backgroundColor: getDefaultBackgroundColor(componentType.type),
        color: getDefaultColor(componentType.type),
        fontSize: getDefaultFontSize(componentType.type),
        fontWeight: 'normal',
        lineHeight: 'normal',
        textAlign: 'left',
        verticalAlign: 'baseline',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        display: 'block',
        borderRadius: getDefaultBorderRadius(componentType.type),
        border: getDefaultBorder(componentType.type),
        boxShadow: 'none',
        right: 'auto',
        bottom: 'auto'
      },
      attributes: getDefaultAttributes(componentType.type),
      children: []
    };

    const updatedProject = { ...project };
    if (updatedProject.content?.pages?.[0]?.content?.structure) {
      updatedProject.content.pages[0].content.structure.push(newComponent);
      onComponentUpdate(updatedProject);
      onComponentSelect(newComponent);
    }
  }, [project, onComponentUpdate, onComponentSelect]);

  const handleComponentUpdate = useCallback((updatedComponent: ComponentDefinition) => {
    console.log('Updating component:', updatedComponent);

    const updatedProject = { ...project };
    if (updatedProject.content?.pages?.[0]?.content?.structure) {
      const structure = updatedProject.content.pages[0].content.structure;
      const index = structure.findIndex(c => c.id === updatedComponent.id);
      if (index !== -1) {
        structure[index] = updatedComponent;
        onComponentUpdate(updatedProject);
      }
    }
  }, [project, onComponentUpdate]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onComponentSelect(null);
    }
  }, [onComponentSelect]);

  const renderComponent = (component: ComponentDefinition) => {
    const isSelected = selectedComponent?.id === component.id;

    return (
      <ResizableComponent
        key={component.id}
        component={component}
        isSelected={isSelected}
        onUpdate={handleComponentUpdate}
        onSelect={() => onComponentSelect(component)}
        showGuides={false}
      >
        {renderComponentContent(component)}
      </ResizableComponent>
    );
  };

  const renderComponentContent = (component: ComponentDefinition) => {
    const Tag = component.tag || 'div';
    const content = component.content || '';

    switch (component.type) {
      case 'text':
        return <Tag className="w-full h-full">{content}</Tag>;

      case 'heading':
        return <Tag className="w-full h-full font-bold">{content}</Tag>;

      case 'button':
        return (
          <Tag 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            style={{ 
              backgroundColor: component.styles?.backgroundColor || '#007bff',
              color: component.styles?.color || 'white',
              border: 'none',
              borderRadius: component.styles?.borderRadius || '6px'
            }}
          >
            {content}
          </Tag>
        );

      case 'image':
        return (
          <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
            {component.attributes?.src ? (
              <img 
                src={component.attributes.src} 
                alt={component.attributes?.alt || 'Image'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span>Image</span>
            )}
          </div>
        );

      case 'input':
        return (
          <input
            type={component.attributes?.type || 'text'}
            placeholder={component.attributes?.placeholder || 'Entrez du texte...'}
            className="w-full h-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        );

      case 'container':
      case 'section':
      case 'header':
      case 'footer':
        return (
          <div className="w-full h-full border border-dashed border-gray-300 bg-gray-50/50 flex items-center justify-center text-gray-500 text-sm">
            {content || component.type}
            {component.children && component.children.map(renderComponent)}
          </div>
        );

      default:
        return (
          <div className="w-full h-full border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
            {content || component.type}
          </div>
        );
    }
  };

  // Obtenir les dimensions réelles du conteneur
  const containerBounds = containerRef.current?.getBoundingClientRect() || { width: 800, height: 600 };

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      <div
        ref={(node) => {
          drop(node);
          containerRef.current = node;
        }}
        className="visual-editor-container relative w-full h-full min-h-[600px] bg-white"
        onClick={handleContainerClick}
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 0'
        }}
      >
        {/* Rendu des composants */}
        {pageStructure.map(renderComponent)}

        {/* Indicateur de zone de drop */}
        {isOver && canDrop && (
          <div className="absolute inset-0 bg-blue-100/30 border-2 border-dashed border-blue-400 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                Déposez le composant ici
              </div>
            </div>
          </div>
        )}

        {/* Aperçu de drag */}
        {dragPreview && (
          <div
            className="absolute pointer-events-none bg-blue-100 border-2 border-dashed border-blue-400 opacity-70 flex items-center justify-center text-blue-600 text-sm font-medium"
            style={{
              left: `${dragPreview.x - 50}px`,
              top: `${dragPreview.y - 25}px`,
              width: getDefaultWidth(dragPreview.type),
              height: getDefaultHeight(dragPreview.type),
              zIndex: 9999
            }}
          >
            {dragPreview.type}
          </div>
        )}

        {/* Message d'aide si vide */}
        {pageStructure.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-medium mb-2">Commencez à créer</h3>
              <p className="text-sm">Glissez-déposez des composants depuis la palette pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Fonctions utilitaires pour les valeurs par défaut
function getDefaultTag(type: string): string {
  switch (type) {
    case 'heading': return 'h2';
    case 'text': return 'p';
    case 'button': return 'button';
    case 'input': return 'input';
    case 'image': return 'div';
    case 'section': return 'section';
    case 'header': return 'header';
    case 'footer': return 'footer';
    default: return 'div';
  }
}

function getDefaultContent(type: string): string {
  switch (type) {
    case 'heading': return 'Titre principal';
    case 'text': return 'Votre texte ici';
    case 'button': return 'Cliquez ici';
    case 'image': return '';
    case 'input': return '';
    default: return '';
  }
}

function getDefaultWidth(type: string): string {
  switch (type) {
    case 'button': return 'auto';
    case 'input': return '200px';
    case 'image': return '150px';
    case 'heading': return 'auto';
    case 'text': return 'auto';
    default: return '100px';
  }
}

function getDefaultHeight(type: string): string {
  switch (type) {
    case 'button': return 'auto';
    case 'input': return '40px';
    case 'image': return '100px';
    case 'heading': return 'auto';
    case 'text': return 'auto';
    default: return '50px';
  }
}

function getDefaultPadding(type: string): string {
  switch (type) {
    case 'button': return '12px 24px';
    case 'input': return '8px 12px';
    case 'text': return '8px';
    case 'heading': return '8px';
    default: return '8px';
  }
}

function getDefaultBackgroundColor(type: string): string {
  switch (type) {
    case 'button': return '#007bff';
    case 'input': return 'white';
    default: return 'transparent';
  }
}

function getDefaultColor(type: string): string {
  switch (type) {
    case 'button': return 'white';
    default: return 'inherit';
  }
}

function getDefaultFontSize(type: string): string {
  switch (type) {
    case 'heading': return '1.5rem';
    default: return '1rem';
  }
}

function getDefaultBorderRadius(type: string): string {
  switch (type) {
    case 'button': return '6px';
    case 'input': return '4px';
    default: return '0';
  }
}

function getDefaultBorder(type: string): string {
  switch (type) {
    case 'input': return '1px solid #d1d5db';
    default: return 'none';
  }
}

function getDefaultAttributes(type: string): Record<string, any> {
  switch (type) {
    case 'button':
      return { type: 'button', className: 'btn btn-primary' };
    case 'input':
      return { type: 'text', placeholder: 'Entrez du texte...' };
    case 'image':
      return { alt: 'Image' };
    default:
      return {};
  }
}