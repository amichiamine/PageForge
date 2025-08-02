import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Eye, Download, Star, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Template } from "@shared/schema";

interface TemplateGridProps {
  templates: Template[];
}

interface TemplatePreviewModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseTemplate: (templateId: string) => void;
}

function TemplatePreviewModal({ template, open, onOpenChange, onUseTemplate }: TemplatePreviewModalProps) {
  if (!template) return null;

  const renderPreview = () => {
    // Create a realistic preview based on template structure
    const previewStructure = template.content.structure.slice(0, 5);
    
    const renderComponent = (component: any, index: number) => {
      const baseStyles = "transition-all duration-200";
      
      switch (component.type) {
        case 'section':
        case 'header':
          return (
            <div key={index} className={`h-16 rounded ${baseStyles}`} 
                 style={{ backgroundColor: component.styles?.backgroundColor || '#f3f4f6' }}>
              <div className="h-full flex items-center px-3">
                <div className="w-20 h-3 bg-gray-300 rounded"></div>
                <div className="ml-auto flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          );
        case 'heading':
          return (
            <div key={index} className={`h-8 rounded ${baseStyles}`}>
              <div className="w-32 h-4 bg-gray-800 rounded mt-2"></div>
            </div>
          );
        case 'paragraph':
        case 'text':
          return (
            <div key={index} className={`space-y-1 ${baseStyles}`}>
              <div className="w-full h-2 bg-gray-400 rounded"></div>
              <div className="w-4/5 h-2 bg-gray-400 rounded"></div>
              <div className="w-3/5 h-2 bg-gray-400 rounded"></div>
            </div>
          );
        case 'button':
          return (
            <div key={index} className={`${baseStyles}`}>
              <div className="w-24 h-6 bg-blue-500 rounded text-xs flex items-center justify-center text-white">
                Button
              </div>
            </div>
          );
        case 'image':
          return (
            <div key={index} className={`h-12 bg-gray-300 rounded ${baseStyles} flex items-center justify-center`}>
              <div className="text-gray-500 text-xs">📷</div>
            </div>
          );
        case 'navigation':
        case 'nav':
          return (
            <div key={index} className={`h-6 flex space-x-2 ${baseStyles}`}>
              <div className="w-12 h-3 bg-gray-400 rounded"></div>
              <div className="w-16 h-3 bg-gray-400 rounded"></div>
              <div className="w-14 h-3 bg-gray-400 rounded"></div>
            </div>
          );
        default:
          return (
            <div key={index} className={`h-6 bg-gray-200 rounded ${baseStyles}`}>
              <div className="w-16 h-3 bg-gray-400 rounded mt-1"></div>
            </div>
          );
      }
    };
    
    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="h-64 p-4 space-y-3 overflow-hidden">
          {previewStructure.length > 0 ? (
            <>
              {previewStructure.map((component, index) => renderComponent(component, index))}
              {previewStructure.length < template.content.structure.length && (
                <div className="text-xs text-gray-400 text-center mt-2">
                  +{template.content.structure.length - previewStructure.length} autres composants
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-2">📄</div>
                <p className="text-sm">Template vide</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50">
          <h3 className="font-semibold mb-2">{template.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          <div className="flex flex-wrap gap-1">
            {template.tags?.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Aperçu du template: {template.name}</span>
            <div className="flex items-center space-x-2">
              {template.isBuiltIn && (
                <Badge variant="secondary">
                  <Star className="w-3 h-3 mr-1" />
                  Officiel
                </Badge>
              )}
              <Badge variant="outline">{template.category}</Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Prévisualisez ce template et utilisez-le pour créer un nouveau projet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div>
            <h4 className="font-medium mb-3">Aperçu</h4>
            {renderPreview()}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>

            {template.tags && template.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Informations</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Créé {formatDistanceToNow(new Date(template.createdAt), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 bg-blue-500 rounded-full"></div>
                  Catégorie: {template.category}
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button 
                className="w-full" 
                onClick={() => onUseTemplate(template.id)}
              >
                Utiliser ce template
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



function TemplateCard({ template, onPreview, onUseTemplate }: { 
  template: Template;
  onPreview: (template: Template) => void;
  onUseTemplate: (templateId: string) => void;
}) {
  const getGradientClass = (category: string) => {
    switch (category) {
      case "landing":
        return "from-blue-500 to-blue-600";
      case "ecommerce":
        return "from-green-500 to-green-600";
      case "portfolio":
        return "from-purple-500 to-purple-600";
      case "blog":
        return "from-orange-500 to-orange-600";
      case "corporate":
        return "from-gray-500 to-gray-600";
      default:
        return "from-indigo-500 to-indigo-600";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      {/* Template Thumbnail */}
      <div className={`h-48 bg-gradient-to-br ${getGradientClass(template.category)} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200"></div>
        
        {/* Aperçu visuel du template avec mockup réaliste */}
        <div className="absolute inset-3 bg-white rounded-lg shadow-lg p-2 border">
          <div className="w-full h-full overflow-hidden">
            {/* Navigation mockup */}
            <div className="bg-gray-100 h-4 rounded-t-sm mb-1 flex items-center px-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-2 w-12 h-1 bg-gray-300 rounded"></div>
            </div>
            
            {/* Hero section mockup */}
            <div className="bg-gradient-to-r from-blue-200 to-purple-200 h-8 rounded-sm mb-1 flex items-center justify-center">
              <div className="w-8 h-1 bg-white/70 rounded"></div>
            </div>
            
            {/* Content grid mockup */}
            <div className="grid grid-cols-3 gap-1 mb-1">
              <div className="h-4 bg-gray-200 rounded-sm flex items-center justify-center text-xs">📄</div>
              <div className="h-4 bg-gray-200 rounded-sm flex items-center justify-center text-xs">🖼️</div>
              <div className="h-4 bg-gray-200 rounded-sm flex items-center justify-center text-xs">📊</div>
            </div>
            
            {/* Buttons mockup */}
            <div className="flex space-x-1 mb-1">
              <div className="w-6 h-2 bg-blue-400 rounded-sm"></div>
              <div className="w-8 h-2 bg-green-400 rounded-sm"></div>
            </div>
            
            {/* Footer mockup */}
            <div className="bg-gray-100 h-2 rounded-b-sm"></div>
          </div>
        </div>
        
        {/* Overlay actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => onPreview(template)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Aperçu
            </Button>
            <Button 
              size="sm"
              onClick={() => onUseTemplate(template.id)}
            >
              Utiliser
            </Button>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {template.category}
          </Badge>
        </div>

        {/* Built-in badge */}
        {template.isBuiltIn && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 border-yellow-300/30">
              <Star className="w-3 h-3 mr-1" />
              Officiel
            </Badge>
          </div>
        )}

        {/* Template preview miniature - Structure visuelle FORCÉE */}
        <div className="absolute bottom-3 left-3 text-white z-10">
          <div className="space-y-1.5">
            {/* Barres colorées représentant la structure */}
            <div className="w-24 h-3 bg-blue-500 rounded-sm shadow-lg border border-white/20"></div>
            <div className="w-20 h-2.5 bg-green-500 rounded-sm shadow-lg border border-white/20"></div>
            <div className="w-16 h-2 bg-purple-500 rounded-sm shadow-lg border border-white/20"></div>
            <div className="w-12 h-1.5 bg-orange-500 rounded-sm shadow-lg border border-white/20"></div>
          </div>
          
          {/* Badge compteur */}
          <div className="mt-2 inline-block text-xs font-semibold bg-black/60 text-white px-2 py-1 rounded-full border border-white/30 backdrop-blur-sm">
            {template.content?.structure?.length || 0} éléments
          </div>
        </div>
      </div>

      {/* Template Info */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
            {template.name}
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {template.description}
        </p>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {formatDistanceToNow(new Date(template.createdAt), { 
              addSuffix: true, 
              locale: fr 
            })}
          </span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(template)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TemplateGrid({ templates }: TemplateGridProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const createProjectMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const template = templates.find(t => t.id === templateId);
      const projectData = {
        name: `Projet ${template?.name || 'Nouveau'}`,
        description: `Créé à partir du template: ${template?.name}`,
        type: "standalone" as const,
        template: templateId,
      };
      
      const response = await apiRequest("POST", "/api/projects", projectData);
      return response.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projet créé",
        description: `Le projet "${project.name}" a été créé avec succès.`,
      });
      // Navigate to editor
      setLocation(`/editor/${project.id}`);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet avec ce template.",
        variant: "destructive",
      });
    },
  });

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = (templateId: string) => {
    createProjectMutation.mutate(templateId);
    setShowPreview(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={handlePreview}
            onUseTemplate={handleUseTemplate}
          />
        ))}
      </div>

      <TemplatePreviewModal
        template={selectedTemplate}
        open={showPreview}
        onOpenChange={setShowPreview}
        onUseTemplate={handleUseTemplate}
      />
    </>
  );
}
