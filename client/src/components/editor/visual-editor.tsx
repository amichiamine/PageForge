import React, { useState, useRef, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trash2, Move, Copy } from "lucide-react";
import type { Project, ComponentDefinition } from "@shared/schema";

interface VisualEditorProps {
  project: Project;
  selectedComponent: ComponentDefinition | null;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentUpdate: (component: ComponentDefinition) => void;
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
      
      if (item.fromPalette) {
        // Add new component from palette
        const newComponent: ComponentDefinition = {
          id: `component-${Date.now()}`,
          type: item.type,
          tag: getDefaultTag(item.type),
          content: getDefaultContent(item.type),
          attributes: getDefaultAttributes(item.type),
          styles: getDefaultStyles(item.type),
          children: []
        };
        
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(component.id);
  };

  const renderComponent = () => {
    const Tag = component.tag || 'div';
    const styles = component.styles || {};
    const attributes = component.attributes || {};
    
    return React.createElement(
      Tag,
      {
        ...attributes,
        style: styles,
        className: cn(
          attributes.class,
          "min-h-[20px] relative group transition-all duration-200",
          isSelected && "ring-2 ring-primary ring-offset-2",
          isOver && "ring-2 ring-secondary ring-offset-2",
          isDragging && "opacity-50"
        ),
        onClick: handleClick
      },
      <>
        {component.content}
        {component.children?.map((child) => (
          <DroppableComponent
            key={child.id}
            component={child}
            isSelected={false}
            onSelect={onSelect}
            onUpdate={(updatedChild) => {
              const updatedChildren = component.children?.map(c => 
                c.id === updatedChild.id ? updatedChild : c
              ) || [];
              onUpdate({ ...component, children: updatedChildren });
            }}
            onDelete={(childId) => {
              const updatedChildren = component.children?.filter(c => c.id !== childId) || [];
              onUpdate({ ...component, children: updatedChildren });
            }}
            depth={depth + 1}
          />
        ))}
        {isSelected && (
          <div className="absolute -top-8 left-0 flex space-x-1 z-10">
            <Button
              size="sm"
              variant="secondary"
              className="h-6 px-2 text-xs"
              onClick={handleDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-6 px-2 text-xs cursor-move"
              ref={ref as any}
            >
              <Move className="w-3 h-3" />
            </Button>
          </div>
        )}
      </>
    );
  };

  return renderComponent();
}

function getDefaultTag(type: string): string {
  switch (type) {
    case "heading": return "h1";
    case "text": return "p";
    case "button": return "button";
    case "image": return "img";
    case "container": return "div";
    case "section": return "section";
    case "navigation": return "nav";
    case "header": return "header";
    case "footer": return "footer";
    case "form": return "form";
    case "input": return "input";
    default: return "div";
  }
}

function getDefaultContent(type: string): string {
  switch (type) {
    case "heading": return "Nouveau titre";
    case "text": return "Nouveau paragraphe de texte";
    case "button": return "Bouton";
    case "image": return "";
    default: return "";
  }
}

function getDefaultAttributes(type: string): Record<string, any> {
  switch (type) {
    case "image":
      return { 
        src: "https://via.placeholder.com/300x200", 
        alt: "Image placeholder",
        class: "max-w-full h-auto" 
      };
    case "input":
      return { 
        type: "text", 
        placeholder: "Saisir du texte...",
        class: "w-full p-2 border border-gray-300 rounded" 
      };
    case "button":
      return { 
        type: "button",
        class: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
      };
    default:
      return { class: "" };
  }
}

function getDefaultStyles(type: string): Record<string, any> {
  switch (type) {
    case "container":
      return { 
        padding: "1rem",
        margin: "0",
        minHeight: "50px"
      };
    case "section":
      return { 
        padding: "2rem 1rem",
        minHeight: "100px"
      };
    case "heading":
      return { 
        fontSize: "1.5rem",
        fontWeight: "bold",
        margin: "0 0 1rem 0"
      };
    case "text":
      return { 
        fontSize: "1rem",
        lineHeight: "1.5",
        margin: "0 0 1rem 0"
      };
    default:
      return {};
  }
}

export default function VisualEditor({ 
  project, 
  selectedComponent, 
  onComponentSelect, 
  onComponentUpdate,
  showCode 
}: VisualEditorProps) {
  const [previewHtml, setPreviewHtml] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = project.content?.pages?.[0];
  const pageStructure = currentPage?.content?.structure || [];

  const [{ isOver }, drop] = useDrop({
    accept: ["palette-item"],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;
      
      // Add component to root level
      const newComponent: ComponentDefinition = {
        id: `component-${Date.now()}`,
        type: item.type,
        tag: getDefaultTag(item.type),
        content: getDefaultContent(item.type),
        attributes: getDefaultAttributes(item.type),
        styles: getDefaultStyles(item.type),
        children: []
      };
      
      // Update the project structure
      const updatedStructure = [...pageStructure, newComponent];
      const updatedProject = {
        ...project,
        content: {
          ...project.content,
          pages: project.content.pages?.map(page => 
            page.id === currentPage?.id 
              ? {
                  ...page,
                  content: {
                    ...page.content,
                    structure: updatedStructure
                  }
                }
              : page
          ) || []
        }
      };
      
      // This would typically trigger a save
      console.log("Updated project structure:", updatedProject);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(containerRef);

  const handleComponentUpdate = useCallback((updatedComponent: ComponentDefinition) => {
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
    
    // Update the project
    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: project.content.pages?.map(page => 
          page.id === currentPage?.id 
            ? {
                ...page,
                content: {
                  ...page.content,
                  structure: updatedStructure
                }
              }
            : page
        ) || []
      }
    };

    onComponentUpdate(updatedComponent);
  }, [project, currentPage, pageStructure, onComponentUpdate]);

  const handleComponentDelete = useCallback((componentId: string) => {
    const removeFromStructure = (components: ComponentDefinition[]): ComponentDefinition[] => {
      return components.filter(comp => comp.id !== componentId)
        .map(comp => ({
          ...comp,
          children: comp.children ? removeFromStructure(comp.children) : undefined
        }));
    };

    const updatedStructure = removeFromStructure(pageStructure);
    
    // Clear selection if deleted component was selected
    if (selectedComponent?.id === componentId) {
      onComponentSelect(null);
    }

    console.log("Deleted component:", componentId);
  }, [pageStructure, selectedComponent, onComponentSelect]);

  const generateHtmlPreview = useCallback(() => {
    const renderComponentsToHtml = (components: ComponentDefinition[]): string => {
      return components.map(component => {
        const tag = component.tag || 'div';
        const attributes = component.attributes || {};
        const styles = component.styles || {};
        
        const attributesString = Object.entries(attributes)
          .filter(([key]) => key !== 'class')
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');
        
        const styleString = Object.entries(styles)
          .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
          .join(';');
        
        const className = attributes.class || '';
        const classAttr = className ? `class="${className}"` : '';
        const styleAttr = styleString ? `style="${styleString}"` : '';
        
        const children = component.children ? renderComponentsToHtml(component.children) : '';
        const content = component.content || '';
        
        return `<${tag} ${classAttr} ${styleAttr} ${attributesString}>${content}${children}</${tag}>`;
      }).join('\n');
    };

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentPage?.name || 'Preview'}</title>
    <style>
        body { font-family: Inter, sans-serif; margin: 0; padding: 0; }
        ${currentPage?.content?.styles || ''}
    </style>
</head>
<body>
    ${renderComponentsToHtml(pageStructure)}
</body>
</html>`;

    setPreviewHtml(html);
  }, [pageStructure, currentPage]);

  if (showCode) {
    generateHtmlPreview();
    return (
      <div className="h-full">
        <div className="bg-gray-900 text-gray-100 p-4 h-full overflow-auto">
          <pre className="text-sm">
            <code>{previewHtml}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        ref={containerRef}
        className={cn(
          "min-h-screen p-4 bg-white",
          isOver && "bg-blue-50 ring-2 ring-blue-300 ring-inset"
        )}
        onClick={() => onComponentSelect(null)}
      >
        {pageStructure.length === 0 ? (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <div className="text-4xl text-gray-400 mb-4">+</div>
              <p className="text-gray-500">Glissez des composants ici pour commencer</p>
            </div>
          </div>
        ) : (
          pageStructure.map((component) => (
            <DroppableComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onSelect={onComponentSelect}
              onUpdate={handleComponentUpdate}
              onDelete={handleComponentDelete}
              depth={0}
            />
          ))
        )}
      </div>
    </DndProvider>
  );
}
