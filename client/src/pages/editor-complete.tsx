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

  return (
    <div
      ref={drag}
      className={`p-3 border rounded-lg cursor-move transition-all hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{component.icon}</span>
        <div>
          <p className="font-medium text-sm">{component.name}</p>
          <p className="text-xs text-gray-500">{component.category}</p>
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
      className={`relative w-full h-full min-h-96 bg-white border-2 border-dashed transition-all ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
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

      {/* Drop hint */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-lg font-medium">Glissez des composants ici</p>
            <p className="text-sm">Commencez par faire glisser un composant depuis la palette</p>
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
    
    switch (component.type) {
      case 'heading':
        return <h2 className="text-xl font-bold" style={styles}>{content}</h2>;
      case 'paragraph':
        return <p style={styles}>{content}</p>;
      case 'button':
        return <button className="px-4 py-2 bg-blue-500 text-white rounded" style={styles}>{content}</button>;
      case 'image':
        return <div className="w-32 h-20 bg-gray-200 flex items-center justify-center rounded" style={styles}>
          📷 Image
        </div>;
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
      className={`absolute cursor-move transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
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

    const newComponent = createComponent(type, { x: position.x, y: position.y });
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
          <div className="w-64 border-r bg-white flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold mb-4">Palette de composants</h2>
              <div className="space-y-2">
                {componentTypes.map((component) => (
                  <DraggableComponent
                    key={component.type}
                    component={component}
                  />
                ))}
              </div>
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
          <div className="w-64 border-l bg-white flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold mb-4">Propriétés</h2>
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

                    {/* Basic styles */}
                    <div className="space-y-2 mt-4">
                      <Label>Couleur de texte</Label>
                      <Select 
                        value={selectedComponent.styles?.color || 'black'}
                        onValueChange={(value) => handleComponentUpdate({
                          ...selectedComponent,
                          styles: { ...selectedComponent.styles, color: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="black">Noir</SelectItem>
                          <SelectItem value="blue">Bleu</SelectItem>
                          <SelectItem value="red">Rouge</SelectItem>
                          <SelectItem value="green">Vert</SelectItem>
                          <SelectItem value="purple">Violet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

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