import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "@/components/layout/header";
import VisualEditor from "@/components/editor/visual-editor";
import ComponentPalette from "@/components/editor/component-palette";
import PropertiesPanel from "@/components/editor/properties-panel";
import { Save, Eye, Download, Code, Smartphone, Tablet, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Project, ComponentDefinition } from "@shared/schema";

export default function Editor() {
  const { projectId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showCode, setShowCode] = useState(false);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (updates: { content: any }) => {
      if (!projectId) throw new Error("No project ID");
      return apiRequest("PATCH", `/api/projects/${projectId}`, updates);
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
      const response = await apiRequest("POST", `/api/projects/${projectId}/export`);
      return response.json();
    },
    onSuccess: (data) => {
      // Download the exported files
      data.files.forEach((file: { path: string; content: string }) => {
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
      
      toast({
        title: "Export réussi",
        description: `${data.files.length} fichiers exportés avec succès.`,
      });
    },
    onError: () => {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le projet.",
        variant: "destructive",
      });
    },
  });

  const handleComponentUpdate = (component: ComponentDefinition) => {
    if (!project) return;
    
    // Update the component in the project structure
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
      ...project.content,
      pages: project.content.pages?.map(page => ({
        ...page,
        content: {
          ...page.content,
          structure: updateComponent(page.content.structure || [])
        }
      }))
    };

    saveProjectMutation.mutate({ content: updatedContent });
  };

  const handleSave = () => {
    if (project) {
      saveProjectMutation.mutate({ content: project.content });
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

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Projet non trouvé</h2>
          <p className="text-gray-600">Le projet demandé n'existe pas ou a été supprimé.</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Header 
        title={`Éditeur - ${project.name}`}
        subtitle={project.description || "Éditeur visuel"}
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
              onClick={() => setShowCode(!showCode)}
            >
              <Code className="w-4 h-4 mr-2" />
              Code
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saveProjectMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
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

            <Button size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
          </div>
        }
      />

      <DndProvider backend={HTML5Backend}>
        <div className="flex-1 flex overflow-hidden">
          {/* Component Palette */}
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <ComponentPalette />
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              <div className={`mx-auto bg-white shadow-lg transition-all duration-300 ${getViewportClass()}`}>
                <VisualEditor
                  project={project}
                  selectedComponent={selectedComponent}
                  onComponentSelect={setSelectedComponent}
                  onComponentUpdate={handleComponentUpdate}
                  showCode={showCode}
                />
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <PropertiesPanel
              component={selectedComponent}
              onComponentUpdate={handleComponentUpdate}
            />
          </div>
        </div>
      </DndProvider>
    </>
  );
}
