import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useCallback, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend } from 'react-dnd-multi-backend';
import { useCollaboration } from '@/hooks/useCollaboration';
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/header";
import { 
  Save, Eye, Download, Code, ArrowLeft, Wifi, Undo, Redo, Grid, Settings,
  PanelLeft, PanelRight, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  MousePointer, Square, Type, Image as ImageIcon, Layers
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project, ComponentDefinition } from "@shared/schema";
import { createComponent } from "@/lib/editor-utils";
import { useLocation } from "wouter";
import { useSidebarContext } from "@/App";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDrop, useDrag } from "react-dnd";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import EnhancedImageSelector from "@/components/editor/enhanced-image-selector";
import { enhancedComponentDefinitions, componentCategories } from "@/lib/enhanced-component-definitions";

// Configuration multi-backend pour drag and drop
const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: (event: any) => !event.nativeEvent?.touches?.length
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: (event: any) => event.nativeEvent?.touches?.length > 0
    }
  ]
};

// Propriétés CSS pour la page elle-même
interface PageStyles {
  backgroundColor: string;
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;
  minHeight: string;
  padding: string;
  margin: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  color: string;
}

// Composant draggable de la palette améliorée
interface DraggableComponentProps {
  component: typeof enhancedComponentDefinitions[0];
  onDoubleClick?: (type: string) => void;
}

function DraggableComponent({ component, onDoubleClick }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type: component.type, componentType: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`group p-3 border rounded-lg cursor-move transition-all hover:shadow-md hover:border-blue-300 ${
        isDragging ? 'opacity-50' : ''
      } ${component.isPremium ? 'border-yellow-300 bg-yellow-50' : ''}`}
      onDoubleClick={() => onDoubleClick?.(component.type)}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{component.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">{component.name}</p>
            {component.isPremium && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                Pro
              </Badge>
            )}
            {component.isFeatured && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                ★
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{component.description}</p>
        </div>
      </div>
    </div>
  );
}

// Zone de drop principale avec grille et guides
interface DropZoneProps {
  components: ComponentDefinition[];
  selectedComponent: ComponentDefinition | null;
  pageStyles: PageStyles;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentAdd: (type: string, position: { x: number; y: number }) => void;
  onComponentMove: (id: string, position: { x: number; y: number }) => void;
  showGrid: boolean;
}

function DropZone({ 
  components, 
  selectedComponent, 
  pageStyles,
  onComponentSelect, 
  onComponentAdd, 
  onComponentMove,
  showGrid
}: DropZoneProps) {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ['component', 'existing-component'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const dropRect = dropRef.current?.getBoundingClientRect();
      
      if (!offset || !dropRect) return;
      
      const x = Math.max(0, offset.x - dropRect.left);
      const y = Math.max(0, offset.y - dropRect.top);
      
      if (item.id) {
        // Moving existing component
        onComponentMove(item.id, { x, y });
      } else {
        // Adding new component
        onComponentAdd(item.type || item.componentType, { x, y });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`relative w-full h-full overflow-auto transition-all ${
        isOver ? 'bg-blue-50 border-blue-400' : 'border-gray-300'
      }`}
      style={{
        backgroundColor: pageStyles.backgroundColor,
        backgroundImage: pageStyles.backgroundImage,
        backgroundSize: pageStyles.backgroundSize,
        backgroundPosition: pageStyles.backgroundPosition,
        backgroundRepeat: pageStyles.backgroundRepeat,
        minHeight: pageStyles.minHeight,
        padding: pageStyles.padding,
        fontFamily: pageStyles.fontFamily,
        fontSize: pageStyles.fontSize,
        lineHeight: pageStyles.lineHeight,
        color: pageStyles.color
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onComponentSelect(null);
        }
      }}
    >
      {/* Grid background */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {/* Drop hint */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-2">Canvas vide</h2>
            <p className="text-lg">Glissez des composants depuis la palette</p>
            <p className="text-sm mt-2">Double-cliquez sur un composant pour l'ajouter au centre</p>
          </div>
        </div>
      )}

      {/* Rendered components */}
      {components.map((component) => (
        <DraggableRenderedComponent
          key={component.id}
          component={component}
          isSelected={selectedComponent?.id === component.id}
          onSelect={onComponentSelect}
          onMove={onComponentMove}
        />
      ))}
    </div>
  );
}

// Composant rendu et draggable dans l'éditeur
interface DraggableRenderedComponentProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onSelect: (component: ComponentDefinition | null) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
}

function DraggableRenderedComponent({ 
  component, 
  isSelected, 
  onSelect,
  onMove 
}: DraggableRenderedComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'existing-component',
    item: { id: component.id, type: 'existing-component' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const renderComponentContent = () => {
    const content = component.content || 'Nouveau composant';
    const styles = component.styles || {};
    const attrs = component.attributes || {};
    
    const combinedStyles = {
      ...styles,
      position: 'relative' as const,
      zIndex: isSelected ? 10 : 1
    };
    
    switch (component.type) {
      case 'heading':
        const HeadingTag = (component.tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') || 'h1';
        return <HeadingTag style={combinedStyles}>{content}</HeadingTag>;
        
      case 'paragraph':
        return <p style={combinedStyles}>{content}</p>;
        
      case 'button':
        return (
          <button style={combinedStyles} {...attrs}>
            {content}
          </button>
        );
        
      case 'image':
        return (
          <img 
            src={attrs.src || 'https://via.placeholder.com/200x150'} 
            alt={attrs.alt || 'Image'} 
            style={combinedStyles}
          />
        );
        
      case 'container':
        return (
          <div style={combinedStyles}>
            {content || 'Container'}
          </div>
        );
        
      case 'card':
        return (
          <div style={combinedStyles}>
            {content || 'Contenu de la carte'}
          </div>
        );
        
      case 'input':
        return (
          <input 
            type={attrs.type || 'text'}
            placeholder={attrs.placeholder || 'Saisir du texte...'}
            style={combinedStyles}
            {...attrs}
          />
        );
        
      case 'link':
        return (
          <a href={attrs.href || '#'} style={combinedStyles} {...attrs}>
            {content}
          </a>
        );
        
      case 'list':
        const ListTag = (component.tag as 'ul' | 'ol') || 'ul';
        const items = content.split('\n').filter(item => item.trim());
        return (
          <ListTag style={combinedStyles}>
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ListTag>
        );
        
      case 'hero':
        return (
          <section style={combinedStyles}>
            <h1 className="text-4xl font-bold mb-4">{content}</h1>
            <p className="text-lg opacity-90">Section hero avec gradient</p>
          </section>
        );
        
      default:
        return <div style={combinedStyles}>{content}</div>;
    }
  };

  return (
    <div
      ref={drag}
      className={`absolute cursor-move transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        width: component.position?.width,
        height: component.position?.height,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
    >
      {renderComponentContent()}
      
      {/* Selection handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow cursor-nw-resize"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow cursor-ne-resize"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow cursor-sw-resize"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow cursor-se-resize"></div>
          
          {/* Edge handles */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow cursor-n-resize"></div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow cursor-s-resize"></div>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow cursor-w-resize"></div>
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow cursor-e-resize"></div>
        </>
      )}
    </div>
  );
}

export default function EditorAdvanced() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  // States
  const [components, setComponents] = useState<ComponentDefinition[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showImageSelector, setShowImageSelector] = useState(false);
  
  // Panel states
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Texte');
  
  // Page styles
  const [pageStyles, setPageStyles] = useState<PageStyles>({
    backgroundColor: '#ffffff',
    backgroundImage: 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    padding: '20px',
    margin: '0',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333333'
  });

  // Sidebar context
  const { setHideMainSidebar } = useSidebarContext();

  // Hide main sidebar when in editor
  useEffect(() => {
    setHideMainSidebar(true);
    return () => setHideMainSidebar(false);
  }, [setHideMainSidebar]);

  // Project query
  const { 
    data: project, 
    isLoading, 
    error,
    refetch 
  } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Collaboration hook
  const collaboration = useCollaboration({
    projectId: projectId || '',
    userId: 'current-user',
    userName: 'Utilisateur',
    enabled: !!projectId && !!project
  });

  // Load components from project
  useEffect(() => {
    if (project?.content?.pages?.[0]?.content?.structure) {
      setComponents(project.content.pages[0].content.structure);
    } else {
      setComponents([]);
    }
  }, [project]);

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (updatedProject: Partial<Project>) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      setIsDirty(false);
      toast({
        title: "Projet sauvegardé",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le projet.",
        variant: "destructive",
      });
    },
  });

  // Component handlers
  const handleComponentAdd = useCallback((type: string, position: { x: number; y: number }) => {
    if (!project) return;

    const componentDef = enhancedComponentDefinitions.find(def => def.type === type);
    if (!componentDef) return;

    const newComponent: ComponentDefinition = {
      ...componentDef.defaultProps,
      id: `${type}_${Date.now()}`,
      position: { 
        x: position.x, 
        y: position.y, 
        width: componentDef.defaultProps.position?.width || 200,
        height: componentDef.defaultProps.position?.height || 100
      }
    };

    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    setSelectedComponent(newComponent);
    setIsDirty(true);

    // Update project in database
    const updatedProject = { 
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content?.pages?.[0],
          id: project.content?.pages?.[0]?.id || 'main',
          name: project.content?.pages?.[0]?.name || 'Accueil',
          path: project.content?.pages?.[0]?.path || '/',
          content: {
            structure: updatedComponents
          }
        }]
      }
    };

    saveProjectMutation.mutate({ content: updatedProject.content });

    toast({
      title: "Composant ajouté",
      description: `${componentDef.name} ajouté à la page`,
    });
  }, [components, project, saveProjectMutation, toast]);

  const handleComponentUpdate = useCallback((updatedComponent: ComponentDefinition) => {
    const updatedComponents = components.map(comp =>
      comp.id === updatedComponent.id ? updatedComponent : comp
    );
    setComponents(updatedComponents);
    setSelectedComponent(updatedComponent);
    setIsDirty(true);

    // Broadcast change for collaboration
    if (collaboration.sendEvent) {
      collaboration.sendEvent({
        type: 'component_update',
        data: { component: updatedComponent }
      });
    }
  }, [components, collaboration]);

  const handleComponentMove = useCallback((componentId: string, position: { x: number; y: number }) => {
    const updatedComponents = components.map(comp =>
      comp.id === componentId ? { 
        ...comp, 
        position: { 
          x: position.x, 
          y: position.y, 
          width: comp.position?.width || 200, 
          height: comp.position?.height || 100 
        }
      } : comp
    );
    setComponents(updatedComponents);
    setIsDirty(true);
  }, [components]);

  const handleComponentDelete = useCallback((componentId: string) => {
    const updatedComponents = components.filter(comp => comp.id !== componentId);
    setComponents(updatedComponents);
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
    setIsDirty(true);
  }, [components, selectedComponent]);

  const handleSave = useCallback(() => {
    if (!project) return;

    const updatedProject = { 
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content?.pages?.[0],
          id: project.content?.pages?.[0]?.id || 'main',
          name: project.content?.pages?.[0]?.name || 'Accueil',
          path: project.content?.pages?.[0]?.path || '/',
          content: {
            structure: components
          }
        }]
      }
    };

    saveProjectMutation.mutate({ content: updatedProject.content });
  }, [project, components, saveProjectMutation]);

  // Image selector handler
  const handleImageSelect = useCallback((src: string, alt?: string) => {
    if (selectedComponent && selectedComponent.type === 'image') {
      const updatedComponent = {
        ...selectedComponent,
        attributes: {
          ...selectedComponent.attributes,
          src,
          alt: alt || 'Image'
        }
      };
      handleComponentUpdate(updatedComponent);
    }
  }, [selectedComponent, handleComponentUpdate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-500 mb-4">Impossible de charger le projet</p>
          <Button onClick={() => refetch()} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const filteredComponents = enhancedComponentDefinitions.filter(comp => 
    selectedCategory === 'Tous' || comp.category === selectedCategory
  );

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        {/* Header */}
        <Header 
          title={project.name}
          subtitle={`${project.type} • ${components.length} composant(s) • ${selectedComponent ? selectedComponent.type : 'Aucune sélection'}`}
          actions={
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/projects")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Projets
              </Button>

              <Badge variant="secondary">
                {project.type === 'single-page' && 'Page unique'}
                {project.type === 'multi-page' && 'Multi-pages'}
                {project.type === 'ftp-sync' && 'Sync FTP'}
                {project.type === 'ftp-upload' && 'Upload FTP'}
              </Badge>

              <Separator orientation="vertical" className="h-6" />

              {/* View controls */}
              <Button 
                variant={showGrid ? "default" : "outline"}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className="w-4 h-4" />
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCollaborationPanel(!showCollaborationPanel)}
              >
                <Wifi className="w-4 h-4 mr-2" />
                {collaboration.isConnected ? 'Connecté' : 'Déconnecté'}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowCodePreview(true)}>
                <Code className="w-4 h-4 mr-2" />
                Code
              </Button>

              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                disabled={saveProjectMutation.isPending || !isDirty}
              >
                <Save className="w-4 h-4 mr-2" />
                {saveProjectMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          }
        />

        {/* Main editor content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Floating panel toggle buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 left-4 z-50 bg-white shadow-md"
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          >
            {leftPanelCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-50 bg-white shadow-md"
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
          >
            {rightPanelCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>

          {/* Left sidebar - Component palette */}
          <div className={`bg-white border-r flex-shrink-0 transition-all duration-300 ${
            leftPanelCollapsed ? 'w-0 overflow-hidden' : 'w-80'
          }`}>
            <div className="p-4 h-full overflow-y-auto">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Palette de composants
              </h2>
              
              {/* Category filter */}
              <div className="mb-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tous">Toutes catégories</SelectItem>
                    {componentCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {filteredComponents.map((component) => (
                  <DraggableComponent
                    key={component.type}
                    component={component}
                    onDoubleClick={(type) => {
                      const centerX = 400;
                      const centerY = 200;
                      handleComponentAdd(type, { x: centerX, y: centerY });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center - Visual editor */}
          <div className="flex-1 flex flex-col relative">
            <div className="flex-1 overflow-hidden">
              <DropZone
                components={components}
                selectedComponent={selectedComponent}
                pageStyles={pageStyles}
                onComponentSelect={setSelectedComponent}
                onComponentAdd={handleComponentAdd}
                onComponentMove={handleComponentMove}
                showGrid={showGrid}
              />
            </div>
          </div>

          {/* Right sidebar - Properties panel */}
          <div className={`bg-white border-l flex-shrink-0 transition-all duration-300 ${
            rightPanelCollapsed ? 'w-0 overflow-hidden' : 'w-80'
          }`}>
            <div className="p-4 h-full overflow-y-auto">
              <Tabs defaultValue="component" className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="component">Composant</TabsTrigger>
                  <TabsTrigger value="page">Page</TabsTrigger>
                </TabsList>

                <TabsContent value="component" className="space-y-4 mt-4">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Propriétés du composant
                  </h2>
                  
                  {selectedComponent ? (
                    <div className="space-y-4">
                      {/* Component info */}
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{selectedComponent.type}</h3>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleComponentDelete(selectedComponent.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                        
                        {/* Content editor */}
                        <div className="space-y-3">
                          <div>
                            <Label>Contenu</Label>
                            <Textarea
                              value={selectedComponent.content || ''}
                              onChange={(e) => handleComponentUpdate({
                                ...selectedComponent,
                                content: e.target.value
                              })}
                              placeholder="Contenu du composant..."
                              rows={3}
                            />
                          </div>

                          {/* Image selector for image components */}
                          {selectedComponent.type === 'image' && (
                            <div>
                              <Label>Image</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={selectedComponent.attributes?.src || ''}
                                  onChange={(e) => handleComponentUpdate({
                                    ...selectedComponent,
                                    attributes: {
                                      ...selectedComponent.attributes,
                                      src: e.target.value
                                    }
                                  })}
                                  placeholder="URL de l'image"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => setShowImageSelector(true)}
                                >
                                  <ImageIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Position controls */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>X</Label>
                              <Input
                                type="number"
                                value={selectedComponent.position?.x || 0}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  position: { 
                                    x: parseInt(e.target.value) || 0,
                                    y: selectedComponent.position?.y || 0,
                                    width: selectedComponent.position?.width || 200,
                                    height: selectedComponent.position?.height || 100
                                  }
                                })}
                              />
                            </div>
                            <div>
                              <Label>Y</Label>
                              <Input
                                type="number"
                                value={selectedComponent.position?.y || 0}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  position: { 
                                    x: selectedComponent.position?.x || 0,
                                    y: parseInt(e.target.value) || 0,
                                    width: selectedComponent.position?.width || 200,
                                    height: selectedComponent.position?.height || 100
                                  }
                                })}
                              />
                            </div>
                          </div>

                          {/* CSS Properties - Enhanced */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Styles CSS</h4>
                            
                            {/* Colors */}
                            <div>
                              <Label>Couleur texte</Label>
                              <Input
                                type="color"
                                value={selectedComponent.styles?.color || '#000000'}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, color: e.target.value }
                                })}
                              />
                            </div>
                            
                            <div>
                              <Label>Couleur fond</Label>
                              <Input
                                type="color"
                                value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, backgroundColor: e.target.value }
                                })}
                              />
                            </div>

                            {/* Typography */}
                            <div>
                              <Label>Taille police</Label>
                              <Slider
                                value={[parseInt(selectedComponent.styles?.fontSize?.replace('px', '') || '16')]}
                                onValueChange={(value) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, fontSize: `${value[0]}px` }
                                })}
                                min={8}
                                max={72}
                                step={1}
                                className="w-full"
                              />
                              <span className="text-xs text-gray-500">
                                {selectedComponent.styles?.fontSize || '16px'}
                              </span>
                            </div>

                            {/* Spacing */}
                            <div>
                              <Label>Padding</Label>
                              <Input
                                value={selectedComponent.styles?.padding || ''}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, padding: e.target.value }
                                })}
                                placeholder="ex: 10px 20px"
                              />
                            </div>

                            <div>
                              <Label>Margin</Label>
                              <Input
                                value={selectedComponent.styles?.margin || ''}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, margin: e.target.value }
                                })}
                                placeholder="ex: 10px 0"
                              />
                            </div>

                            {/* Border */}
                            <div>
                              <Label>Bordure</Label>
                              <Input
                                value={selectedComponent.styles?.border || ''}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, border: e.target.value }
                                })}
                                placeholder="ex: 1px solid #000"
                              />
                            </div>

                            <div>
                              <Label>Coins arrondis</Label>
                              <Slider
                                value={[parseInt(selectedComponent.styles?.borderRadius?.replace('px', '') || '0')]}
                                onValueChange={(value) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, borderRadius: `${value[0]}px` }
                                })}
                                min={0}
                                max={50}
                                step={1}
                              />
                            </div>

                            {/* Shadow */}
                            <div>
                              <Label>Ombre</Label>
                              <Input
                                value={selectedComponent.styles?.boxShadow || ''}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, boxShadow: e.target.value }
                                })}
                                placeholder="ex: 0 2px 4px rgba(0,0,0,0.1)"
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <Card className="p-4">
                      <div className="text-center text-gray-500">
                        <MousePointer className="w-8 h-8 mx-auto mb-2" />
                        <p>Sélectionnez un composant pour modifier ses propriétés</p>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="page" className="space-y-4 mt-4">
                  <h2 className="text-sm font-semibold">Propriétés de la page</h2>
                  
                  <Card className="p-4">
                    <div className="space-y-4">
                      {/* Background */}
                      <div>
                        <Label>Couleur de fond</Label>
                        <Input
                          type="color"
                          value={pageStyles.backgroundColor}
                          onChange={(e) => setPageStyles({
                            ...pageStyles,
                            backgroundColor: e.target.value
                          })}
                        />
                      </div>

                      <div>
                        <Label>Image de fond</Label>
                        <Input
                          value={pageStyles.backgroundImage === 'none' ? '' : pageStyles.backgroundImage.replace('url(', '').replace(')', '')}
                          onChange={(e) => setPageStyles({
                            ...pageStyles,
                            backgroundImage: e.target.value ? `url(${e.target.value})` : 'none'
                          })}
                          placeholder="URL de l'image de fond"
                        />
                      </div>

                      {/* Typography */}
                      <div>
                        <Label>Police</Label>
                        <Select 
                          value={pageStyles.fontFamily}
                          onValueChange={(value) => setPageStyles({
                            ...pageStyles,
                            fontFamily: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system-ui, sans-serif">System UI</SelectItem>
                            <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                            <SelectItem value="Georgia, serif">Georgia</SelectItem>
                            <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                            <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Couleur du texte</Label>
                        <Input
                          type="color"
                          value={pageStyles.color}
                          onChange={(e) => setPageStyles({
                            ...pageStyles,
                            color: e.target.value
                          })}
                        />
                      </div>

                      {/* Spacing */}
                      <div>
                        <Label>Padding</Label>
                        <Input
                          value={pageStyles.padding}
                          onChange={(e) => setPageStyles({
                            ...pageStyles,
                            padding: e.target.value
                          })}
                          placeholder="ex: 20px"
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Code preview modal */}
        {showCodePreview && (
          <Dialog open={showCodePreview} onOpenChange={setShowCodePreview}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Aperçu du code</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <Tabs defaultValue="html">
                  <TabsList>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html" className="mt-4">
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
{`<!DOCTYPE html>
<html>
<head>
  <title>${project.name}</title>
  <style>
    body { 
      font-family: ${pageStyles.fontFamily}; 
      color: ${pageStyles.color};
      background-color: ${pageStyles.backgroundColor};
      padding: ${pageStyles.padding};
      margin: ${pageStyles.margin};
    }
  </style>
</head>
<body>
${components.map(comp => `  <${comp.tag || 'div'} style="position: absolute; left: ${comp.position?.x}px; top: ${comp.position?.y}px; ${Object.entries(comp.styles || {}).map(([k,v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`).join('; ')}">${comp.content}</${comp.tag || 'div'}>`).join('\n')}
</body>
</html>`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="css" className="mt-4">
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
{`/* Page Styles */
body {
  font-family: ${pageStyles.fontFamily};
  color: ${pageStyles.color};
  background-color: ${pageStyles.backgroundColor};
  padding: ${pageStyles.padding};
  margin: ${pageStyles.margin};
}

/* Component Styles */
${components.map(comp => `#${comp.id} {
  position: absolute;
  left: ${comp.position?.x}px;
  top: ${comp.position?.y}px;
${Object.entries(comp.styles || {}).map(([k,v]) => `  ${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`).join('\n')}
}`).join('\n\n')}`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="json" className="mt-4">
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                      {JSON.stringify({ components, pageStyles }, null, 2)}
                    </pre>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Enhanced Image Selector */}
        <EnhancedImageSelector
          currentSrc={selectedComponent?.attributes?.src}
          onImageSelect={handleImageSelect}
          isOpen={showImageSelector}
          onOpenChange={setShowImageSelector}
        />

        {/* Collaboration panel */}
        {showCollaborationPanel && (
          <Card className="fixed top-20 right-4 w-80 bg-white border shadow-lg z-50">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Collaboration temps réel</h3>
              <p className="text-sm text-gray-600 mb-2">
                {collaboration.isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
              </p>
              <p className="text-sm text-gray-600">
                {collaboration.users.length} utilisateur(s) actif(s)
              </p>
              <div className="mt-3 space-y-1">
                {collaboration.users.map(user => (
                  <div key={user.userId} className="text-xs p-2 bg-gray-50 rounded">
                    {user.name} • {user.isActive ? 'Actif' : 'Inactif'}
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full"
                onClick={() => setShowCollaborationPanel(false)}
              >
                Fermer
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DndProvider>
  );
}