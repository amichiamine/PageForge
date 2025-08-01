import React, { useCallback, useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { nanoid } from 'nanoid';
import ResizableComponent from './resizable-component';
import AlignmentGuides from './alignment-guides';
import type { Project, ComponentDefinition } from '@shared/schema';
import { 
  createComponent, 
  findComponentById, 
  updateComponentInTree, 
  removeComponentFromTree, 
  addComponentToTree 
} from '@/lib/editor-utils';

interface VisualEditorProps {
  project: Project | null;
  selectedComponent: ComponentDefinition | null;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentUpdate: (project: Project) => void;
  showAlignmentGuides?: boolean;
}

interface DragItem {
  type: string;
  id?: string;
  componentType?: string;
  isExisting?: boolean;
}

const VisualEditor: React.FC<VisualEditorProps> = ({
  project,
  selectedComponent,
  onComponentSelect,
  onComponentUpdate,
  showAlignmentGuides = true
}) => {
  const [draggedComponent, setDraggedComponent] = useState<ComponentDefinition | null>(null);
  const [guides, setGuides] = useState<{ x: number[], y: number[] }>({ x: [], y: [] });
  const editorRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['component', 'COMPONENT', 'EXISTING_COMPONENT'],
    drop: (item: DragItem, monitor) => {
      if (!project) return;

      const offset = monitor.getClientOffset();
      const editorRect = editorRef.current?.getBoundingClientRect();

      if (!offset || !editorRect) return;

      // Ajuster les coordonnées pour tenir compte du scroll et des marges
      const x = Math.max(10, offset.x - editorRect.left - 10);
      const y = Math.max(10, offset.y - editorRect.top - 10);

      if (item.isExisting && item.id) {
        // Moving existing component
        handleComponentMove(item.id, x, y);
      } else if (item.componentType || item.type) {
        // Adding new component
        handleComponentAdd(item.componentType || item.type, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleComponentAdd = useCallback((componentType: string, x: number, y: number) => {
    if (!project || !project.content?.pages?.[0]) return;

    console.log('Adding component of type:', componentType);
    const newComponent = createComponent(componentType);
    console.log('Created component:', newComponent);
    
    // Tailles réduites pour tous les composants
    const baseWidths: Record<string, string> = {
      'container': '250px',
      'section': '280px', 
      'header': '300px',
      'footer': '300px',
      'heading': '200px',
      'paragraph': '220px',
      'image': '180px',
      'button': '120px',
      'link': '100px',
      'form': '240px',
      'list': '180px',
      'video': '200px',
      'audio': '200px',
      'calendar': '200px',
      'contact': '200px',
      'testimonial': '220px',
      'pricing': '200px'
    };

    const baseHeights: Record<string, string> = {
      'container': '120px',
      'section': '150px',
      'header': '80px', 
      'footer': '80px',
      'heading': '40px',
      'paragraph': '60px',
      'image': '120px',
      'button': '36px',
      'link': '24px',
      'form': '200px',
      'list': '100px',
      'video': '120px',
      'audio': '50px',
      'calendar': '200px',
      'contact': '150px',
      'testimonial': '120px',
      'pricing': '200px'
    };
    
    newComponent.styles = {
      ...newComponent.styles,
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: baseWidths[componentType] || newComponent.styles?.width || '180px',
      height: baseHeights[componentType] || newComponent.styles?.height || '80px',
      backgroundColor: newComponent.styles?.backgroundColor || 'transparent',
      color: newComponent.styles?.color || '#000000',
      fontSize: newComponent.styles?.fontSize || '14px',
      fontFamily: newComponent.styles?.fontFamily || 'Inter, sans-serif',
      padding: newComponent.styles?.padding || '8px',
      margin: newComponent.styles?.margin || '0px',
      border: newComponent.styles?.border || '1px solid #e5e7eb',
      borderRadius: newComponent.styles?.borderRadius || '6px',
      zIndex: '1000'
    };

    const updatedStructure = [...(project.content.pages[0].content.structure || []), newComponent];

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content.pages[0],
          content: {
            ...project.content.pages[0].content,
            structure: updatedStructure
          }
        }]
      }
    };

    onComponentUpdate(updatedProject);
    onComponentSelect(newComponent);
  }, [project, onComponentUpdate, onComponentSelect]);

  const handleComponentMove = useCallback((componentId: string, x: number, y: number) => {
    if (!project || !project.content?.pages?.[0]) return;

    const currentStructure = project.content.pages[0].content.structure || [];
    const componentToMove = findComponentById(currentStructure, componentId);

    if (!componentToMove) return;

    const updatedComponent = {
      ...componentToMove,
      styles: {
        ...componentToMove.styles,
        left: `${x}px`,
        top: `${y}px`
      }
    };

    console.log('Updating component:', updatedComponent);

    const updatedStructure = updateComponentInTree(currentStructure, componentId, updatedComponent);

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content.pages[0],
          content: {
            ...project.content.pages[0].content,
            structure: updatedStructure
          }
        }]
      }
    };

    onComponentUpdate(updatedProject);
  }, [project, onComponentUpdate]);

  const handleComponentUpdate = useCallback((updatedComponent: ComponentDefinition) => {
    if (!project || !project.content?.pages?.[0]) return;

    const currentStructure = project.content.pages[0].content.structure || [];
    const updatedStructure = updateComponentInTree(currentStructure, updatedComponent.id, updatedComponent);

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content.pages[0],
          content: {
            ...project.content.pages[0].content,
            structure: updatedStructure
          }
        }]
      }
    };

    onComponentUpdate(updatedProject);
  }, [project, onComponentUpdate]);

  const handleComponentDelete = useCallback((componentId: string) => {
    if (!project || !project.content?.pages?.[0]) return;

    const currentStructure = project.content.pages[0].content.structure || [];
    const updatedStructure = removeComponentFromTree(currentStructure, componentId);

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content.pages[0],
          content: {
            ...project.content.pages[0].content,
            structure: updatedStructure
          }
        }]
      }
    };

    onComponentUpdate(updatedProject);

    if (selectedComponent?.id === componentId) {
      onComponentSelect(null);
    }
  }, [project, selectedComponent, onComponentUpdate, onComponentSelect]);

  const structure = project?.content?.pages?.[0]?.content?.structure || [];

  const renderComponent = useCallback((component: ComponentDefinition): React.ReactNode => {
    return (
      <ResizableComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onUpdate={(updatedComponent) => {
                if (!project || !project.content?.pages?.[0]) return;
                
                const currentStructure = project.content.pages[0].content?.structure || [];
                const updatedStructure = currentStructure.map(c => 
                  c.id === updatedComponent.id ? updatedComponent : c
                );
                const updatedProject = {
                  ...project,
                  content: {
                    ...project.content,
                    pages: [{
                      ...project.content.pages[0],
                      content: {
                        ...project.content.pages[0].content,
                        structure: updatedStructure
                      }
                    }]
                  }
                };
                onComponentUpdate(updatedProject);
              }}
              onSelect={() => onComponentSelect(component)}
              showGuides={true}
            >
              <ComponentRenderer component={component} />
            </ResizableComponent>
    );
  }, [selectedComponent, onComponentSelect, handleComponentUpdate, handleComponentDelete, showAlignmentGuides, project, onComponentUpdate]);

  // Component renderer for different component types
  const ComponentRenderer = ({ component }: { component: ComponentDefinition }) => {
    const style = {
      ...component.styles,
      position: 'relative' as const,
      width: '100%',
      height: '100%',
    };

    switch (component.type) {
      case 'text':
      case 'paragraph':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.content || 'Texte'}
          </div>
        );
        
      case 'heading':
        const HeadingTag = (component.attributes?.level ? `h${component.attributes.level}` : 'h1') as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag style={style} className={component.attributes?.className}>
            {component.content || 'Titre'}
          </HeadingTag>
        );
        
      case 'button':
        return (
          <button style={style} className={component.attributes?.className}>
            {component.content || 'Bouton'}
          </button>
        );
        
      case 'image':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.attributes?.src ? (
              <img 
                src={component.attributes.src} 
                alt={component.attributes.alt || ''} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-200 text-gray-500 w-full h-full">
                📷 Image
              </div>
            )}
          </div>
        );
        
      case 'container':
      case 'section':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || component.content || 'Container'}
          </div>
        );
        
      case 'header':
        return (
          <header style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || 'Header'}
          </header>
        );
        
      case 'footer':
        return (
          <footer style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || 'Footer'}
          </footer>
        );
        
      case 'list':
        return (
          <ul style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || <li>Élément de liste</li>}
          </ul>
        );
        
      case 'form':
        return (
          <form style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || 'Formulaire'}
          </form>
        );
        
      case 'input':
        return (
          <input 
            style={style} 
            className={component.attributes?.className}
            type={component.attributes?.type || 'text'}
            placeholder={component.attributes?.placeholder || ''}
          />
        );
        
      case 'textarea':
        return (
          <textarea 
            style={style} 
            className={component.attributes?.className}
            placeholder={component.attributes?.placeholder || ''}
            rows={component.attributes?.rows || 3}
          >
            {component.content || ''}
          </textarea>
        );
        
      case 'card':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || (
              <>
                <div style={{ height: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🖼️
                </div>
                <div style={{ height: '50%', padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Titre de la carte</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Description...</div>
                </div>
              </>
            )}
          </div>
        );
        
      case 'carousel':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#3b82f6', color: 'white', fontSize: '24px' }}>
                🎠 Carousel
              </div>
            )}
          </div>
        );
        
      case 'accordion':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || (
              <div>
                <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>▼ Question 1</div>
                <div style={{ padding: '12px 16px', fontSize: '14px', color: '#666' }}>Réponse à la première question...</div>
              </div>
            )}
          </div>
        );
        
      case 'chart':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || (
              <div style={{ padding: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '16px' }}>📊 Statistiques</div>
                <div style={{ display: 'flex', alignItems: 'end', height: '120px', gap: '8px' }}>
                  <div style={{ width: '40px', height: '75%', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '40px', height: '60%', backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '40px', height: '90%', backgroundColor: '#f59e0b', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '40px', height: '45%', backgroundColor: '#ef4444', borderRadius: '4px 4px 0 0' }}></div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'video':
        return (
          <div style={{...style, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || (
              <div style={{ color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>▶️</div>
                <div>Lecteur Vidéo</div>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div style={style} className={component.attributes?.className}>
            {component.content || component.type}
          </div>
        );
    }
  };

  // Gérer le clic sur le fond pour désélectionner
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onComponentSelect(null);
    }
  };

  return (
    <div
      ref={(node) => {
        if (editorRef.current !== node) {
          (editorRef as any).current = node;
        }
        drop(node);
      }}
      className={`
        visual-editor-container relative w-full h-full min-h-[600px] bg-white overflow-hidden
        ${isOver && canDrop ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}
        ${!structure.length ? 'editor-drop-zone' : ''}
      `}
      style={{ 
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        zIndex: 1
      }}
      onClick={handleBackgroundClick}
      onTouchStart={(e) => {
        // Gérer le clic tactile pour désélectionner aussi
        if (e.target === e.currentTarget) {
          onComponentSelect(null);
        }
        
        // Gérer différemment selon la zone touchée
        const touch = e.touches[0];
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();

        // Gérer différemment selon la zone touchée
        const edgeThreshold = 40;
        const isNearEdge = touch.clientY < rect.top + edgeThreshold || 
                          touch.clientY > rect.bottom - edgeThreshold;

        if (isNearEdge && structure.length > 0) {
          // Permettre le scroll près des bords s'il y a du contenu
          element.style.touchAction = 'pan-y';
        } else {
          // Bloquer le scroll pour permettre le drop
          element.style.touchAction = 'none';
          e.preventDefault();
        }
      }}
      onTouchEnd={() => {
        // Restaurer le comportement par défaut
        if (editorRef.current) {
          editorRef.current.style.touchAction = 'manipulation';
        }
      }}
    >
      {/* Alignment Guides will be implemented as an overlay in the parent component */}

      {/* Components */}
      {structure.map(renderComponent)}

      {/* Empty State */}
      {!structure.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-medium mb-2">Commencez à créer</h3>
            <p className="text-gray-400">
              Glissez et déposez des composants depuis la palette pour commencer
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualEditor;