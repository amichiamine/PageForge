import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProjectSchema } from "@shared/schema";
import type { InsertProject, Template } from "@shared/schema";
import { useLocation } from "wouter";
import { 
  Plus, 
  Smartphone, 
  Monitor, 
  Cloud, 
  Upload,
  Globe,
  Server,
  Database,
  Layers,
  Code,
  Palette,
  Star,
  Crown,
  Sparkles
} from "lucide-react";
import { enhancedTemplates, templateCategories, getFeaturedTemplates } from "@/lib/enhanced-templates";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerButton?: React.ReactNode;
}

const projectTypes = [
  {
    id: "single-page",
    name: "Page Unique",
    description: "Une seule page avec tous les contenus",
    icon: Monitor,
    recommended: true
  },
  {
    id: "multi-page",
    name: "Multi-Pages",
    description: "Site avec plusieurs pages et navigation",
    icon: Layers,
    popular: true
  },
  {
    id: "ftp-sync",
    name: "Sync FTP",
    description: "Synchronisation automatique avec serveur FTP",
    icon: Cloud,
    premium: true
  },
  {
    id: "ftp-upload",
    name: "Upload FTP",
    description: "Upload manuel vers serveur FTP",
    icon: Upload,
    premium: true
  }
];

export default function CreateProjectModal({ open, onOpenChange, triggerButton }: CreateProjectModalProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<'type' | 'template' | 'details'>('type');

  const { data: apiTemplates = [] } = useQuery({
    queryKey: ["/api/templates"],
    staleTime: 5 * 60 * 1000,
  });

  const allTemplates = [...enhancedTemplates, ...apiTemplates];
  const featuredTemplates = getFeaturedTemplates();

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "single-page",
      template: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject & { templateContent?: any }) => {
      const { templateContent, ...projectData } = data;
      
      const response = await apiRequest("/api/projects", {
        method: "POST",
        body: JSON.stringify(projectData)
      });

      // Si un template est sélectionné, mettre à jour le contenu
      if (templateContent && response.id) {
        await apiRequest(`/api/projects/${response.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            content: templateContent
          })
        });
      }

      return response;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projet créé",
        description: `Le projet "${project.name}" a été créé avec succès.`,
      });
      onOpenChange(false);
      form.reset();
      setSelectedTemplate("");
      setCurrentStep('type');
      setLocation(`/editor/${project.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le projet.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertProject) => {
    const selectedTemplateData = allTemplates.find(t => t.id === selectedTemplate);
    
    createProjectMutation.mutate({
      ...data,
      template: selectedTemplate || undefined,
      templateContent: selectedTemplateData?.content
    });
  };

  const handleNext = () => {
    if (currentStep === 'type') {
      setCurrentStep('template');
    } else if (currentStep === 'template') {
      setCurrentStep('details');
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('template');
    } else if (currentStep === 'template') {
      setCurrentStep('type');
    }
  };

  const resetModal = () => {
    setCurrentStep('type');
    setSelectedTemplate("");
    form.reset();
  };

  const ModalContent = () => (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Étape 1: Type de projet */}
      {currentStep === 'type' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-theme-text mb-2">
              Quel type de projet voulez-vous créer ?
            </h3>
            <p className="text-sm text-theme-text-secondary">
              Choisissez le type qui correspond le mieux à vos besoins
            </p>
          </div>

          <Form {...form}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projectTypes.map((type) => {
                        const IconComponent = type.icon;
                        const isSelected = field.value === type.id;
                        
                        return (
                          <Card
                            key={type.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                              isSelected 
                                ? 'border-theme-primary bg-theme-primary/5' 
                                : 'border-theme-border hover:border-theme-primary/50'
                            }`}
                            onClick={() => field.onChange(type.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`
                                  p-2 rounded-lg 
                                  ${isSelected ? 'bg-theme-primary text-white' : 'bg-theme-background text-theme-text-secondary'}
                                `}>
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-theme-text text-sm">
                                      {type.name}
                                    </h4>
                                    {type.recommended && (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        <Star className="w-3 h-3 mr-1" />
                                        Recommandé
                                      </Badge>
                                    )}
                                    {type.popular && (
                                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                        Populaire
                                      </Badge>
                                    )}
                                    {type.premium && (
                                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                        <Crown className="w-3 h-3 mr-1" />
                                        Premium
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-theme-text-secondary leading-relaxed">
                                    {type.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>

          <div className="flex justify-end">
            <Button onClick={handleNext} className="min-w-24">
              Continuer
            </Button>
          </div>
        </div>
      )}

      {/* Étape 2: Template */}
      {currentStep === 'template' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-theme-text mb-2">
              Choisir un template (optionnel)
            </h3>
            <p className="text-sm text-theme-text-secondary">
              Commencez avec un design professionnel ou créez depuis zéro
            </p>
          </div>

          {/* Template vide */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
              selectedTemplate === '' 
                ? 'border-theme-primary bg-theme-primary/5' 
                : 'border-theme-border hover:border-theme-primary/50'
            }`}
            onClick={() => setSelectedTemplate('')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`
                  p-2 rounded-lg 
                  ${selectedTemplate === '' ? 'bg-theme-primary text-white' : 'bg-theme-background text-theme-text-secondary'}
                `}>
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-theme-text text-sm mb-1">
                    Projet vide
                  </h4>
                  <p className="text-xs text-theme-text-secondary">
                    Commencer avec une page blanche
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates en vedette */}
          {featuredTemplates.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-theme-text mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Templates en vedette
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {featuredTemplates.slice(0, 6).map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                      selectedTemplate === template.id 
                        ? 'border-theme-primary bg-theme-primary/5' 
                        : 'border-theme-border hover:border-theme-primary/50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-12 h-9 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/api/placeholder/80/60';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-theme-text text-xs truncate">
                              {template.name}
                            </h4>
                            {template.isPremium && (
                              <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                            )}
                            {template.isNew && (
                              <Sparkles className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-theme-text-secondary line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-theme-text mb-3">
              Par catégorie
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templateCategories.slice(0, 6).map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  className="h-auto p-2 text-xs justify-start"
                  onClick={() => {
                    // Ouvrir la page templates avec cette catégorie
                    onOpenChange(false);
                    setLocation(`/templates?category=${category.id}`);
                  }}
                >
                  <Palette className="w-3 h-3 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} className="min-w-24">
              Retour
            </Button>
            <Button onClick={handleNext} className="min-w-24">
              Continuer
            </Button>
          </div>
        </div>
      )}

      {/* Étape 3: Détails */}
      {currentStep === 'details' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-theme-text mb-2">
              Détails du projet
            </h3>
            <p className="text-sm text-theme-text-secondary">
              Donnez un nom et une description à votre projet
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-theme-text">
                      Nom du projet *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Mon super projet" 
                        {...field}
                        className="bg-theme-background border-theme-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-theme-text">
                      Description (optionnel)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez votre projet..."
                        className="resize-none h-20 bg-theme-background border-theme-border"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-theme-text-secondary">
                      Une courte description pour vous aider à identifier votre projet.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Résumé */}
              <Card className="bg-theme-background border-theme-border">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-theme-text mb-3">
                    Résumé
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-theme-text-secondary">Type:</span>
                      <span className="text-theme-text font-medium">
                        {projectTypes.find(t => t.id === form.watch('type'))?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-theme-text-secondary">Template:</span>
                      <span className="text-theme-text font-medium">
                        {selectedTemplate ? 
                          allTemplates.find(t => t.id === selectedTemplate)?.name || 'Template sélectionné'
                          : 'Projet vide'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack} className="min-w-24">
                  Retour
                </Button>
                <Button 
                  type="submit" 
                  disabled={createProjectMutation.isPending}
                  className="min-w-24"
                >
                  {createProjectMutation.isPending ? "Création..." : "Créer le projet"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );

  if (triggerButton) {
    return (
      <Dialog open={open} onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) resetModal();
      }}>
        <DialogTrigger asChild>
          {triggerButton}
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-theme-surface border-theme-border">
          <DialogHeader>
            <DialogTitle className="text-theme-text">Créer un nouveau projet</DialogTitle>
            <DialogDescription className="text-theme-text-secondary">
              Créez votre site web en quelques étapes simples
            </DialogDescription>
          </DialogHeader>
          <ModalContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetModal();
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-theme-surface border-theme-border">
        <DialogHeader>
          <DialogTitle className="text-theme-text">Créer un nouveau projet</DialogTitle>
          <DialogDescription className="text-theme-text-secondary">
            Créez votre site web en quelques étapes simples
          </DialogDescription>
        </DialogHeader>
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
}