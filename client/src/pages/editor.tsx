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
import { Save, Eye, Download, Code, Upload, Globe, Database, Server, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
const HTML5toTouch: MultiBackendOptions = {
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

    if (component.children && component.children.length > 0) {
      const childrenHTML = component.children
        .map(child => renderComponent(child, indent + 2))
        .join('\n');
      return `${indentStr}${openingTag}\n${childrenHTML}\n${indentStr}</${tag}>`;
    } else {
      const content = component.content || '';
      if (content) {
        return `${indentStr}${openingTag}${content}</${tag}>`;
      } else {
        return `${indentStr}${openingTag}</${tag}>`;
      }
    }
  };

  const pageContent = pageStructure.map(component => renderComponent(component)).join('\n');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.content?.meta?.title || project.name}</title>
  <meta name="description" content="${project.content?.meta?.description || project.description || ''}">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    ${currentPage?.content?.styles || ''}
  </style>
</head>
<body>
${pageContent}
  <script>
    ${currentPage?.content?.scripts || ''}
  </script>
</body>
</html>`;
}

// Configuration FTP
interface FTPConfig {
  host: string;
  username: string;
  password: string;
  port: number;
  directory: string;
  autoUpload: boolean;
}

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();

  // États de l'interface
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null);
  const [showLeftPanel, setShowLeftPanel] = useState(!isMobile);
  const [showRightPanel, setShowRightPanel] = useState(!isMobile);
  const [showMainNav, setShowMainNav] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showFTPDialog, setShowFTPDialog] = useState(false);
  const [ftpConfig, setFtpConfig] = useState<FTPConfig>({
    host: '',
    username: '',
    password: '',
    port: 21,
    directory: '/',
    autoUpload: false
  });

  // États de l'éditeur
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLivePreview, setIsLivePreview] = useState(true);

  // Collaboration
  const {
    users,
    currentUser,
    userCursor,
    componentHighlight,
    isConnected,
    updateCursor,
    updateComponentHighlight,
    broadcastChange,
    onUserJoin,
    onUserLeave
  } = useCollaboration(id || '', selectedComponent?.id);

  // Requête pour charger le projet
  const { data: project, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // Mutation pour sauvegarder le projet
  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject: Partial<Project>) => {
      if (!id) throw new Error("No project ID");
      return apiRequest(`/api/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedProject)
      });
    },
    onSuccess: () => {
      toast({ title: "Projet sauvegardé", description: "Vos modifications ont été sauvegardées." });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de sauvegarde",
        description: error.message || "Impossible de sauvegarder le projet",
        variant: "destructive"
      });
    }
  });

  // Sauvegarde automatique avec gestion de l'historique
  const saveProject = useCallback(async (projectData?: Partial<Project>) => {
    if (!project || !id) return;

    const updatedProject = projectData || project;

    // Ajouter à l'historique
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), { ...updatedProject }];
      if (newHistory.length > 50) { // Limiter l'historique
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);

    // Sauvegarder
    updateProjectMutation.mutate(updatedProject);

    // Broadcast les changements pour la collaboration
    if (broadcastChange) {
      broadcastChange('project:update', updatedProject);
    }
  }, [project, id, updateProjectMutation, broadcastChange, historyIndex]);

  // Fonction pour ajouter un composant
  const handleAddComponent = useCallback((componentType: string, position?: { x: number; y: number }) => {
    if (!project || !id) return;

    const newComponent = createComponent(componentType, position);
    const currentPage = project.content?.pages?.[0];

    if (!currentPage?.content?.structure) return;

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...currentPage,
          content: {
            ...currentPage.content,
            structure: [...currentPage.content.structure, newComponent]
          }
        }]
      }
    };

    saveProject(updatedProject);
    setSelectedComponent(newComponent);

    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }

    toast({
      title: "Composant ajouté",
      description: `${componentType} a été ajouté à la page.`
    });
  }, [project, id, saveProject, toast]);

  // Fonction pour mettre à jour un composant
  const handleComponentUpdate = useCallback((updatedComponent: ComponentDefinition) => {
    if (!project || !id) return;

    const updateComponentInStructure = (components: ComponentDefinition[]): ComponentDefinition[] => {
      return components.map(comp => {
        if (comp.id === updatedComponent.id) {
          return updatedComponent;
        }
        if (comp.children) {
          return {
            ...comp,
            children: updateComponentInStructure(comp.children)
          };
        }
        return comp;
      });
    };

    const currentPage = project.content?.pages?.[0];
    if (!currentPage?.content?.structure) return;

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...currentPage,
          content: {
            ...currentPage.content,
            structure: updateComponentInStructure(currentPage.content.structure)
          }
        }]
      }
    };

    saveProject(updatedProject);
    setSelectedComponent(updatedComponent);
  }, [project, id, saveProject]);

  // Fonction pour supprimer un composant
  const handleComponentDelete = useCallback((componentId: string) => {
    if (!project || !id) return;

    const removeComponentFromStructure = (components: ComponentDefinition[]): ComponentDefinition[] => {
      return components.filter(comp => {
        if (comp.id === componentId) {
          return false;
        }
        if (comp.children) {
          comp.children = removeComponentFromStructure(comp.children);
        }
        return true;
      });
    };

    const currentPage = project.content?.pages?.[0];
    if (!currentPage?.content?.structure) return;

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...currentPage,
          content: {
            ...currentPage.content,
            structure: removeComponentFromStructure(currentPage.content.structure)
          }
        }]
      }
    };

    saveProject(updatedProject);
    setSelectedComponent(null);

    toast({
      title: "Composant supprimé",
      description: "Le composant a été supprimé de la page."
    });
  }, [project, id, saveProject, toast]);

  // Fonction d'export
  const handleExport = useCallback(() => {
    if (!project) return;

    const html = generatePreviewHTML(project);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Le fichier HTML a été téléchargé."
    });
  }, [project, toast]);

  // Fonction FTP Upload
  const handleFTPUpload = useCallback(async () => {
    if (!project) return;

    // Vérifier la configuration FTP
    const projectFTPConfig = project.settings?.ftp || ftpConfig;
    if (!projectFTPConfig.host || !projectFTPConfig.username) {
      setShowFTPDialog(true);
      return;
    }

    try {
      const html = generatePreviewHTML(project);
      
      // Simuler l'upload FTP (dans un vrai projet, cela appellerait un endpoint backend)
      const response = await apiRequest('/api/ftp/upload', {
        method: 'POST',
        body: JSON.stringify({
          config: projectFTPConfig,
          content: html,
          filename: `${project.name}.html`
        })
      });

      toast({
        title: "Upload FTP réussi",
        description: "Le site a été mis en ligne avec succès."
      });

    } catch (error: any) {
      toast({
        title: "Erreur FTP",
        description: error.message || "Impossible d'uploader le fichier",
        variant: "destructive"
      });
    }
  }, [project, ftpConfig, toast]);

  // Sauvegarde de la configuration FTP
  const saveFTPConfig = useCallback(() => {
    if (!project || !id) return;

    const updatedProject = {
      ...project,
      settings: {
        ...project.settings,
        ftp: ftpConfig
      }
    };

    saveProject(updatedProject);
    setShowFTPDialog(false);

    toast({
      title: "Configuration FTP sauvegardée",
      description: "Les paramètres FTP ont été mis à jour."
    });
  }, [project, id, ftpConfig, saveProject, toast]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveProject();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              // Redo
              if (historyIndex < history.length - 1) {
                const nextState = history[historyIndex + 1];
                setHistoryIndex(historyIndex + 1);
                saveProject(nextState);
              }
            } else {
              // Undo
              if (historyIndex > 0) {
                const prevState = history[historyIndex - 1];
                setHistoryIndex(historyIndex - 1);
                saveProject(prevState);
              }
            }
            break;
          case 'e':
            e.preventDefault();
            handleExport();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveProject, handleExport, history, historyIndex]);

  // Adaptation mobile
  useEffect(() => {
    if (isMobile) {
      setShowLeftPanel(false);
      setShowRightPanel(false);
      setShowMainNav(false);
    }
  }, [isMobile]);

  // Chargement du projet
  useEffect(() => {
    if (project && history.length === 0) {
      setHistory([{ ...project }]);
      setHistoryIndex(0);
    }
  }, [project, history.length]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-theme-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary mx-auto mb-4"></div>
          <p className="text-theme-text">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-screen flex items-center justify-center bg-theme-background">
        <ErrorNotification 
          title="Erreur de chargement"
          message="Impossible de charger le projet"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const getViewportClass = () => {
    switch (viewport) {
      case 'mobile': return 'w-80 min-h-screen border border-gray-300 mx-auto';
      case 'tablet': return 'w-4/5 max-w-4xl min-h-screen border border-gray-300 mx-auto';
      default: return 'w-full min-h-screen';
    }
  };

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="h-screen bg-theme-background flex flex-col relative overflow-hidden">
        {/* Navigation principale conditionnelle */}
        {showMainNav && (
          <Header 
            title={project.name}
            subtitle={`Projet ${project.type} - ${project.content?.pages?.length || 0} page(s)`}
            actions={
              <div className="flex items-center gap-2">
                {/* Badge de statut */}
                <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                  {isConnected ? `${users.length} en ligne` : 'Hors ligne'}
                </Badge>

                {/* Type de projet */}
                <Badge variant="outline" className="text-xs">
                  {project.type === 'single-page' && 'Page unique'}
                  {project.type === 'multi-page' && 'Multi-pages'}
                  {project.type === 'ftp-sync' && 'Sync FTP'}
                  {project.type === 'ftp-upload' && 'Upload FTP'}
                </Badge>

                {/* Indicateur de sauvegarde */}
                {updateProjectMutation.isPending && (
                  <Badge variant="secondary" className="text-xs animate-pulse">
                    Sauvegarde...
                  </Badge>
                )}

                {/* Bouton de collaboration */}
                <CollaborationButton isConnected={isConnected} userCount={users.length} />
              </div>
            }
          />
        )}

        {/* Zone principale avec panneaux */}
        <div className="flex-1 flex relative">
          {/* Panneau gauche - Composants */}
          <div className={`
            ${showLeftPanel ? 'editor-panel-compact' : 'w-0'}
            transition-all duration-300 border-r border-theme-border bg-theme-surface z-10
            ${showLeftPanel ? '' : 'overflow-hidden'}
          `}>
            {showLeftPanel && (
              <EnhancedComponentPalette
                onDoubleClick={handleAddComponent}
                className="h-full"
              />
            )}
          </div>

          {/* Zone centrale - Éditeur */}
          <div className="flex-1 flex flex-col relative">
            {/* Barre d'outils de l'éditeur */}
            <div className="bg-theme-surface border-b border-theme-border p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={showPreview ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="h-7 px-2 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {showPreview ? 'Édition' : 'Aperçu'}
                </Button>
                
                <Button
                  variant={showCode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowCode(!showCode)}
                  className="h-7 px-2 text-xs"
                >
                  <Code className="w-3 h-3 mr-1" />
                  Code
                </Button>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center gap-1 text-xs text-theme-text-secondary">
                  <span>Viewport:</span>
                  <Button
                    variant={viewport === 'desktop' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewport('desktop')}
                    className="h-6 w-6 p-0"
                  >
                    💻
                  </Button>
                  <Button
                    variant={viewport === 'tablet' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewport('tablet')}
                    className="h-6 w-6 p-0"
                  >
                    📱
                  </Button>
                  <Button
                    variant={viewport === 'mobile' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewport('mobile')}
                    className="h-6 w-6 p-0"
                  >
                    📱
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveProject()}
                  disabled={updateProjectMutation.isPending}
                  className="h-7 px-2 text-xs"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Sauver
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="h-7 px-2 text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>

                {(project.type === 'ftp-sync' || project.type === 'ftp-upload') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFTPUpload}
                    className="h-7 px-2 text-xs"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    FTP
                  </Button>
                )}
              </div>
            </div>

            {/* Zone d'édition */}
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
              <div className={getViewportClass()}>
                {showCode ? (
                  <CodePreview project={project} />
                ) : showPreview ? (
                  <div className="bg-white min-h-full">
                    <iframe
                      srcDoc={generatePreviewHTML(project)}
                      className="w-full h-full border-0"
                      title="Preview"
                      style={{ minHeight: '600px' }}
                    />
                  </div>
                ) : (
                  <div className="relative bg-white min-h-full">
                    <VisualEditor
                      project={project}
                      selectedComponent={selectedComponent}
                      onComponentSelect={setSelectedComponent}
                      onComponentUpdate={handleComponentUpdate}
                      onComponentDelete={handleComponentDelete}
                      onComponentAdd={handleAddComponent}
                      isLivePreview={isLivePreview}
                    />
                    <AlignmentGuides />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panneau droit - Propriétés */}
          <div className={`
            ${showRightPanel ? 'editor-panel-compact' : 'w-0'}
            transition-all duration-300 border-l border-theme-border bg-theme-surface z-10
            ${showRightPanel ? '' : 'overflow-hidden'}
          `}>
            {showRightPanel && (
              <EnhancedPropertiesPanel
                component={selectedComponent}
                onComponentUpdate={handleComponentUpdate}
                onComponentSelect={setSelectedComponent}
                onComponentDelete={handleComponentDelete}
                project={project}
                className="h-full"
              />
            )}
          </div>
        </div>

        {/* Contrôles flottants */}
        <FloatingControls
          showLeftPanel={showLeftPanel}
          showRightPanel={showRightPanel}
          showMainNav={showMainNav}
          showPreview={showPreview}
          showCode={showCode}
          viewport={viewport}
          onToggleLeftPanel={() => setShowLeftPanel(!showLeftPanel)}
          onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
          onToggleMainNav={() => setShowMainNav(!showMainNav)}
          onTogglePreview={() => setShowPreview(!showPreview)}
          onToggleCode={() => setShowCode(!showCode)}
          onViewportChange={setViewport}
          onSave={() => saveProject()}
          onExport={handleExport}
          onUpload={(project.type === 'ftp-sync' || project.type === 'ftp-upload') ? handleFTPUpload : undefined}
        />

        {/* Curseurs des utilisateurs collaboratifs */}
        <UserCursors users={users} currentUserId={currentUser?.id} />
        {componentHighlight && (
          <ComponentHighlight 
            componentId={componentHighlight.componentId}
            userId={componentHighlight.userId}
          />
        )}

        {/* Panneau de collaboration */}
        <CollaborationPanel 
          users={users}
          isConnected={isConnected}
          onUserJoin={onUserJoin}
          onUserLeave={onUserLeave}
        />
      </div>

      {/* Dialog de configuration FTP */}
      <Dialog open={showFTPDialog} onOpenChange={setShowFTPDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configuration FTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ftp-host">Serveur FTP</Label>
              <Input
                id="ftp-host"
                value={ftpConfig.host}
                onChange={(e) => setFtpConfig(prev => ({ ...prev, host: e.target.value }))}
                placeholder="ftp.exemple.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ftp-username">Nom d'utilisateur</Label>
              <Input
                id="ftp-username"
                value={ftpConfig.username}
                onChange={(e) => setFtpConfig(prev => ({ ...prev, username: e.target.value }))}
                placeholder="utilisateur"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ftp-password">Mot de passe</Label>
              <Input
                id="ftp-password"
                type="password"
                value={ftpConfig.password}
                onChange={(e) => setFtpConfig(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ftp-port">Port</Label>
                <Input
                  id="ftp-port"
                  type="number"
                  value={ftpConfig.port}
                  onChange={(e) => setFtpConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 21 }))}
                  placeholder="21"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ftp-directory">Répertoire</Label>
                <Input
                  id="ftp-directory"
                  value={ftpConfig.directory}
                  onChange={(e) => setFtpConfig(prev => ({ ...prev, directory: e.target.value }))}
                  placeholder="/public_html"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setShowFTPDialog(false)}>
                Annuler
              </Button>
              <Button onClick={saveFTPConfig}>
                Sauvegarder et uploader
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DndProvider>
  );
}