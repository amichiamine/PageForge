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
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check
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

  const { data: apiTemplates = [] } = useQuery<Template[]>({
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
      template: undefined,
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject & { templateContent?: any }) => {
      const { templateContent, ...projectData } = data;
      
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorData}`);
      }

      const project = await response.json();

      // Si un template est sélectionné, mettre à jour le contenu
      if (templateContent && project.id) {
        try {
          const updateResponse = await fetch(`/api/projects/${project.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: templateContent
            }),
          });

          if (!updateResponse.ok) {
            console.warn("Failed to update project content with template");
          }
        } catch (error) {
          console.warn("Error updating project with template:", error);
        }
      }

      return project;
    },
    onSuccess: (project: any) => {
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
      console.error("Project creation error:", error);
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

  const handlePrevious = () => {
    if (currentStep === 'details') {
      setCurrentStep('template');
    } else if (currentStep === 'template') {
      setCurrentStep('type');
    }
  };

  const selectedProjectType = projectTypes.find(type => type.id === form.watch('type'));

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-responsive-base font-semibold text-theme-text">
                Choisissez le type de projet
              </h3>
              <p className="text-responsive-sm text-theme-text-secondary">
                Sélectionnez le type qui correspond le mieux à vos besoins
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = form.watch('type') === type.id;
                
                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-200 card-responsive touch-friendly ${
                      isSelected
                        ? 'ring-2 ring-theme-primary bg-theme-primary/5 border-theme-primary'
                        : 'hover:bg-theme-surface-elevated border-theme-border'
                    }`}
                    onClick={() => form.setValue('type', type.id as any)}
                  >
                    <CardContent className="spacing-responsive-compact">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-theme-primary text-white' : 'bg-theme-background'
                        }`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-responsive-sm font-semibold text-theme-text">
                              {type.name}
                            </h4>
                            {type.recommended && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="w-2 h-2 mr-1" />
                                Recommandé
                              </Badge>
                            )}
                            {type.popular && (
                              <Badge variant="secondary" className="text-xs">
                                Populaire
                              </Badge>
                            )}
                            {type.premium && (
                              <Badge variant="secondary" className="text-xs">
                                <Crown className="w-2 h-2 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-theme-text-secondary">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-theme-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'template':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-responsive-base font-semibold text-theme-text">
                Choisissez un template (optionnel)
              </h3>
              <p className="text-responsive-sm text-theme-text-secondary">
                Commencez avec un design pré-conçu ou créez à partir de zéro
              </p>
            </div>

            {/* Option pour commencer vide */}
            <Card
              className={`cursor-pointer transition-all duration-200 card-responsive touch-friendly ${
                selectedTemplate === ""
                  ? 'ring-2 ring-theme-primary bg-theme-primary/5 border-theme-primary'
                  : 'hover:bg-theme-surface-elevated border-theme-border'
              }`}
              onClick={() => setSelectedTemplate("")}
            >
              <CardContent className="spacing-responsive-compact">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedTemplate === "" ? 'bg-theme-primary text-white' : 'bg-theme-background'
                  }`}>
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-responsive-sm font-semibold text-theme-text">
                      Commencer vide
                    </h4>
                    <p className="text-xs text-theme-text-secondary">
                      Créer un projet sans template pré-défini
                    </p>
                  </div>
                  {selectedTemplate === "" && (
                    <Check className="w-4 h-4 text-theme-primary" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Templates disponibles */}
            {featuredTemplates.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-responsive-sm font-medium text-theme-text">
                  Templates recommandés
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {featuredTemplates.slice(0, 6).map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    
                    return (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all duration-200 card-responsive touch-friendly ${
                          isSelected
                            ? 'ring-2 ring-theme-primary bg-theme-primary/5 border-theme-primary'
                            : 'hover:bg-theme-surface-elevated border-theme-border'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="spacing-responsive-compact">
                          <div className="space-y-2">
                            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg relative overflow-hidden">
                              <div className="absolute inset-0 bg-black/20"></div>
                              <div className="absolute bottom-2 left-2 right-2">
                                <div className="h-2 bg-white/30 rounded mb-1"></div>
                                <div className="h-1 bg-white/30 rounded w-3/4"></div>
                              </div>
                            </div>
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-semibold text-theme-text truncate">
                                  {template.name}
                                </h5>
                                <p className="text-xs text-theme-text-secondary line-clamp-2">
                                  {template.description}
                                </p>
                              </div>
                              {isSelected && (
                                <Check className="w-3 h-3 text-theme-primary ml-2 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {template.isPremium && (
                                <Badge variant="secondary" className="text-xs">
                                  <Crown className="w-2 h-2 mr-1" />
                                  Premium
                                </Badge>
                              )}
                              {template.isNew && (
                                <Badge variant="secondary" className="text-xs">
                                  <Sparkles className="w-2 h-2 mr-1" />
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'details':
        return (
          <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-responsive-base font-semibold text-theme-text">
                  Détails du projet
                </h3>
                <p className="text-responsive-sm text-theme-text-secondary">
                  Ajoutez les informations de base pour votre projet
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-responsive-sm font-medium text-theme-text">
                  Nom du projet
                </label>
                <Input
                  placeholder="Mon super site web"
                  value={form.watch('name')}
                  onChange={(e) => form.setValue('name', e.target.value)}
                  className="input-responsive bg-theme-background border-theme-border"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-responsive-sm font-medium text-theme-text">
                  Description (optionnel)
                </label>
                <Textarea
                  placeholder="Décrivez votre projet..."
                  value={form.watch('description') || ''}
                  onChange={(e) => form.setValue('description', e.target.value)}
                  className="resize-none bg-theme-background border-theme-border"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Résumé de la sélection */}
              <Card className="bg-theme-background border-theme-border">
                <CardContent className="spacing-responsive-compact">
                  <h4 className="text-responsive-sm font-medium text-theme-text mb-2">
                    Résumé de votre sélection
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      {selectedProjectType && (
                        <>
                          <selectedProjectType.icon className="w-3 h-3" />
                          <span className="text-theme-text">Type: {selectedProjectType.name}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-3 h-3" />
                      <span className="text-theme-text">
                        Template: {selectedTemplate 
                          ? allTemplates.find(t => t.id === selectedTemplate)?.name || 'Template sélectionné'
                          : 'Projet vide'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden bg-theme-surface border-theme-border">
        <DialogHeader>
          <DialogTitle className="text-responsive-lg text-theme-text">
            Créer un nouveau projet
          </DialogTitle>
          <DialogDescription className="text-responsive-sm text-theme-text-secondary">
            Suivez les étapes pour configurer votre nouveau projet web
          </DialogDescription>
        </DialogHeader>

        {/* Indicateur d'étapes */}
        <div className="flex items-center gap-2 py-2">
          {['type', 'template', 'details'].map((step, index) => {
            const stepNames = { type: 'Type', template: 'Template', details: 'Détails' };
            const isActive = currentStep === step;
            const isCompleted = ['type', 'template', 'details'].indexOf(currentStep) > index;
            
            return (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isActive
                    ? 'bg-theme-primary text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-theme-background text-theme-text-secondary border border-theme-border'
                }`}>
                  {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                </div>
                <span className={`text-xs ${
                  isActive ? 'text-theme-text font-medium' : 'text-theme-text-secondary'
                }`}>
                  {stepNames[step as keyof typeof stepNames]}
                </span>
                {index < 2 && (
                  <div className={`w-8 h-px ${
                    isCompleted ? 'bg-green-500' : 'bg-theme-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Contenu de l'étape */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-theme-border">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 'type'}
            className="button-responsive touch-friendly"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="button-responsive touch-friendly"
            >
              Annuler
            </Button>

            {currentStep === 'details' ? (
              <Button
                onClick={() => {
                  const formData = {
                    name: form.watch('name'),
                    description: form.watch('description'),
                    type: form.watch('type'),
                    template: form.watch('template')
                  };
                  handleSubmit(formData);
                }}
                disabled={createProjectMutation.isPending || !form.watch('name')}
                className="button-responsive touch-friendly"
              >
                {createProjectMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Créer le projet
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="button-responsive touch-friendly"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}