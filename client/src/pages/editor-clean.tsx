import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { 
  Menu, Save, Eye, Download, Smartphone, Tablet, Monitor,
  ChevronLeft, ChevronRight, Settings, Upload
} from 'lucide-react';

import { enhancedComponentDefinitions } from '@/lib/enhanced-component-definitions';
import EnhancedImageSelector from '@/components/editor/enhanced-image-selector';
import ColorPicker from '@/components/editor/color-picker';
import EnhancedPropertiesPanel from '@/components/editor/enhanced-properties-panel-fixed';
import VisualEditor from '@/components/editor/visual-editor';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ComponentDefinition, Project } from '@shared/schema';

export default function EditorClean() {
  const [, params] = useRoute('/editor/:id');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isMobile } = useIsMobile();

  // État de l'interface
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null);
  const [leftPanelVisible, setLeftPanelVisible] = useState(!isMobile);
  const [rightPanelVisible, setRightPanelVisible] = useState(!isMobile);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [pageBackground, setPageBackground] = useState('#ffffff');
  const [pageBackgroundType, setPageBackgroundType] = useState<'solid' | 'gradient' | 'image'>('solid');

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
    if (!project) return;
    
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
          <div className="text-sm sm:text-base font-medium truncate">
            {project.name}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Contrôles de panneaux pour mobile */}
          {isMobile && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftPanelVisible(!leftPanelVisible)}
                className="h-8 w-8 p-0"
                title="Palette de composants"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightPanelVisible(!rightPanelVisible)}
                className="h-8 w-8 p-0"
                title="Propriétés"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Sauvegarder
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Aperçu
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Component palette */}
        <div className={`${isMobile && !leftPanelVisible ? 'hidden' : 'w-28 sm:w-32 md:w-36'} border-r bg-white flex-shrink-0 overflow-y-auto`}>
          <div className="p-1 sm:p-2">
            <h2 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Composants</h2>
            <div className="grid grid-cols-1 gap-1 sm:gap-2">
              {enhancedComponentDefinitions.map((component) => (
                <Button
                  key={component.type}
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-10 text-xs flex flex-col items-center p-1"
                  onClick={() => handleAddComponent({
                    ...component,
                    id: `component-${Date.now()}`
                  })}
                >
                  <span className="text-xs sm:text-sm">{component.type}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Visual Editor */}
        <div className="flex-1 relative overflow-hidden">
          <VisualEditor
            components={(project.content as any).components || []}
            selectedComponent={selectedComponent}
            onComponentSelect={setSelectedComponent}
            onComponentUpdate={(component: ComponentDefinition) => handleComponentUpdate(component)}
            onComponentDelete={handleComponentDelete}
            onAddComponent={handleAddComponent}
            pageBackground={pageBackground}
          />
        </div>

        {/* Right sidebar - Properties panel */}
        <div className={`${isMobile && !rightPanelVisible ? 'hidden' : 'w-28 sm:w-32 md:w-36'} border-l bg-white flex-shrink-0 overflow-y-auto`}>
          <div className="p-1 sm:p-2">
            <Tabs defaultValue="component" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-6 sm:h-8">
                <TabsTrigger value="component" className="text-xs sm:text-sm">Composant</TabsTrigger>
                <TabsTrigger value="page" className="text-xs sm:text-sm">Page</TabsTrigger>
              </TabsList>
              
              {/* Panneau de propriétés massif pour les composants */}
              <TabsContent value="component" className="mt-2 h-full">
                <EnhancedPropertiesPanel
                  component={selectedComponent}
                  onComponentUpdate={handleComponentUpdate}
                  project={project}
                  onComponentSelect={setSelectedComponent}
                  onComponentDelete={handleComponentDelete}
                  className="h-full"
                />
              </TabsContent>
              
              {/* Propriétés de la page */}
              <TabsContent value="page" className="mt-2 space-y-3">
                <h2 className="text-xs font-semibold">Propriétés de la page</h2>
                
                <div className="space-y-2">
                  <Label className="text-xs">Arrière-plan de la page</Label>
                  <ColorPicker
                    value={pageBackground}
                    onChange={(color: string) => {
                      setPageBackground(color);
                      document.body.style.background = color;
                    }}
                    type={pageBackgroundType}
                    showBackgroundTypes={true}
                  />
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Type d'arrière-plan</Label>
                    <Select 
                      value={pageBackgroundType} 
                      onValueChange={(value: 'solid' | 'gradient' | 'image') => setPageBackgroundType(value)}
                    >
                      <SelectTrigger className="h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Couleur unie</SelectItem>
                        <SelectItem value="gradient">Dégradé</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Image Selector Modal */}
      {showImageSelector && (
        <EnhancedImageSelector
          isOpen={showImageSelector}
          onImageSelect={(imageUrl: any) => {
            if (selectedComponent) {
              handleComponentUpdate({
                ...selectedComponent,
                attributes: { 
                  ...selectedComponent.attributes, 
                  src: typeof imageUrl === 'string' ? imageUrl : imageUrl.src
                }
              });
            }
            setShowImageSelector(false);
          }}
          onClose={() => setShowImageSelector(false)}
        />
      )}
    </div>
  );
}