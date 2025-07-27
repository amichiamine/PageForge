import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "@/components/layout/header";
import VisualEditor from "@/components/editor/visual-editor";
import ComponentPalette from "@/components/editor/component-palette";
import PropertiesPanel from "@/components/editor/properties-panel";
import { Save, Eye, Download, Code, Smartphone, Tablet, Monitor, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Project, ComponentDefinition } from "@shared/schema";
import { useLocation } from "wouter";
import CodePreview from "@/components/editor/code-preview";
import { useSidebarContext } from "@/App";

export default function Editor() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { hideMainSidebar, setHideMainSidebar } = useSidebarContext();
  
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showCode, setShowCode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hideComponentPanel, setHideComponentPanel] = useState(false);
  const [hideRightPanel, setHideRightPanel] = useState(false);
  
  // Local state for editor changes before saving
  const [localProject, setLocalProject] = useState<Project | null>(null);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Sync local project with server project when it loads
  React.useEffect(() => {
    if (project && !localProject) {
      setLocalProject(project);
    }
  }, [project, localProject]);

  const saveProjectMutation = useMutation({
    mutationFn: async (updates: { content: any }) => {
      if (!projectId) throw new Error("No project ID");
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      toast({
        title: "Projet sauvegardé",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le projet.",
        variant: "destructive",
      });
    },
  });

  const exportProjectMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error("No project ID");
      
      const response = await fetch(`/api/projects/${projectId}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const exportData = await response.json();
      
      // Download each file individually
      if (exportData.files && Array.isArray(exportData.files)) {
        exportData.files.forEach((file: { path: string; content: string }) => {
          const blob = new Blob([file.content], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.path;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      } else {
        // Fallback: download as single JSON file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${localProject?.name || 'project'}-export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      return exportData;
    },
    onSuccess: (data) => {
      const fileCount = data.files?.length || 1;
      toast({
        title: "Export réussi",
        description: `${fileCount} fichier(s) téléchargé(s) avec succès.`,
      });
    },
    onError: (error) => {
      console.error("Export error:", error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le projet.",
        variant: "destructive",
      });
    },
  });

  const handleComponentUpdate = (updatedProjectOrComponent: Project | ComponentDefinition) => {
    if (!localProject) return;

    // If it's a Project, update local state only
    if ('content' in updatedProjectOrComponent && 'name' in updatedProjectOrComponent) {
      setLocalProject(updatedProjectOrComponent as Project);
      return;
    }

    // If it's a ComponentDefinition, update in structure
    const component = updatedProjectOrComponent as ComponentDefinition;
    const updateComponent = (components: ComponentDefinition[]): ComponentDefinition[] => {
      return components.map(comp => {
        if (comp.id === component.id) {
          return component;
        }
        if (comp.children) {
          return { ...comp, children: updateComponent(comp.children) };
        }
        return comp;
      });
    };

    const updatedContent = {
      ...localProject.content,
      pages: localProject.content.pages?.map(page => ({
        ...page,
        content: {
          ...page.content,
          structure: updateComponent(page.content.structure || [])
        }
      }))
    };

    setLocalProject({
      ...localProject,
      content: updatedContent
    });
  };

  const handleSave = () => {
    if (localProject) {
      console.log("Saving project:", localProject.name);
      console.log("Project content:", localProject.content);
      console.log("Has pages:", localProject.content?.pages?.length || 0);
      
      // Ensure content structure is valid
      const contentToSave = {
        ...localProject.content,
        pages: localProject.content?.pages || [{
          id: "main-page",
          name: "index",
          path: "/",
          content: {
            structure: localProject.content?.pages?.[0]?.content?.structure || [],
            styles: localProject.content?.pages?.[0]?.content?.styles || "",
            scripts: localProject.content?.pages?.[0]?.content?.scripts || ""
          }
        }]
      };
      
      console.log("Saving content:", contentToSave);
      saveProjectMutation.mutate({ content: contentToSave });
    } else {
      console.error("No local project to save");
    }
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case "mobile":
        return "max-w-sm";
      case "tablet":
        return "max-w-2xl";
      default:
        return "w-full";
    }
  };

  // Generate HTML preview - use localProject for current state
  const generatePreviewHTML = (projectToPreview: Project) => {
    const currentPage = projectToPreview.content?.pages?.[0];
    if (!currentPage) return "<p>Aucun contenu à prévisualiser</p>";
    
    const renderComponent = (component: ComponentDefinition): string => {
      const Tag = component.tag || 'div';
      const styleString = component.styles ? 
        Object.entries(component.styles)
          .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
          .join('; ') : '';
      
      const attributes = component.attributes || {};
      const attrString = Object.entries(attributes)
        .filter(([key]) => key !== 'className')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
        
      const className = attributes.className || '';
      
      const children = component.children?.map(renderComponent).join('') || '';
      const content = component.content || '';
      
      return `<${Tag} ${attrString} class="${className}" style="${styleString}">${content}${children}</${Tag}>`;
    };
    
    const bodyContent = currentPage.content.structure?.map(renderComponent).join('') || '';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Aperçu - ${projectToPreview.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
            ${currentPage.content.styles || ''}
          </style>
        </head>
        <body>
          ${bodyContent}
        </body>
      </html>
    `;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'éditeur...</p>
        </div>
      </div>
    );
  }

  if (!localProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Projet non trouvé</h2>
          <p className="text-gray-600 mb-4">Le projet demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => setLocation("/projects")}>
            Retour aux projets
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Header 
        title={`Éditeur - ${localProject.name}`}
        subtitle={localProject.description || "Éditeur visuel"}
        actions={
          <div className="flex items-center space-x-2">
            {/* Viewport toggles */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("mobile")}
                className="rounded-none"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("tablet")}
                className="rounded-none"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("desktop")}
                className="rounded-none"
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Toggling main sidebar, current:", hideMainSidebar);
                const newValue = !hideMainSidebar;
                setHideMainSidebar(newValue);
                console.log("Set to:", newValue);
              }}
              title={hideMainSidebar ? "Afficher la navigation principale" : "Masquer la navigation principale"}
            >
              {hideMainSidebar ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setHideComponentPanel(!hideComponentPanel)}
              title="Masquer/Afficher le menu des composants"
            >
              {hideComponentPanel ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setHideRightPanel(!hideRightPanel)}
              title="Masquer/Afficher les propriétés"
            >
              {hideRightPanel ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              title="Aperçu"
            >
              <Eye className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCode(!showCode)}
              title="Code source"
            >
              <Code className="w-4 h-4 mr-2" />
              Code
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Save button clicked, localProject:", localProject?.name);
                handleSave();
              }}
              disabled={saveProjectMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveProjectMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => exportProjectMutation.mutate()}
              disabled={exportProjectMutation.isPending}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>


          </div>
        }
      />

      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 flex overflow-hidden">
          {/* Component Palette */}
          {!hideComponentPanel && (
            <div className="w-64 bg-gray-900 border-r border-gray-700 overflow-y-auto">
              <ComponentPalette />
            </div>
          )}

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {showPreview ? (
              <div className="flex-1 overflow-auto bg-gray-100 p-4">
                <div className={`mx-auto bg-white shadow-lg transition-all duration-300 ${getViewportClass()}`}>
                  <iframe
                    title="Preview"
                    className="w-full h-full border-0"
                    srcDoc={generatePreviewHTML(localProject)}
                  />
                </div>
              </div>
            ) : showCode ? (
              <div className="flex-1 overflow-auto bg-gray-900 text-white p-4">
                <CodePreview project={localProject} />
              </div>
            ) : (
              <div className="flex-1 overflow-auto bg-gray-100 p-4">
                <div className={`mx-auto bg-white shadow-lg transition-all duration-300 ${getViewportClass()}`}>
                  <VisualEditor
                    project={localProject}
                    selectedComponent={selectedComponent}
                    onComponentSelect={setSelectedComponent}
                    onComponentUpdate={handleComponentUpdate}
                    showCode={showCode}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Properties Panel */}
          {!hideRightPanel && (
            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <PropertiesPanel
                component={selectedComponent}
                onComponentUpdate={handleComponentUpdate}
                project={localProject}
                onComponentSelect={setSelectedComponent}
                onComponentDelete={(componentId) => {
                  if (!localProject) return;
                  
                  const removeFromStructure = (components: ComponentDefinition[]): ComponentDefinition[] => {
                    return components.filter(comp => comp.id !== componentId)
                      .map(comp => ({
                        ...comp,
                        children: comp.children ? removeFromStructure(comp.children) : []
                      }));
                  };

                  const updatedStructure = removeFromStructure(localProject.content?.pages?.[0]?.content?.structure || []);
                  
                  const updatedProject = {
                    ...localProject,
                    content: {
                      ...localProject.content,
                      pages: localProject.content?.pages?.map((page, index) => 
                        index === 0 ? {
                          ...page,
                          content: {
                            ...page.content,
                            structure: updatedStructure
                          }
                        } : page
                      ) || []
                    }
                  };
                  
                  setLocalProject(updatedProject);
                  
                  // Clear selection if deleted component was selected
                  if (selectedComponent?.id === componentId) {
                    setSelectedComponent(null);
                  }
                }}
              />
            </div>
          )}
        </div>
      </DndProvider>
    </>
  );
}
