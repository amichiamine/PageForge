import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend } from 'react-dnd-multi-backend';
import { useCollaboration } from '@/hooks/useCollaboration';
import { CollaborationButton } from '@/components/collaboration/collaboration-button';
import { CollaborationPanel } from '@/components/collaboration/collaboration-panel';
import { UserCursors, ComponentHighlight } from '@/components/collaboration/user-cursors';
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/header";
import VisualEditor from "@/components/editor/visual-editor";
import EnhancedComponentPalette from "@/components/editor/enhanced-component-palette";
import EnhancedPropertiesPanel from "@/components/editor/enhanced-properties-panel";
import FloatingControls from "@/components/editor/floating-controls";
import { Save, Eye, Download, Code, Upload, Globe, Database, Server, Wifi, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project, ComponentDefinition } from "@shared/schema";
import { createComponent } from "@/lib/editor-utils";
import { useLocation } from "wouter";
import CodePreview from "@/components/editor/code-preview";
import { useSidebarContext } from "@/App";
import ErrorNotification from "@/components/ui/error-notification";
import AlignmentGuides from "@/components/editor/alignment-guides";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

export default function EditorFixed() {
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
  const [showFloatingControls, setShowFloatingControls] = useState(false);
  const [showAlignmentGuides, setShowAlignmentGuides] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

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
    if (project?.content?.pages?.[currentPageIndex]?.content?.structure) {
      setComponents(project.content.pages[currentPageIndex].content.structure);
    } else {
      setComponents([]);
    }
  }, [project, currentPageIndex]);

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
  const handleComponentAdd = useCallback((type: string, position?: { x: number; y: number }) => {
    if (!project) return;

    const newComponent = createComponent(type, position);
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    setSelectedComponent(newComponent);
    setIsDirty(true);

    // Update project
    const updatedProject = { ...project };
    if (!updatedProject.content) updatedProject.content = { pages: [] };
    if (!updatedProject.content.pages) updatedProject.content.pages = [];
    
    if (updatedProject.content.pages[currentPageIndex]) {
      updatedProject.content.pages[currentPageIndex].content.structure = updatedComponents;
    }

    saveProjectMutation.mutate({ content: updatedProject.content });
  }, [components, project, currentPageIndex, saveProjectMutation]);

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

    const updatedProject = { ...project };
    if (!updatedProject.content) updatedProject.content = { pages: [] };
    if (!updatedProject.content.pages) updatedProject.content.pages = [];
    
    if (updatedProject.content.pages[currentPageIndex]) {
      updatedProject.content.pages[currentPageIndex].content.structure = components;
    }

    saveProjectMutation.mutate({ content: updatedProject.content });
  }, [project, components, currentPageIndex, saveProjectMutation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-theme-text">Chargement du projet...</p>
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
      <div className="h-full flex flex-col bg-theme-background overflow-hidden">
        {/* Header */}
        <Header 
          title={project.name}
          subtitle={`${project.type} • ${project.content?.pages?.length || 0} page(s)`}
          actions={
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/projects")}
                className="text-theme-text-secondary hover:text-theme-text"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Projets
              </Button>

              {/* Project type badge */}
              <Badge variant="secondary">
                {project.type === 'single-page' && 'Page unique'}
                {project.type === 'multi-page' && 'Multi-pages'}
                {project.type === 'ftp-sync' && 'Sync FTP'}
                {project.type === 'ftp-upload' && 'Upload FTP'}
              </Badge>

              <Separator orientation="vertical" className="h-6" />

              {/* Collaboration status */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCollaborationPanel(!showCollaborationPanel)}
              >
                <Wifi className="w-4 h-4 mr-2" />
                {collaboration.isConnected ? 'Connecté' : 'Déconnecté'}
              </Button>

              {/* Action buttons */}
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
          <div className="w-64 border-r border-theme-border bg-theme-surface flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-theme-text mb-3">Composants</h2>
              <div className="space-y-2">
                {['Titre', 'Paragraphe', 'Image', 'Bouton', 'Container', 'Liste', 'Card'].map((component) => (
                  <Card 
                    key={component} 
                    className="p-3 hover:bg-theme-surface-elevated cursor-pointer transition-colors"
                    onClick={() => handleComponentAdd(component.toLowerCase())}
                  >
                    <p className="text-sm text-theme-text">{component}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Visual editor */}
          <div className="flex-1 flex flex-col relative">
            <div className="flex-1 overflow-auto p-4">
              <Card className="min-h-96 p-8 bg-white relative">
                <div className="text-center text-gray-500">
                  <h2 className="text-2xl font-bold mb-4">Éditeur visuel</h2>
                  <p className="mb-4">Projet "{project.name}" - {components.length} composant(s)</p>
                  
                  {/* Components list */}
                  {components.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <h3 className="font-semibold">Composants dans cette page :</h3>
                      {components.map((component, index) => (
                        <Card 
                          key={component.id}
                          className={`p-4 cursor-pointer transition-colors ${
                            selectedComponent?.id === component.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedComponent(component)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{component.type}</span>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComponentDelete(component.id);
                              }}
                            >
                              Supprimer
                            </Button>
                          </div>
                          {component.content && (
                            <p className="text-sm text-gray-600 mt-2 truncate">
                              {component.content}
                            </p>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}

                  {components.length === 0 && (
                    <p className="text-sm mt-8">
                      Cliquez sur un composant dans la palette de gauche pour commencer.
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Right sidebar - Properties panel */}
          <div className="w-64 border-l border-theme-border bg-theme-surface flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-theme-text mb-3">Propriétés</h2>
              {selectedComponent ? (
                <div className="space-y-4">
                  <Card className="p-3">
                    <h3 className="font-medium mb-2">Composant sélectionné</h3>
                    <p className="text-sm text-theme-text-secondary mb-3">
                      Type: {selectedComponent.type}
                    </p>
                    
                    {/* Content editor */}
                    <div className="space-y-2">
                      <Label htmlFor="content">Contenu</Label>
                      <Input
                        id="content"
                        value={selectedComponent.content || ''}
                        onChange={(e) => handleComponentUpdate({
                          ...selectedComponent,
                          content: e.target.value
                        })}
                        placeholder="Contenu du composant..."
                      />
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
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="p-3">
                  <p className="text-sm text-theme-text-secondary">
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
          <Card className="fixed top-20 right-4 w-80 bg-theme-surface border shadow-lg z-50">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Collaboration</h3>
              <p className="text-sm text-theme-text-secondary">
                {collaboration.isConnected ? 'Connecté' : 'Déconnecté'}
              </p>
              <p className="text-sm text-theme-text-secondary">
                {collaboration.users.length} utilisateur(s) actif(s)
              </p>
            </div>
          </Card>
        )}
      </div>
    </DndProvider>
  );
}