import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Sparkles, 
  Crown, 
  Plus, 
  ArrowRight,
  Star,
  Clock,
  Users,
  Zap,
  Filter,
  Grid,
  List,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import { useSidebarContext } from "@/App";
import type { Template, InsertProject } from "@shared/schema";
import { 
  enhancedTemplates, 
  templateCategories, 
  getTemplatesByCategory, 
  getFeaturedTemplates,
  searchTemplates,
  type EnhancedTemplate 
} from "@/lib/enhanced-templates";

interface CreateProjectData extends InsertProject {
  template?: string;
  templateContent?: any;
}

export default function Templates() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hideMainSidebar } = useSidebarContext();

  // États locaux
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);

  // Requête pour charger les templates depuis l'API (si nécessaire)
  const { data: apiTemplates = [], isLoading: isLoadingAPI } = useQuery({
    queryKey: ['/api/templates'],
    staleTime: 5 * 60 * 1000,
  });

  // Combiner les templates locaux et API
  const allTemplates = useMemo(() => {
    const localTemplates = enhancedTemplates.map(template => ({
      ...template,
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      thumbnail: template.thumbnail,
      content: template.content,
      tags: template.tags,
      isBuiltIn: template.isBuiltIn,
      isPremium: template.isPremium,
      isNew: template.isNew
    }));
    
    return [...localTemplates, ...Array.isArray(apiTemplates) ? apiTemplates : []];
  }, [apiTemplates]);

  // Filtrer les templates
  const filteredTemplates = useMemo(() => {
    let filtered = allTemplates;

    // Filtrer par terme de recherche
    if (searchTerm.trim()) {
      filtered = searchTemplates(searchTerm);
    }

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filtrer par premium
    if (showPremiumOnly) {
      filtered = filtered.filter(template => template.isPremium);
    }

    // Filtrer par nouveauté
    if (showNewOnly) {
      filtered = filtered.filter(template => template.isNew);
    }

    return filtered;
  }, [allTemplates, searchTerm, selectedCategory, showPremiumOnly, showNewOnly]);

  // Templates en vedette
  const featuredTemplates = getFeaturedTemplates();

  // Mutation pour créer un projet
  const createProjectMutation = useMutation({
    mutationFn: async (data: CreateProjectData) => {
      const { templateContent, ...projectData } = data;
      
      const response = await apiRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });

      // Si un template est sélectionné, mettre à jour le contenu
      if (templateContent && response.id) {
        await apiRequest(`/api/projects/${response.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            content: templateContent
          })
        });
      }

      return response;
    },
    onSuccess: (project) => {
      toast({
        title: "Projet créé",
        description: "Votre nouveau projet a été créé avec succès."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setLocation(`/editor/${project.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le projet",
        variant: "destructive"
      });
    }
  });

  // Fonction pour utiliser un template
  const handleUseTemplate = (template: EnhancedTemplate) => {
    const projectName = `Projet ${template.name}`;
    
    createProjectMutation.mutate({
      name: projectName,
      description: template.description,
      type: 'single-page',
      template: template.id,
      templateContent: template.content
    });
  };

  // Fonction pour prévisualiser un template
  const handlePreviewTemplate = (template: EnhancedTemplate) => {
    // Ouvrir une nouvelle fenêtre avec la prévisualisation
    const previewWindow = window.open('', '_blank', 'width=1200,height=800');
    if (previewWindow) {
      // Générer le HTML de prévisualisation à partir du contenu du template
      const previewHTML = generateTemplatePreviewHTML(template);
      previewWindow.document.write(previewHTML);
      previewWindow.document.close();
    }
  };

  // Fonction pour générer le HTML de prévisualisation d'un template
  const generateTemplatePreviewHTML = (template: EnhancedTemplate): string => {
    const content = template.content;
    const structure = content.structure || [];

    const renderComponent = (component: any, indent: number = 2): string => {
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

      const openingTagParts = [
        tag,
        classAttr,
        attributeString,
        styleString ? `style="${styleString}"` : ''
      ].filter(part => part.trim().length > 0);

      const openingTag = `<${openingTagParts.join(' ')}>`;

      if (component.children && component.children.length > 0) {
        const childrenHTML = component.children
          .map((child: any) => renderComponent(child, indent + 2))
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

    const pageContent = structure.map((component: any) => renderComponent(component)).join('\n');

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prévisualisation - ${template.name}</title>
  <meta name="description" content="${template.description}">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    ${content.styles || ''}
  </style>
</head>
<body>
${pageContent}
  <script>
    ${content.scripts || ''}
  </script>
</body>
</html>`;
  };

  const totalTemplates = allTemplates.length;
  const premiumCount = allTemplates.filter(t => t.isPremium).length;
  const newCount = allTemplates.filter(t => t.isNew).length;

  if (isLoadingAPI) {
    return (
      <div className="h-screen flex items-center justify-center bg-theme-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-theme-primary mx-auto mb-4" />
          <p className="text-theme-text">Chargement des templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-theme-background flex flex-col">
      <Header 
        title="Templates"
        subtitle={`${totalTemplates} templates disponibles`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Crown className="w-3 h-3 mr-1 text-yellow-500" />
              {premiumCount} Premium
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1 text-blue-500" />
              {newCount} Nouveaux
            </Badge>
          </div>
        }
      />

      <div className="flex-1 overflow-hidden">
        <div className={`h-full transition-all duration-300 ${hideMainSidebar ? 'ml-0' : 'ml-64'}`}>
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6 space-y-8">

              {/* Section en vedette */}
              {featuredTemplates.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-theme-text">Templates en vedette</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {featuredTemplates.map((template) => (
                      <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 border-theme-border bg-theme-surface">
                        <div className="relative">
                          <img
                            src={template.thumbnail}
                            alt={template.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/api/placeholder/400/200';
                            }}
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            {template.isPremium && (
                              <Badge className="bg-yellow-500 text-white">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                            {template.isNew && (
                              <Badge className="bg-blue-500 text-white">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Nouveau
                              </Badge>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
                            <div className="flex gap-2">
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => handlePreviewTemplate(template)}
                              >
                                Aperçu
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleUseTemplate(template)}
                                disabled={createProjectMutation.isPending}
                              >
                                Utiliser
                              </Button>
                            </div>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-theme-text">{template.name}</CardTitle>
                          <CardDescription className="text-theme-text-secondary">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <div className="flex flex-wrap gap-1">
                            {template.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Filtres et recherche */}
              <section>
                <div className="bg-theme-surface rounded-lg p-6 border border-theme-border">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Recherche */}
                    <div className="lg:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-theme-text-secondary" />
                        <Input
                          placeholder="Rechercher un template..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-theme-background border-theme-border"
                        />
                      </div>
                    </div>

                    {/* Catégorie */}
                    <div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-theme-background border-theme-border">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {templateCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Options d'affichage */}
                    <div className="flex items-center gap-2">
                      <div className="flex border border-theme-border rounded overflow-hidden">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="h-9 w-9 p-0 rounded-none"
                        >
                          <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="h-9 w-9 p-0 rounded-none"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Filtres avancés */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-theme-border">
                    <label className="flex items-center gap-2 text-sm text-theme-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPremiumOnly}
                        onChange={(e) => setShowPremiumOnly(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Crown className="w-4 h-4 text-yellow-500" />
                      Premium uniquement
                    </label>
                    
                    <label className="flex items-center gap-2 text-sm text-theme-text cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showNewOnly}
                        onChange={(e) => setShowNewOnly(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      Nouveautés uniquement
                    </label>
                  </div>
                </div>
              </section>

              {/* Liste des templates */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-theme-text">
                    Tous les templates ({filteredTemplates.length})
                  </h2>
                </div>

                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <Filter className="w-12 h-12 text-theme-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-theme-text mb-2">
                      Aucun template trouvé
                    </h3>
                    <p className="text-theme-text-secondary">
                      Essayez de modifier vos critères de recherche ou de filtrage.
                    </p>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6'
                      : 'space-y-4'
                  }>
                    {filteredTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        viewMode={viewMode}
                        onUse={handleUseTemplate}
                        onPreview={handlePreviewTemplate}
                        isCreating={createProjectMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant TemplateCard
interface TemplateCardProps {
  template: EnhancedTemplate;
  viewMode: 'grid' | 'list';
  onUse: (template: EnhancedTemplate) => void;
  onPreview: (template: EnhancedTemplate) => void;
  isCreating: boolean;
}

function TemplateCard({ template, viewMode, onUse, onPreview, isCreating }: TemplateCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-md transition-all duration-300 border-theme-border bg-theme-surface">
        <div className="flex">
          <div className="relative w-48 h-32 flex-shrink-0">
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover rounded-l-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/api/placeholder/200/150';
              }}
            />
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {template.isPremium && (
                <Badge className="bg-yellow-500 text-white text-xs">
                  <Crown className="w-3 h-3" />
                </Badge>
              )}
              {template.isNew && (
                <Badge className="bg-blue-500 text-white text-xs">
                  <Sparkles className="w-3 h-3" />
                </Badge>
              )}
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between h-full">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-theme-text mb-2">
                  {template.name}
                </h3>
                <p className="text-theme-text-secondary mb-4">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.tags?.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onPreview(template)}
                >
                  Aperçu
                </Button>
                <Button 
                  size="sm"
                  onClick={() => onUse(template)}
                  disabled={isCreating}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Utiliser
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-theme-border bg-theme-surface">
      <div className="relative">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/300/200';
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {template.isPremium && (
            <Badge className="bg-yellow-500 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          {template.isNew && (
            <Badge className="bg-blue-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Nouveau
            </Badge>
          )}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onPreview(template)}
            >
              Aperçu
            </Button>
            <Button 
              size="sm"
              onClick={() => onUse(template)}
              disabled={isCreating}
            >
              Utiliser
            </Button>
          </div>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-theme-text">{template.name}</CardTitle>
        <CardDescription className="text-theme-text-secondary">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        <div className="flex flex-wrap gap-1">
          {template.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}