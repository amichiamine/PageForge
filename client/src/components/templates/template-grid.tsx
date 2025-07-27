import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    // Create a simplified preview based on template structure
    const previewStructure = template.content.structure.slice(0, 3); // Show first 3 components
    
    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🎨</div>
            <p className="text-gray-600">Aperçu du template</p>
            <p className="text-sm text-gray-500">{previewStructure.length} composants</p>
          </div>
        </div>
        <div className="p-4">
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

        {/* Template preview placeholder */}
        <div className="absolute bottom-4 left-4 text-white">
          <div className="w-20 h-3 bg-white bg-opacity-30 rounded mb-2"></div>
          <div className="w-16 h-2 bg-white bg-opacity-30 rounded"></div>
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
