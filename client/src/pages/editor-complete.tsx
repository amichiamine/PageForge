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
import { Save, Eye, Download, Code, ArrowLeft, Wifi, Undo, Redo, Grid, Settings } from "lucide-react";
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
import ColorPicker from "@/components/editor/color-picker";
import ImageSelector from "@/components/editor/image-selector";
import TouchComponentPalette from "@/components/editor/touch-component-palette";

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

// Composants disponibles
const componentTypes = [
  { type: 'heading', name: 'Titre', category: 'Text', icon: '📝' },
  { type: 'paragraph', name: 'Paragraphe', category: 'Text', icon: '📄' },
  { type: 'button', name: 'Bouton', category: 'Interactive', icon: '🔘' },
  { type: 'image', name: 'Image', category: 'Media', icon: '🖼️' },
  { type: 'container', name: 'Container', category: 'Layout', icon: '📦' },
  { type: 'card', name: 'Card', category: 'Layout', icon: '🗃️' },
  { type: 'list', name: 'Liste', category: 'Content', icon: '📋' },
  { type: 'input', name: 'Champ de saisie', category: 'Interactive', icon: '📝' },
  { type: 'form', name: 'Formulaire', category: 'Interactive', icon: '📝' },
  { type: 'navigation', name: 'Navigation', category: 'Layout', icon: '🧭' }
];

// Composant draggable de la palette
interface DraggableComponentProps {
  component: typeof componentTypes[0];
}

function DraggableComponent({ component }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type: component.type, componentType: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDoubleClick = () => {
    // Double-click to add component at canvas center with random offset
    const centerX = 250 + Math.random() * 100;
    const centerY = 100 + Math.random() * 100;
    
    // Dispatch a custom event to add component
    window.dispatchEvent(new CustomEvent('addComponentByDoubleClick', {
      detail: { componentType: component.type, position: { x: centerX, y: centerY } }
    }));
  };

  return (
    <div
      ref={drag}
      className={`component-item p-1 border rounded cursor-move transition-all hover:shadow-md touch-feedback ${
        isDragging ? 'opacity-50' : ''
      }`}
      onDoubleClick={handleDoubleClick}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="flex items-center gap-1">
        <span className="text-xs">{component.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-xs truncate">{component.name}</p>
        </div>
      </div>
    </div>
  );
}

// Zone de drop principale (éditeur visuel)
interface DropZoneProps {
  components: ComponentDefinition[];
  selectedComponent: ComponentDefinition | null;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentAdd: (type: string, position: { x: number; y: number }) => void;
  onComponentMove: (id: string, position: { x: number; y: number }) => void;
}

function DropZone({ 
  components, 
  selectedComponent, 
  onComponentSelect, 
  onComponentAdd, 
  onComponentMove 
}: DropZoneProps) {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ['component', 'existing-component'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const dropRect = dropRef.current?.getBoundingClientRect();
      
      if (!offset || !dropRect) return;
      
      const x = offset.x - dropRect.left;
      const y = offset.y - dropRect.top;
      
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
      className={`drop-zone relative w-full h-full min-h-96 bg-white border-2 border-dashed transition-all ${
        isOver ? 'drag-over border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Drop hint with touch support */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-lg font-medium">Glissez des composants ici</p>
            <p className="text-sm">Ou double-cliquez sur un composant pour l'ajouter</p>
            {isMobile && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Mode tactile détecté</p>
                <p className="text-xs text-blue-500">Double-cliquez pour ajouter des composants</p>
              </div>
            )}
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

  // Touch drag functionality
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragActive, setIsDragActive] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragActive(true);
    const touch = e.touches[0];
    setDragPosition({
      x: touch.clientX - (component.position?.x || 0),
      y: touch.clientY - (component.position?.y || 0)
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - dragPosition.x;
    const newY = touch.clientY - dragPosition.y;
    onMove(component.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
  };

  const handleTouchEnd = () => {
    setIsDragActive(false);
  };

  const renderComponentContent = () => {
    const content = component.content || 'Nouveau composant';
    const styles = component.styles || {};
    
    switch (component.type) {
      case 'heading':
        return <h2 className="text-xl font-bold" style={styles}>{content}</h2>;
      case 'paragraph':
        return <p style={styles}>{content}</p>;
      case 'button':
        return <button className="px-4 py-2 bg-blue-500 text-white rounded" style={styles}>{content}</button>;
      case 'image':
        const imageSrc = component.attributes?.src;
        return imageSrc ? (
          <img
            src={imageSrc}
            alt="Component image"
            className="max-w-32 max-h-20 object-cover rounded"
            style={styles}
          />
        ) : (
          <div className="w-32 h-20 bg-gray-200 flex items-center justify-center rounded" style={styles}>
            📷 Image
          </div>
        );
      case 'container':
        return <div className="p-4 border border-dashed border-gray-300 min-h-20" style={styles}>
          Container
        </div>;
      case 'card':
        return <div className="p-4 border rounded-lg shadow-sm bg-white" style={styles}>
          {content}
        </div>;
      default:
        return <div style={styles}>{content}</div>;
    }
  };

  return (
    <div
      ref={drag}
      className={`absolute cursor-move transition-all touch-manipulation ${
        isDragging || isDragActive ? 'opacity-70 z-50' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        touchAction: 'none',
        transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {renderComponentContent()}
      
      {/* Selection handles */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
        </>
      )}
    </div>
  );
}

export default function EditorComplete() {
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

  // Component handlers
  const handleComponentAdd = useCallback((type: string, position?: { x: number; y: number }) => {
    if (!project) return;

    const defaultPosition = position || { x: 100, y: 100 };
    const newComponent = createComponent(type, defaultPosition);
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
      description: `${type} ajouté à la page`,
    });
  }, [components, project, saveProjectMutation, toast]);

  // Double-click event listener for adding components
  useEffect(() => {
    const handleDoubleClickAdd = (event: any) => {
      const { componentType, position } = event.detail;
      handleComponentAdd(componentType, position);
    };

    window.addEventListener('addComponentByDoubleClick', handleDoubleClickAdd);
    return () => {
      window.removeEventListener('addComponentByDoubleClick', handleDoubleClickAdd);
    };
  }, [handleComponentAdd]);

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
        position: { x: position.x, y: position.y, width: comp.position?.width || 200, height: comp.position?.height || 100 }
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

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        {/* Header */}
        <Header 
          title={project.name}
          subtitle={`${project.type} • ${components.length} composant(s)`}
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
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Component palette */}
          <div className="w-40 border-r bg-white flex-shrink-0 overflow-y-auto">
            <div className="p-1">
              <h2 className="text-xs font-semibold mb-2">Composants</h2>
              <div className="space-y-1">
                {componentTypes.map((component) => (
                  <DraggableComponent
                    key={component.type}
                    component={component}
                  />
                ))}
              </div>
              
              {isMobile && (
                <div className="mt-4 p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 mb-2">Sur mobile :</p>
                  <p className="text-xs text-blue-600">Double-cliquez pour ajouter</p>
                </div>
              )}
            </div>
          </div>

          {/* Center - Visual editor */}
          <div className="flex-1 flex flex-col relative">
            <div className="flex-1 overflow-auto p-4">
              <Card className="h-full">
                <DropZone
                  components={components}
                  selectedComponent={selectedComponent}
                  onComponentSelect={setSelectedComponent}
                  onComponentAdd={handleComponentAdd}
                  onComponentMove={handleComponentMove}
                />
              </Card>
            </div>
          </div>

          {/* Right sidebar - Properties panel */}
          <div className="w-44 border-l bg-white flex-shrink-0 overflow-y-auto">
            <div className="p-2">
              <h2 className="text-xs font-semibold mb-2">Propriétés</h2>
              {selectedComponent ? (
                <div className="space-y-4">
                  <Card className="p-3">
                    <h3 className="font-medium mb-3">Composant sélectionné</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Type: {selectedComponent.type}
                    </p>
                    
                    {/* Content editor */}
                    <div className="space-y-2">
                      <Label htmlFor="content">Contenu</Label>
                      <Textarea
                        id="content"
                        value={selectedComponent.content || ''}
                        onChange={(e) => handleComponentUpdate({
                          ...selectedComponent,
                          content: e.target.value
                        })}
                        placeholder="Contenu du composant..."
                        rows={3}
                      />
                    </div>

                    {/* Position */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
                        <Label>Position X</Label>
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
                        <Label>Position Y</Label>
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

                    {/* Enhanced styling with ColorPicker */}
                    <Tabs defaultValue="style" className="mt-4">
                      <TabsList className="grid w-full grid-cols-2 h-7">
                        <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
                        <TabsTrigger value="layout" className="text-xs">Mise en page</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="style" className="space-y-3 mt-3">
                        {/* Text Color */}
                        <div className="space-y-1">
                          <Label className="text-xs">Couleur du texte</Label>
                          <input
                            type="color"
                            value={selectedComponent.styles?.color || '#000000'}
                            onChange={(e) => handleComponentUpdate({
                              ...selectedComponent,
                              styles: { ...selectedComponent.styles, color: e.target.value }
                            })}
                            className="w-full h-8 rounded border cursor-pointer"
                          />
                        </div>

                        {/* Background Types */}
                        <div className="space-y-1">
                          <Label className="text-xs">Arrière-plan</Label>
                          <Tabs defaultValue="solid" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 h-6">
                              <TabsTrigger value="solid" className="text-xs">Uni</TabsTrigger>
                              <TabsTrigger value="gradient" className="text-xs">Dégradé</TabsTrigger>
                              <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="solid" className="mt-2">
                              <input
                                type="color"
                                value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, backgroundColor: e.target.value }
                                })}
                                className="w-full h-8 rounded border cursor-pointer"
                              />
                            </TabsContent>
                            
                            <TabsContent value="gradient" className="mt-2 space-y-2">
                              <div className="grid grid-cols-2 gap-1">
                                <input
                                  type="color"
                                  value={selectedComponent.styles?.gradientStart || '#3b82f6'}
                                  onChange={(e) => {
                                    const start = e.target.value;
                                    const end = selectedComponent.styles?.gradientEnd || '#8b5cf6';
                                    handleComponentUpdate({
                                      ...selectedComponent,
                                      styles: { 
                                        ...selectedComponent.styles, 
                                        background: `linear-gradient(135deg, ${start}, ${end})`,
                                        gradientStart: start,
                                        gradientEnd: end
                                      }
                                    });
                                  }}
                                  className="w-full h-6 rounded border cursor-pointer"
                                />
                                <input
                                  type="color"
                                  value={selectedComponent.styles?.gradientEnd || '#8b5cf6'}
                                  onChange={(e) => {
                                    const start = selectedComponent.styles?.gradientStart || '#3b82f6';
                                    const end = e.target.value;
                                    handleComponentUpdate({
                                      ...selectedComponent,
                                      styles: { 
                                        ...selectedComponent.styles, 
                                        background: `linear-gradient(135deg, ${start}, ${end})`,
                                        gradientStart: start,
                                        gradientEnd: end
                                      }
                                    });
                                  }}
                                  className="w-full h-6 rounded border cursor-pointer"
                                />
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="image" className="mt-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const imageSrc = event.target?.result as string;
                                      handleComponentUpdate({
                                        ...selectedComponent,
                                        styles: { 
                                          ...selectedComponent.styles, 
                                          backgroundImage: `url(${imageSrc})`,
                                          backgroundSize: 'cover',
                                          backgroundRepeat: 'no-repeat'
                                        }
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                                id="bg-image-upload"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-xs w-full"
                                onClick={() => document.getElementById('bg-image-upload')?.click()}
                              >
                                Choisir image
                              </Button>
                            </TabsContent>
                          </Tabs>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-1">
                          <Label className="text-xs">Taille du texte</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[parseInt(selectedComponent.styles?.fontSize?.replace('px', '') || '16')]}
                              onValueChange={([value]) => handleComponentUpdate({
                                ...selectedComponent,
                                styles: { ...selectedComponent.styles, fontSize: `${value}px` }
                              })}
                              max={72}
                              min={8}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-xs w-8 text-center">
                              {parseInt(selectedComponent.styles?.fontSize?.replace('px', '') || '16')}px
                            </span>
                          </div>
                        </div>

                        {/* Image selector for image components */}
                        {selectedComponent.type === 'image' && (
                          <div className="space-y-1">
                            <Label className="text-xs">Image</Label>
                            <div className="flex flex-col gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const imageSrc = event.target?.result as string;
                                      handleComponentUpdate({
                                        ...selectedComponent,
                                        attributes: { ...selectedComponent.attributes, src: imageSrc }
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                                id="image-upload"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => document.getElementById('image-upload')?.click()}
                              >
                                Choisir une image
                              </Button>
                              {selectedComponent.attributes?.src && (
                                <div className="w-full h-16 bg-gray-100 rounded overflow-hidden">
                                  <img
                                    src={selectedComponent.attributes.src}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="layout" className="space-y-3 mt-3">
                        {/* Width & Height */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Largeur</Label>
                            <Input
                              type="number"
                              className="h-7 text-xs"
                              value={selectedComponent.position?.width || 200}
                              onChange={(e) => handleComponentUpdate({
                                ...selectedComponent,
                                position: { 
                                  x: selectedComponent.position?.x || 0,
                                  y: selectedComponent.position?.y || 0,
                                  width: parseInt(e.target.value) || 200,
                                  height: selectedComponent.position?.height || 100
                                }
                              })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Hauteur</Label>
                            <Input
                              type="number"
                              className="h-7 text-xs"
                              value={selectedComponent.position?.height || 100}
                              onChange={(e) => handleComponentUpdate({
                                ...selectedComponent,
                                position: { 
                                  x: selectedComponent.position?.x || 0,
                                  y: selectedComponent.position?.y || 0,
                                  width: selectedComponent.position?.width || 200,
                                  height: parseInt(e.target.value) || 100
                                }
                              })}
                            />
                          </div>
                        </div>

                        {/* Padding */}
                        <div className="space-y-1">
                          <Label className="text-xs">Espacement interne</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[parseInt(selectedComponent.styles?.padding?.replace('px', '') || '8')]}
                              onValueChange={([value]) => handleComponentUpdate({
                                ...selectedComponent,
                                styles: { ...selectedComponent.styles, padding: `${value}px` }
                              })}
                              max={50}
                              min={0}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-xs w-8 text-center">
                              {parseInt(selectedComponent.styles?.padding?.replace('px', '') || '8')}px
                            </span>
                          </div>
                        </div>

                        {/* Border Radius */}
                        <div className="space-y-1">
                          <Label className="text-xs">Arrondi des coins</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[parseInt(selectedComponent.styles?.borderRadius?.replace('px', '') || '0')]}
                              onValueChange={([value]) => handleComponentUpdate({
                                ...selectedComponent,
                                styles: { ...selectedComponent.styles, borderRadius: `${value}px` }
                              })}
                              max={50}
                              min={0}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-xs w-8 text-center">
                              {parseInt(selectedComponent.styles?.borderRadius?.replace('px', '') || '0')}px
                            </span>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Delete button */}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={() => handleComponentDelete(selectedComponent.id)}
                    >
                      Supprimer le composant
                    </Button>
                  </Card>
                </div>
              ) : (
                <Card className="p-3">
                  <p className="text-sm text-gray-600">
                    Sélectionnez un composant pour modifier ses propriétés.
                  </p>
                </Card>
              )}
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
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(components, null, 2)}
                </pre>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Collaboration panel */}
        {showCollaborationPanel && (
          <Card className="fixed top-20 right-4 w-80 bg-white border shadow-lg z-50">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Collaboration</h3>
              <p className="text-sm text-gray-600">
                {collaboration.isConnected ? 'Connecté' : 'Déconnecté'}
              </p>
              <p className="text-sm text-gray-600">
                {collaboration.users.length} utilisateur(s) actif(s)
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
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