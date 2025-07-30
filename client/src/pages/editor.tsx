import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend, MultiBackendOptions } from 'react-dnd-multi-backend';
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/header";
import VisualEditor from "@/components/editor/visual-editor";
import ComponentPalette from "@/components/editor/component-palette";
import PropertiesPanel from "@/components/editor/properties-panel";
import { Save, Eye, Download, Code, Smartphone, Tablet, Monitor, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Grid, Layers, Settings, Undo, Redo, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Project, ComponentDefinition } from "@shared/schema";
import { useLocation } from "wouter";
import CodePreview from "@/components/editor/code-preview";
import { useSidebarContext } from "@/App";
import ErrorNotification from "@/components/ui/error-notification";
import AlignmentGuides from "@/components/editor/alignment-guides";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Fonction utilitaire pour générer le HTML de prévisualisation
function generatePreviewHTML(project: Project): string {
  const currentPage = project.content?.pages?.[0];
  const pageStructure = currentPage?.content?.structure || [];

  const renderComponent = (component: ComponentDefinition, indent: number = 2): string => {
    const styles = component.styles || {};
    const attributes = component.attributes || {};
    const { className, ...otherAttributes } = attributes;

    const styleString = Object.entries(styles)
      .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');

    const attributeString = Object.entries(otherAttributes)
      .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    const tag = component.tag || 'div';
    const classAttr = className ? `class="${className}"` : '';
    const indentStr = ' '.repeat(indent);
    const childIndentStr = ' '.repeat(indent + 2);

    // Construire la balise ouvrante avec un formatage propre
    const openingTagParts = [
      tag,
      classAttr,
      attributeString,
      styleString ? `style="${styleString}"` : ''
    ].filter(part => part.trim().length > 0);

    const openingTag = `<${openingTagParts.join(' ')}>`;

    if (component.type === 'image') {
      if (attributes.src) {
        return `${indentStr}<img src="${attributes.src}" alt="${attributes.alt || ''}" ${classAttr} ${styleString ? `style="${styleString}"` : ''} />`;
      } else {
        return `${indentStr}<div ${classAttr} ${styleString ? `style="${styleString}"` : ''}>\n${childIndentStr}Image\n${indentStr}</div>`;
      }
    }

    // Contenu et enfants avec formatage amélioré
    const content = component.content || '';
    const children = component.children?.map(child => renderComponent(child, indent + 2)).join('\n') || '';

    if (content && children) {
      return `${indentStr}${openingTag}\n${childIndentStr}${content}\n${children}\n${indentStr}</${tag}>`;
    } else if (content) {
      return `${indentStr}${openingTag}\n${childIndentStr}${content}\n${indentStr}</${tag}>`;
    } else if (children) {
      return `${indentStr}${openingTag}\n${children}\n${indentStr}</${tag}>`;
    } else {
      return `${indentStr}${openingTag}</${tag}>`;
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${currentPage?.content?.meta?.title || project.name}</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; min-height: 100vh; position: relative; }
        ${currentPage?.content?.styles || ''}
      </style>
    </head>
    <body>
      <div class="container">
${pageStructure.map(component => renderComponent(component, 4)).join('\n')}
      </div>
      <script>${currentPage?.content?.scripts || ''}</script>
    </body>
    </html>
  `;
}

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlignmentGuides, setShowAlignmentGuides] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [undoStack, setUndoStack] = useState<Project[]>([]);
  const [redoStack, setRedoStack] = useState<Project[]>([]);

  // Mobile detection
  const { isMobile, isTablet, isMobileOrTablet } = useIsMobile();

  // Local state for editor changes before saving
  const [localProject, setLocalProject] = useState<Project | null>(null);

  // Auto-hide panels on mobile
  useEffect(() => {
    if (isMobile) {
      setHideComponentPanel(true);
      setHideRightPanel(true);
    }
  }, [isMobile]);

  const { data: project, isLoading: isProjectLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Synchronize server project with local state
  useEffect(() => {
    if (project && (!localProject || project.id !== localProject.id)) {
      setLocalProject(project);
      setHasUnsavedChanges(false);
      setUndoStack([]);
      setRedoStack([]);
    }
  }, [project, localProject]);

  const saveMutation = useMutation({
    mutationFn: async (projectData: Project) => {
      // Ensure description is never null and clean up the data
      const cleanedProjectData = {
        ...projectData,
        description: projectData.description || "",
        // Ensure all required fields are present
        name: projectData.name || "Untitled Project",
        type: projectData.type || "standalone",
        content: projectData.content || {},
        settings: projectData.settings || {}
      };
      return apiRequest("PATCH", `/api/projects/${projectData.id}`, cleanedProjectData);
    },
    onSuccess: () => {
      setHasUnsavedChanges(false);
      toast({
        title: "Projet sauvegardé",
        description: "Vos modifications ont été enregistrées avec succès.",
      });

      // Refresh queries after successful save
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      }, 100);
    },
    onError: (error) => {
      console.error("Save failed:", error);
      setErrorMessage("Erreur lors de la sauvegarde du projet");
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le projet.",
        variant: "destructive",
      });
    },
  });

  const handleSave = useCallback(async () => {
    if (!localProject) return;

    await saveMutation.mutateAsync(localProject);
  }, [localProject, saveMutation]);

  // Auto-save functionality (disabled by default)
  useEffect(() => {
    if (!autoSaveEnabled || !hasUnsavedChanges || !localProject) return;

    const autoSaveTimer = setTimeout(() => {
      saveMutation.mutate(localProject);
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [localProject, hasUnsavedChanges, autoSaveEnabled, saveMutation]);

  const handleComponentUpdate = useCallback((updatedProject: Project) => {
    // Add current state to undo stack
    if (localProject) {
      setUndoStack(prev => [...prev.slice(-19), localProject]); // Keep last 20 states
      setRedoStack([]); // Clear redo stack on new change
    }

    setLocalProject(updatedProject);
    setHasUnsavedChanges(true);
  }, [localProject]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || !localProject) return;

    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, localProject]);
    setUndoStack(prev => prev.slice(0, -1));
    setLocalProject(previousState);
    setHasUnsavedChanges(true);
  }, [undoStack, localProject]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    if (localProject) {
      setUndoStack(prev => [...prev, localProject]);
    }
    setRedoStack(prev => prev.slice(0, -1));
    setLocalProject(nextState);
    setHasUnsavedChanges(true);
  }, [redoStack, localProject]);

  const getViewportClass = () => {
    switch (viewMode) {
      case "mobile": return "w-full max-w-sm";
      case "tablet": return "w-full max-w-2xl";
      default: return "w-full";
    }
  };

  if (isProjectLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Chargement de l'éditeur...</p>
        </div>
      </div>
    );
  }

  if (!localProject) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="p-8 text-center shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Projet introuvable</h2>
          <p className="text-gray-600 mb-4">Le projet demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => setLocation("/projects")} className="rounded-lg">
            Retour aux projets
          </Button>
        </Card>
      </div>
    );
  }

  // Configuration du multi-backend pour le drag and drop
  const backendOptions: MultiBackendOptions = {
    backends: [
      {
        id: 'html5',
        backend: HTML5Backend,
        transition: { 
          type: 'pointer',
          options: {
            pointerTypes: ['mouse']
          }
        }
      },
      {
        id: 'touch',
        backend: TouchBackend,
        options: {
          enableMouseEvents: true,
          delayTouchStart: isMobileOrTablet ? 100 : 150,
          delayMouseStart: 0,
          touchSlop: isMobileOrTablet ? 15 : 20,
          enableTouchEvents: true,
          enableKeyboardEvents: false,
          scrollAngleRanges: [
            { start: 30, end: 150 },
            { start: 210, end: 330 }
          ],
          ignoreContextMenu: true,
          enableHoverOutsideTarget: false
        },
        preview: true,
        transition: {
          type: 'pointer',
          options: {
            pointerTypes: ['touch', 'pen']
          }
        }
      }
    ]
  };

  return (
    <DndProvider backend={MultiBackend} options={backendOptions}>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {errorMessage && (
          <ErrorNotification 
            message={errorMessage} 
            onClose={() => setErrorMessage(null)} 
          />
        )}

        

        {/* Enhanced Header */}
        <div className="flex flex-col w-full">
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-3 sm:px-6 py-3 space-y-3 lg:space-y-0">
              {/* Project Info */}
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{localProject.name}</h1>
                  {hasUnsavedChanges && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs flex-shrink-0">
                      Non sauvegardé
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 justify-end">
                {/* Undo/Redo */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="rounded-lg"
                    title="Annuler"
                  >
                    <Undo className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-2 hidden md:inline">Annuler</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="rounded-lg"
                    title="Refaire"
                  >
                    <Redo className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-2 hidden md:inline">Refaire</span>
                  </Button>
                </div>

                {/* View Mode Toggles */}
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant={viewMode === "desktop" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("desktop")}
                    className="rounded-md"
                    title="Vue bureau"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "tablet" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("tablet")}
                    className="rounded-md"
                    title="Vue tablette"
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "mobile" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("mobile")}
                    className="rounded-md"
                    title="Vue mobile"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>

                {/* Editor Modes */}
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                  <Button
                    variant={!showCode && !showPreview ? "default" : "ghost"}
                    size="sm"
                    onClick={() => { setShowCode(false); setShowPreview(false); }}
                    className="rounded-md"
                    title="Mode éditeur"
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={showCode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => { setShowCode(!showCode); setShowPreview(false); }}
                    className="rounded-md"
                    title="Voir le code"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={showPreview ? "default" : "ghost"}
                    size="sm"
                    onClick={() => { setShowPreview(!showPreview); setShowCode(false); }}
                    className="rounded-md"
                    title="Prévisualiser"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Settings and Auto-save - Hidden on small screens */}
                <div className="hidden lg:flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAlignmentGuides(!showAlignmentGuides)}
                    className={`rounded-lg ${showAlignmentGuides ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
                    title="Guides d'alignement"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoSave"
                      checked={autoSaveEnabled}
                      onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="autoSave" className="text-sm text-gray-600 whitespace-nowrap">Auto-save</label>
                  </div>
                </div>

                {/* Save Button */}
                <Button 
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || saveMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">
                    {saveMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Component Palette */}
            {!hideComponentPanel && (
              <div className={`
                ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-screen bg-white' : 'w-64 md:w-60 lg:w-64'} 
                bg-white border-r border-gray-200 shadow-sm overflow-y-auto
                ${isMobile ? 'animate-slide-right' : ''}
              `}>
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Composants</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHideComponentPanel(true)}
                      className="rounded-lg"
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ComponentPalette />
              </div>
            )}

            {/* Editor Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {showPreview ? (
                <div className="flex-1 overflow-auto bg-gray-100 p-6">
                  <div className={`mx-auto bg-white shadow-xl rounded-xl border border-gray-200 transition-all duration-300 ${getViewportClass()}`}>
                    <iframe
                      title="Preview"
                      className="w-full h-full border-0 rounded-xl"
                      srcDoc={generatePreviewHTML(localProject)}
                      style={{ minHeight: '600px' }}
                    />
                  </div>
                </div>
              ) : showCode ? (
                <div className="flex-1 overflow-auto bg-gray-900 text-white p-6">
                  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
                    <CodePreview project={localProject} />
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-auto bg-gray-100 p-6">
                  <div className={`mx-auto bg-white shadow-xl rounded-xl border border-gray-200 transition-all duration-300 ${getViewportClass()}`}>
                    <div className="relative overflow-hidden rounded-xl">
                      <VisualEditor
                        project={localProject}
                        selectedComponent={selectedComponent}
                        onComponentSelect={setSelectedComponent}
                        onComponentUpdate={handleComponentUpdate}
                        showCode={showCode}
                      />

                      {/* Alignment guides overlay */}
                      <AlignmentGuides
                        showGuides={showAlignmentGuides}
                        selectedComponent={selectedComponent ? {
                          x: parseInt(selectedComponent.styles?.left?.replace('px', '') || '0'),
                          y: parseInt(selectedComponent.styles?.top?.replace('px', '') || '0'),
                          width: parseInt(selectedComponent.styles?.width?.replace('px', '') || '100'),
                          height: parseInt(selectedComponent.styles?.height?.replace('px', '') || '50')
                        } : null}
                        containerBounds={{ width: 800, height: 600 }}
                        allComponents={localProject.content?.pages?.[0]?.content?.structure?.map(comp => ({
                          id: comp.id,
                          x: parseInt(comp.styles?.left?.replace('px', '') || '0'),
                          y: parseInt(comp.styles?.top?.replace('px', '') || '0'),
                          width: parseInt(comp.styles?.width?.replace('px', '') || '100'),
                          height: parseInt(comp.styles?.height?.replace('px', '') || '50')
                        })) || []}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Properties Panel */}
            {!hideRightPanel && (
              <div className={`
                ${isMobile ? 'fixed inset-y-0 right-0 z-50 w-screen bg-white' : 'w-64 md:w-60 lg:w-64'} 
                bg-white border-l border-gray-200 shadow-sm overflow-y-auto
                ${isMobile ? 'animate-slide-right' : ''}
              `}>
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Propriétés</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHideRightPanel(true)}
                      className="rounded-lg"
                    >
                      <PanelRightClose className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <PropertiesPanel
                  component={selectedComponent}
                  onComponentUpdate={(component) => {
                    const updatedProject = { ...localProject };
                    if (updatedProject.content?.pages?.[0]?.content?.structure) {
                      const structure = updatedProject.content.pages[0].content.structure;
                      const index = structure.findIndex(c => c.id === component.id);
                      if (index !== -1) {
                        structure[index] = component;
                        handleComponentUpdate(updatedProject);
                      }
                    }
                  }}
                  project={localProject}
                  onComponentSelect={setSelectedComponent}
                  onComponentDelete={(componentId) => {
                    const updatedProject = { ...localProject };
                    if (updatedProject.content?.pages?.[0]?.content?.structure) {
                      updatedProject.content.pages[0].content.structure = 
                        updatedProject.content.pages[0].content.structure.filter(c => c.id !== componentId);
                      setSelectedComponent(null);
                      handleComponentUpdate(updatedProject);
                    }
                  }}
                  hideMainSidebar={hideMainSidebar}
                  setHideMainSidebar={setHideMainSidebar}
                />
              </div>
            )}
          </div>

          {/* Panel Toggle Buttons */}
          <div className="fixed bottom-6 left-6 flex space-x-2">
            {hideComponentPanel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHideComponentPanel(false)}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl"
                title="Afficher les composants"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            )}
            {hideRightPanel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHideRightPanel(false)}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl"
                title="Afficher les propriétés"
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}