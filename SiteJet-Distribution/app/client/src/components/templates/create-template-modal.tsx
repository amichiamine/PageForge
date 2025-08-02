import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import { insertTemplateSchema } from "@shared/schema";
import type { InsertTemplate, Project } from "@shared/schema";
import { Palette, Code, Layers, Plus, X } from "lucide-react";

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTemplateModal({ open, onOpenChange }: CreateTemplateModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const form = useForm<InsertTemplate>({
    resolver: zodResolver(insertTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "landing",
      thumbnail: "",
      content: { structure: [], styles: "" },
      tags: [],
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: InsertTemplate) => {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create template");
      }
      
      return response.json();
    },
    onSuccess: (template) => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Template créé",
        description: `Le template "${template.name}" a été créé avec succès.`,
      });
      onOpenChange(false);
      form.reset();
      setSelectedProject("");
      setCustomTags([]);
      setTagInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le template.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTemplate) => {
    let templateContent = data.content;
    
    // Si un projet est sélectionné, utiliser son contenu
    if (selectedProject) {
      const project = projects.find(p => p.id === selectedProject);
      if (project && project.content?.pages?.[0]?.content) {
        templateContent = {
          structure: project.content.pages[0].content.structure || [],
          styles: project.content.pages[0].content.styles || "",
          scripts: project.content.pages[0].content.scripts || "",
          meta: project.content.pages[0].content.meta || {}
        };
      }
    }

    createTemplateMutation.mutate({
      ...data,
      content: templateContent,
      tags: [...(data.tags || []), ...customTags],
    });
  };

  const addCustomTag = () => {
    if (tagInput.trim() && !customTags.includes(tagInput.trim())) {
      setCustomTags([...customTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeCustomTag = (tag: string) => {
    setCustomTags(customTags.filter(t => t !== tag));
  };

  const categories = [
    { value: "landing", label: "Landing Page", icon: "🏠" },
    { value: "ecommerce", label: "E-commerce", icon: "🛒" },
    { value: "portfolio", label: "Portfolio", icon: "🎨" },
    { value: "blog", label: "Blog", icon: "📝" },
    { value: "corporate", label: "Corporate", icon: "🏢" },
    { value: "personal", label: "Personnel", icon: "👤" },
  ];

  const commonTags = [
    "responsive", "modern", "minimal", "colorful", "professional", 
    "creative", "business", "tech", "startup", "agency"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Créer un Nouveau Template
          </DialogTitle>
          <DialogDescription>
            Créez un template personnalisé à partir d'un projet existant ou de zéro.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations de base */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du template</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Landing moderne" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <span className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                {category.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez votre template..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Source du contenu */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Source du template</label>
                  <p className="text-xs text-gray-500 mb-3">
                    Choisissez un projet existant ou créez de zéro
                  </p>
                  
                  <Select onValueChange={setSelectedProject} value={selectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Créer de zéro ou choisir un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Créer de zéro
                        </span>
                      </SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <span className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            {project.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProject && (
                  <Card className="p-3 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-3">
                      <Layers className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">
                          {projects.find(p => p.id === selectedProject)?.name}
                        </h4>
                        <p className="text-sm text-blue-700">
                          Le contenu de ce projet sera utilisé comme base pour le template
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Tags</label>
              
              {/* Tags courants */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Tags populaires :</p>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!customTags.includes(tag)) {
                          setCustomTags([...customTags, tag]);
                        }
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags personnalisés */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un tag personnalisé..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addCustomTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Tags sélectionnés */}
              {customTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeCustomTag(tag)}
                        className="hover:bg-gray-300 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createTemplateMutation.isPending}
              >
                {createTemplateMutation.isPending ? "Création..." : "Créer le Template"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}