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
import PropertiesPanel from "@/components/editor/properties-panel-new";
import { Save, Eye, Download, Code, Smartphone, Tablet, Monitor, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Grid, Layers, Settings, Undo, Redo, Play, Pause } from "lucide-react";
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
import { FloatingButton } from "@/components/ui/floating-button";
import { ResizablePanel } from "@/components/ui/resizable-panel";

// Fonction utilitaire pour générer le HTML de prévisualisation
function generatePreviewHTML(project: Project): string {
  const currentPage = project.content?.pages?.[0];
  const pageStructure = currentPage?.content?.structure || [];
  
  // Générer le CSS séparé
  const generateCSS = (components: ComponentDefinition[]): string => {
    let css = '';
    
    const processComponent = (component: ComponentDefinition) => {
      if (component.styles && Object.keys(component.styles).length > 0) {
        const selector = `#${component.id}`;
        const styles = Object.entries(component.styles)
          .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
          .map(([key, value]) => `  ${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
          .join('\n');
        
        if (styles) {
          css += `${selector} {\n${styles}\n}\n\n`;
        }
      }
      
      // Traiter les enfants récursivement
      if (component.children) {
        component.children.forEach(processComponent);
      }
    };
    
    components.forEach(processComponent);
    return css;
  };

  const renderComponent = (component: ComponentDefinition, indent: number = 2): string => {
    const attributes = component.attributes || {};
    const { className, ...otherAttributes } = attributes;
    
    const attributeString = Object.entries(otherAttributes)
      .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    const tag = component.tag || 'div';
    const classAttr = className ? `class="${className}"` : '';
    const idAttr = `id="${component.id}"`;
    const indentStr = ' '.repeat(indent);
    const childIndentStr = ' '.repeat(indent + 2);

    // Construire la balise ouvrante
    const openingTagParts = [tag, idAttr, classAttr, attributeString].filter(part => part.trim().length > 0);
    const openingTag = `<${openingTagParts.join(' ')}>`;

    // Gestion spéciale pour les composants complexes avec componentData
    if (component.type === 'carousel' && component.componentData?.slides) {
      const slides = component.componentData.slides;
      const slidesHTML = slides.map((slide: any, index: number) => {
        const slideStyle = `
          width: 100%;
          height: 100%;
          background-color: ${slide.backgroundColor || '#3b82f6'};
          ${slide.image ? `background-image: url(${slide.image}); background-size: cover; background-position: center; background-repeat: no-repeat;` : ''}
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${slide.textColor || 'white'};
          position: relative;
          object-fit: cover;
        `;
        
        return `${childIndentStr}<div class="carousel-slide" style="${slideStyle}">
${childIndentStr}  ${slide.image ? '<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); z-index: 1;"></div>' : ''}
${childIndentStr}  <div style="position: relative; z-index: 2; text-align: center; padding: 20px;">
${childIndentStr}    ${slide.title ? `<h3 style="font-size: ${slide.titleSize || '24px'}; margin: 0 0 8px 0;">${slide.title}</h3>` : ''}
${childIndentStr}    ${slide.description ? `<p style="margin: 0; font-size: 16px;">${slide.description}</p>` : ''}
${childIndentStr}    ${slide.buttonText ? `<button style="margin-top: 12px; padding: 8px 16px; background: rgba(255,255,255,0.2); color: ${slide.textColor || 'white'}; border: 2px solid ${slide.textColor || 'white'}; border-radius: 6px; cursor: pointer;">${slide.buttonText}</button>` : ''}
${childIndentStr}  </div>
${childIndentStr}</div>`;
      }).join('\n');
      
      return `${indentStr}${openingTag}
${childIndentStr}<div class="carousel-track" style="display: flex; width: ${slides.length * 100}%; height: 100%;">
${slidesHTML}
${childIndentStr}</div>
${indentStr}</${tag}>`;
    }

    // Gestion des listes avec éléments
    if (component.type === 'list' && component.componentData?.listItems) {
      const items = component.componentData.listItems;
      const itemsHTML = items.map((item: any) => {
        return `${childIndentStr}<li>${item.link ? `<a href="${item.link}">${item.text}</a>` : item.text}</li>`;
      }).join('\n');
      
      return `${indentStr}<ul ${idAttr} ${classAttr}>
${itemsHTML}
${indentStr}</ul>`;
    }

    // Gestion des accordéons
    if (component.type === 'accordion' && component.componentData?.accordionItems) {
      const items = component.componentData.accordionItems;
      const itemsHTML = items.map((item: any, index: number) => {
        return `${childIndentStr}<div class="accordion-item" style="border: 1px solid #e5e7eb; margin-bottom: 8px; border-radius: 6px;">
${childIndentStr}  <button class="accordion-header" style="width: 100%; padding: 12px; background: #f9fafb; border: none; text-align: left; font-weight: 600; cursor: pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
${childIndentStr}    ${item.question}
${childIndentStr}  </button>
${childIndentStr}  <div class="accordion-content" style="padding: 12px; display: ${index === 0 ? 'block' : 'none'}; border-top: 1px solid #e5e7eb;">
${childIndentStr}    ${item.answer}
${childIndentStr}  </div>
${childIndentStr}</div>`;
      }).join('\n');
      
      return `${indentStr}${openingTag}
${itemsHTML}
${indentStr}</${tag}>`;
    }

    // Gestion des grilles avec éléments
    if (component.type === 'grid' && component.componentData?.gridItems) {
      const items = component.componentData.gridItems;
      const itemsHTML = items.map((item: any) => {
        return `${childIndentStr}<div class="grid-item" style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
${childIndentStr}  ${item.title ? `<h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">${item.title}</h3>` : ''}
${childIndentStr}  ${item.content ? `<p style="margin: 0; color: #6b7280;">${item.content}</p>` : ''}
${childIndentStr}</div>`;
      }).join('\n');
      
      return `${indentStr}${openingTag}
${itemsHTML}
${indentStr}</${tag}>`;
    }

    if (component.type === 'image') {
      if (attributes.src) {
        return `${indentStr}<img src="${attributes.src}" alt="${attributes.alt || ''}" ${idAttr} ${classAttr} ${attributeString} />`;
      } else {
        return `${indentStr}<div ${idAttr} ${classAttr}>\n${childIndentStr}Image\n${indentStr}</div>`;
      }
    }

    // Contenu et enfants
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

  const componentCSS = generateCSS(pageStructure);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentPage?.content?.meta?.title || project.name}</title>
  <meta name="description" content="${project.description || ''}">
  <meta name="author" content="PageForge">
  <style>
    /* Styles de base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
      background: #f5f5f5;
      line-height: 1.6;
      color: #333;
    }
    
    .container { 
      max-width: 1200px; 
      margin: 0 auto; 
      background: white; 
      min-height: 100vh; 
      position: relative; 
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    /* Styles pour carousel */
    .carousel-container {
      position: relative;
      overflow: hidden;
    }
    
    .carousel-track {
      display: flex;
      transition: transform 0.3s ease-in-out;
    }
    
    .carousel-slide {
      flex: 0 0 100%;
      position: relative;
    }
    
    .carousel-dots {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
    }
    
    .carousel-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
      opacity: 0.5;
      cursor: pointer;
      transition: opacity 0.3s ease;
    }
    
    .carousel-dot.active {
      opacity: 0.8;
    }
    
    /* Styles des listes */
    ul {
      list-style-type: disc;
      padding-left: 20px;
    }
    
    li {
      margin-bottom: 4px;
    }
    
    /* Styles des accordéons */
    .accordion-item {
      border: 1px solid #e5e7eb;
      margin-bottom: 8px;
      border-radius: 6px;
      overflow: hidden;
    }
    
    .accordion-header {
      width: 100%;
      padding: 12px;
      background: #f9fafb;
      border: none;
      text-align: left;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .accordion-header:hover {
      background: #f3f4f6;
    }
    
    .accordion-content {
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      background: white;
    }
    
    /* Styles des grilles */
    .grid-item {
      padding: 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: box-shadow 0.2s ease;
    }
    
    .grid-item:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    /* Styles des composants individuels */
${componentCSS}
    
    /* Styles personnalisés de la page */
    ${currentPage?.content?.styles || ''}
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }
      
      h1 { font-size: 1.8rem; }
      h2 { font-size: 1.5rem; }
      h3 { font-size: 1.3rem; }
    }

    @media (max-width: 480px) {
      h1 { font-size: 1.5rem; }
      h2 { font-size: 1.3rem; }
      h3 { font-size: 1.1rem; }
    }
  </style>
</head>
<body>
  <div class="container">
${pageStructure.map(component => renderComponent(component, 4)).join('\n')}
  </div>
  <script>
    // Fonctionnalité carousel
    document.addEventListener('DOMContentLoaded', function() {
      const carousels = document.querySelectorAll('.carousel-container');
      
      carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        
        if (slides.length <= 1) return;
        
        let currentSlide = 0;
        
        // Créer les dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        
        slides.forEach((_, index) => {
          const dot = document.createElement('div');
          dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
          dot.addEventListener('click', () => goToSlide(index));
          dotsContainer.appendChild(dot);
        });
        
        carousel.appendChild(dotsContainer);
        
        function goToSlide(index) {
          currentSlide = index;
          track.style.transform = \`translateX(-\${currentSlide * 100}%)\`;
          
          // Mettre à jour les dots
          const dots = carousel.querySelectorAll('.carousel-dot');
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
          });
        }
        
        // Auto-play (optionnel)
        setInterval(() => {
          currentSlide = (currentSlide + 1) % slides.length;
          goToSlide(currentSlide);
        }, 5000);
      });
      
      // Fonctionnalité accordéon
      const accordionHeaders = document.querySelectorAll('.accordion-header');
      accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const content = this.nextElementSibling;
          const isOpen = content.style.display !== 'none';
          
          // Fermer tous les autres
          accordionHeaders.forEach(otherHeader => {
            if (otherHeader !== this) {
              otherHeader.nextElementSibling.style.display = 'none';
            }
          });
          
          // Toggle celui-ci
          content.style.display = isOpen ? 'none' : 'block';
        });
      });
    });
    
    // Scripts personnalisés de la page
    ${currentPage?.content?.scripts || ''}
  </script>
</body>
</html>`;
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
  const [hideComponentPanel, setHideComponentPanel] = useState(true); // Par défaut fermé
  const [hideRightPanel, setHideRightPanel] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlignmentGuides, setShowAlignmentGuides] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [touchMode, setTouchMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [undoStack, setUndoStack] = useState<Project[]>([]);
  const [redoStack, setRedoStack] = useState<Project[]>([]);

  // Mobile detection
  const { isMobile, isTablet, isMobileOrTablet } = useIsMobile();

  // Local state for editor changes before saving
  const [localProject, setLocalProject] = useState<Project | null>(null);

  // Auto-hide panels on mobile and set touch mode
  useEffect(() => {
    setTouchMode(isMobileOrTablet);
    if (isMobile) {
      setHideComponentPanel(true);
      setHideRightPanel(true);
    }
  }, [isMobile, isMobileOrTablet]);

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

  // Gestion du double-clic pour ajouter des composants
  const handleComponentDoubleClick = useCallback((componentType: string) => {
    if (!localProject) return;

    // Ajouter le composant au centre de l'éditeur
    const centerX = 200;
    const centerY = 100;
    
    const newComponent = createComponent(componentType);
    const baseWidths: Record<string, string> = {
      'container': '250px', 'section': '280px', 'header': '300px', 'footer': '300px',
      'heading': '200px', 'paragraph': '220px', 'image': '180px', 'button': '120px',
      'link': '100px', 'form': '240px', 'list': '180px', 'video': '200px',
      'audio': '200px', 'calendar': '200px', 'contact': '200px', 'testimonial': '220px', 'pricing': '200px'
    };
    const baseHeights: Record<string, string> = {
      'container': '120px', 'section': '150px', 'header': '80px', 'footer': '80px',
      'heading': '40px', 'paragraph': '60px', 'image': '120px', 'button': '36px',
      'link': '24px', 'form': '200px', 'list': '100px', 'video': '120px',
      'audio': '50px', 'calendar': '200px', 'contact': '150px', 'testimonial': '120px', 'pricing': '200px'
    };

    newComponent.styles = {
      ...newComponent.styles,
      position: 'absolute',
      left: `${centerX}px`,
      top: `${centerY}px`,
      width: baseWidths[componentType] || '180px',
      height: baseHeights[componentType] || '80px',
      backgroundColor: newComponent.styles?.backgroundColor || 'transparent',
      color: newComponent.styles?.color || '#000000',
      fontSize: newComponent.styles?.fontSize || '14px',
      fontFamily: newComponent.styles?.fontFamily || 'Inter, sans-serif',
      padding: newComponent.styles?.padding || '8px',
      margin: newComponent.styles?.margin || '0px',
      border: newComponent.styles?.border || '1px solid #e5e7eb',
      borderRadius: newComponent.styles?.borderRadius || '6px',
      zIndex: '1000'
    };

    const updatedStructure = [...(localProject.content?.pages?.[0]?.content?.structure || []), newComponent];
    const updatedProject = {
      ...localProject,
      content: {
        ...localProject.content,
        pages: [{
          id: localProject.content?.pages?.[0]?.id || 'page-1',
          name: localProject.content?.pages?.[0]?.name || 'Accueil',
          path: localProject.content?.pages?.[0]?.path || '/',
          content: {
            ...localProject.content?.pages?.[0]?.content,
            structure: updatedStructure
          }
        }]
      }
    };

    handleComponentUpdate(updatedProject);
    setSelectedComponent(newComponent);

    toast({
      title: "Composant ajouté",
      description: `${componentType} ajouté au centre de l'éditeur`,
    });
  }, [localProject, handleComponentUpdate, setSelectedComponent, toast]);

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
          event: 'pointer',
          check: () => true
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
          event: 'pointer',
          check: () => true
        }
      }
    ]
  };

  return (
    <DndProvider backend={MultiBackend} options={backendOptions}>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {errorMessage && (
          <ErrorNotification 
            error={errorMessage} 
            onDismiss={() => setErrorMessage(null)} 
          />
        )}

        {/* Floating Buttons for Mobile/Tablet */}
        {(isMobile || isTablet) && (
          <>
            {hideComponentPanel && (
              <FloatingButton
                onClick={() => setHideComponentPanel(false)}
                icon={<Layers className="h-5 w-5" />}
                label="Composants"
                position="bottom-left"
                size="md"
                variant="default"
              />
            )}
            {hideRightPanel && (
              <FloatingButton
                onClick={() => setHideRightPanel(false)}
                icon={<Settings className="h-5 w-5" />}
                label="Propriétés"
                position="bottom-right"
                size="md"
                variant="default"
              />
            )}
            <FloatingButton
              onClick={handleSave}
              icon={<Save className="h-5 w-5" />}
              label="Sauvegarder"
              position="top-right"
              size="lg"
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            />
            <FloatingButton
              onClick={() => setShowPreview(!showPreview)}
              icon={showPreview ? <Grid className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              label={showPreview ? "Éditer" : "Aperçu"}
              position="center-bottom"
              size="md"
              variant="secondary"
            />
          </>
        )}

        

        {/* Enhanced Header */}
        <div className="flex flex-col w-full">
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-3 sm:px-6 py-2 space-y-2 lg:space-y-0">
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
              <>
                {/* Overlay for mobile/tablet */}
                {isMobileOrTablet && (
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={() => setHideComponentPanel(true)}
                    onTouchStart={(e) => e.stopPropagation()}
                  />
                )}
                <ResizablePanel
                  defaultWidth={isMobile ? 240 : isTablet ? 280 : 200}
                  minWidth={160}
                  maxWidth={isMobile ? 300 : isTablet ? 400 : 350}
                  storageKey="component-palette-width"
                  direction="right"
                  disabled={isMobileOrTablet}
                  className={`
                    ${isMobileOrTablet ? 'fixed inset-y-0 left-0 z-50 shadow-2xl animate-slide-in-left' : ''} 
                    bg-white border-gray-200 overflow-y-auto
                  `}
                  title="Composants"
                >
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
                  <ComponentPalette onComponentDoubleClick={handleComponentDoubleClick} />
                </ResizablePanel>
              </>
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
                        showAlignmentGuides={showAlignmentGuides}
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
              <>
                {/* Overlay for mobile/tablet */}
                {isMobileOrTablet && (
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                    onClick={() => setHideRightPanel(true)}
                    onTouchStart={(e) => e.stopPropagation()}
                  />
                )}
                <ResizablePanel
                  defaultWidth={isMobile ? 240 : isTablet ? 280 : 200}
                  minWidth={160}
                  maxWidth={isMobile ? 300 : isTablet ? 400 : 350}
                  storageKey="properties-panel-width"
                  direction="left"
                  disabled={isMobileOrTablet}
                  className={`
                    ${isMobileOrTablet ? 'fixed inset-y-0 right-0 z-50 shadow-2xl animate-slide-in-right' : ''} 
                    bg-white border-gray-200 overflow-y-auto
                  `}
                  title="Propriétés"
                >
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
                      console.log('📋 PROPERTIES PANEL UPDATE:', { 
                        componentId: component.id, 
                        componentType: component.type,
                        updatedComponent: component 
                      });
                      const updatedProject = { ...localProject };
                      if (updatedProject.content?.pages?.[0]?.content?.structure) {
                        const structure = updatedProject.content.pages[0].content.structure;
                        const index = structure.findIndex(c => c.id === component.id);
                        if (index !== -1) {
                          structure[index] = component;
                          console.log('✅ UPDATED PROJECT STRUCTURE:', { 
                            updatedProject,
                            structureLength: structure.length,
                            componentIndex: index 
                          });
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
                        handleComponentUpdate(updatedProject);
                        setSelectedComponent(null);
                      }
                    }}
                    hideMainSidebar={hideMainSidebar}
                    setHideMainSidebar={setHideMainSidebar}
                  />
                </ResizablePanel>
              </>
            )}
          </div>

          {/* Panel Toggle Buttons - Positioned differently for mobile */}
          <div className={`fixed flex space-x-2 z-30 ${
            isMobileOrTablet ? 'bottom-4 left-1/2 transform -translate-x-1/2' : 'bottom-6 left-6'
          }`}>
            {hideComponentPanel && (
              <Button
                variant="outline"
                size={isMobileOrTablet ? "default" : "sm"}
                onClick={() => setHideComponentPanel(false)}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl"
                title="Afficher les composants"
              >
                <PanelLeftOpen className="h-4 w-4" />
                {isMobileOrTablet && <span className="ml-2">Composants</span>}
              </Button>
            )}
            {hideRightPanel && (
              <Button
                variant="outline"
                size={isMobileOrTablet ? "default" : "sm"}
                onClick={() => setHideRightPanel(false)}
                className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl"
                title="Afficher les propriétés"
              >
                <PanelRightOpen className="h-4 w-4" />
                {isMobileOrTablet && <span className="ml-2">Propriétés</span>}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}