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

      const x = Math.max(0, offset.x - editorRect.left);
      const y = Math.max(0, offset.y - editorRect.top);

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

    const newComponent = createComponent(componentType);
    newComponent.styles = {
      ...newComponent.styles,
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
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

  const renderComponent = useCallback((component: ComponentDefinition): React.ReactNode => {
    return (
      <ResizableComponent
        key={component.id}
        component={component}
        isSelected={selectedComponent?.id === component.id}
        onSelect={() => onComponentSelect(component)}
        onUpdate={handleComponentUpdate}
        onDelete={() => handleComponentDelete(component.id)}
        showGuides={showAlignmentGuides}
      />
    );
  }, [selectedComponent, onComponentSelect, handleComponentUpdate, handleComponentDelete, showAlignmentGuides]);

  const structure = project?.content?.pages?.[0]?.content?.structure || [];

  return (
    <div
      ref={(node) => {
        editorRef.current = node;
        drop(node);
      }}
      className={`
        relative w-full h-full min-h-[600px] bg-white overflow-hidden touch-none
        ${isOver && canDrop ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}
        ${!structure.length ? 'editor-drop-zone' : ''}
      `}
      style={{ position: 'relative' }}
    >
      {/* Alignment Guides */}
      {showAlignmentGuides && (
        <AlignmentGuides
          guides={guides}
          containerRef={editorRef}
        />
      )}

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