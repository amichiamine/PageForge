import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, Save, Eye, Download, Settings,
  Trash2, Menu
} from 'lucide-react';

import { enhancedComponentDefinitions } from '@/lib/enhanced-component-definitions';
import VisualEditor from '@/components/editor/visual-editor';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ComponentDefinition, Project } from '@shared/schema';

export default function EditorWorking() {
  const [, params] = useRoute('/editor/:id');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isMobile } = useIsMobile();

  // État de l'interface
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null);
  const [leftPanelVisible, setLeftPanelVisible] = useState(!isMobile);
  const [rightPanelVisible, setRightPanelVisible] = useState(!isMobile);

  // Données du projet
  const { data: project, isLoading } = useQuery({
    queryKey: ['/api/projects', params?.id],
    enabled: !!params?.id
  }) as { data: Project | undefined, isLoading: boolean };

  // Mutations
  const updateProject = useMutation({
    mutationFn: async (updatedProject: Partial<Project>) => {
      const response = await fetch(`/api/projects/${params?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject)
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', params?.id] });
    }
  });

  // Gestion des composants
  const handleComponentUpdate = (updatedComponent: ComponentDefinition) => {
    if (!project || !selectedComponent) return;
    
    const currentContent = project.content as any;
    const updatedComponents = (currentContent.components || []).map((comp: any) => 
      comp.id === updatedComponent.id ? updatedComponent : comp
    );
    
    updateProject.mutate({
      content: {
        ...currentContent,
        components: updatedComponents
      }
    });
    
    setSelectedComponent(updatedComponent);
  };

  const handleComponentDelete = (componentId: string) => {
    if (!project) return;
    
    const currentContent = project.content as any;
    const updatedComponents = (currentContent.components || []).filter((comp: any) => comp.id !== componentId);
    
    updateProject.mutate({
      content: {
        ...currentContent,
        components: updatedComponents
      }
    });
    
    setSelectedComponent(null);
  };

  const handleAddComponent = (componentDefinition: ComponentDefinition) => {
    if (!project) return;
    
    const newComponent: ComponentDefinition = {
      ...componentDefinition,
      id: `component-${Date.now()}`,
      position: {
        x: Math.random() * 300,
        y: Math.random() * 200,
        width: componentDefinition.position?.width || 200,
        height: componentDefinition.position?.height || 100
      }
    };
    
    const currentContent = project.content as any;
    updateProject.mutate({
      content: {
        ...currentContent,
        components: [...(currentContent.components || []), newComponent]
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Projet non trouvé</p>
          <Button onClick={() => setLocation('/projects')}>
            Retour aux projets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="h-12 sm:h-14 border-b bg-white flex items-center justify-between px-2 sm:px-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/projects')}
              className="text-xs sm:text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Projets
            </Button>
            <span className="text-sm font-medium">{project.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Controls mobiles */}
            {isMobile && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLeftPanelVisible(!leftPanelVisible)}
                  className="text-xs"
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightPanelVisible(!rightPanelVisible)}
                  className="text-xs"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </>
            )}

            <Button variant="outline" size="sm" className="text-xs">
              <Save className="w-4 h-4 mr-1" />
              Sauvegarder
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Eye className="w-4 h-4 mr-1" />
              Aperçu
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="w-4 h-4 mr-1" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Component palette */}
          <div className={`${isMobile && !leftPanelVisible ? 'hidden' : 'w-48'} border-r bg-white flex-shrink-0 overflow-y-auto`}>
            <div className="p-4">
              <h2 className="text-sm font-semibold mb-3">Composants</h2>
              <div className="grid grid-cols-1 gap-2">
                {enhancedComponentDefinitions.map((component) => (
                  <Button
                    key={component.type}
                    variant="outline"
                    size="sm"
                    className="h-10 text-xs justify-start"
                    onClick={() => handleAddComponent({
                      ...component,
                      id: `component-${Date.now()}`
                    })}
                  >
                    {component.type}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Visual Editor */}
          <div className="flex-1 relative overflow-hidden">
            <VisualEditor
              project={project}
              selectedComponent={selectedComponent}
              onComponentSelect={setSelectedComponent}
              onComponentUpdate={(updatedProject: Project) => {
                updateProject.mutate({
                  content: updatedProject.content
                });
              }}
            />
          </div>

          {/* Right sidebar - Properties panel */}
          <div className={`${isMobile && !rightPanelVisible ? 'hidden' : 'w-80'} border-l bg-white flex-shrink-0 overflow-y-auto`}>
            <div className="p-4">
              {selectedComponent ? (
                <Card className="p-4">
                  <h3 className="font-medium mb-4 text-sm">Propriétés du composant</h3>
                  <div className="space-y-4">
                    {/* Type */}
                    <div>
                      <Label className="text-sm">Type</Label>
                      <p className="text-xs text-gray-600 mt-1">{selectedComponent.type}</p>
                    </div>

                    {/* Contenu */}
                    <div>
                      <Label className="text-sm">Contenu</Label>
                      <Input
                        type="text"
                        value={selectedComponent.content || ''}
                        onChange={(e) => handleComponentUpdate({
                          ...selectedComponent,
                          content: e.target.value
                        })}
                        placeholder="Contenu du composant..."
                        className="mt-1"
                      />
                    </div>

                    {/* Position */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Position X</Label>
                        <Input
                          type="number"
                          value={selectedComponent.position?.x || 0}
                          onChange={(e) => handleComponentUpdate({
                            ...selectedComponent,
                            position: { 
                              ...selectedComponent.position,
                              x: parseInt(e.target.value) || 0,
                              y: selectedComponent.position?.y || 0,
                              width: selectedComponent.position?.width || 200,
                              height: selectedComponent.position?.height || 100
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Position Y</Label>
                        <Input
                          type="number"
                          value={selectedComponent.position?.y || 0}
                          onChange={(e) => handleComponentUpdate({
                            ...selectedComponent,
                            position: { 
                              ...selectedComponent.position,
                              x: selectedComponent.position?.x || 0,
                              y: parseInt(e.target.value) || 0,
                              width: selectedComponent.position?.width || 200,
                              height: selectedComponent.position?.height || 100
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Largeur</Label>
                        <Input
                          type="number"
                          value={selectedComponent.position?.width || 200}
                          onChange={(e) => handleComponentUpdate({
                            ...selectedComponent,
                            position: { 
                              ...selectedComponent.position,
                              x: selectedComponent.position?.x || 0,
                              y: selectedComponent.position?.y || 0,
                              width: parseInt(e.target.value) || 200,
                              height: selectedComponent.position?.height || 100
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Hauteur</Label>
                        <Input
                          type="number"
                          value={selectedComponent.position?.height || 100}
                          onChange={(e) => handleComponentUpdate({
                            ...selectedComponent,
                            position: { 
                              ...selectedComponent.position,
                              x: selectedComponent.position?.x || 0,
                              y: selectedComponent.position?.y || 0,
                              width: selectedComponent.position?.width || 200,
                              height: parseInt(e.target.value) || 100
                            }
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Styles de base */}
                    <div>
                      <Label className="text-sm">Couleur de fond</Label>
                      <input
                        type="color"
                        value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                        onChange={(e) => handleComponentUpdate({
                          ...selectedComponent,
                          styles: { 
                            ...selectedComponent.styles, 
                            backgroundColor: e.target.value 
                          }
                        })}
                        className="w-full h-10 rounded border cursor-pointer mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Couleur du texte</Label>
                      <input
                        type="color"
                        value={selectedComponent.styles?.color || '#000000'}
                        onChange={(e) => handleComponentUpdate({
                          ...selectedComponent,
                          styles: { 
                            ...selectedComponent.styles, 
                            color: e.target.value 
                          }
                        })}
                        className="w-full h-10 rounded border cursor-pointer mt-1"
                      />
                    </div>

                    {/* Bouton supprimer */}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleComponentDelete(selectedComponent.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer le composant
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-4">
                  <p className="text-sm text-gray-500">Aucun composant sélectionné</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Cliquez sur un composant dans le canvas pour voir ses propriétés.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}