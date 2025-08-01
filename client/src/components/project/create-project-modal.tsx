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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProjectSchema } from "@shared/schema";
import type { InsertProject, Template } from "@shared/schema";
import { useLocation } from "wouter";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "standalone",
      template: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }
      
      return response.json();
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
      // Navigate to editor
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

  const onSubmit = (data: InsertProject) => {
    createProjectMutation.mutate({
      ...data,
      template: selectedTemplate || undefined,
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    form.setValue("template", templateId);
  };

  const featuredTemplates = templates.filter(t => t.isBuiltIn).slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une Nouvelle Page</DialogTitle>
          <DialogDescription>
            Créez un nouveau projet web en choisissant un template et en configurant les options de base.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la page</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: index, about, contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de projet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single-page">Page unique</SelectItem>
                        <SelectItem value="multi-page">Site multi-pages</SelectItem>
                        <SelectItem value="ftp-integration">Intégration FTP</SelectItem>
                        <SelectItem value="standalone">Nouveau projet standalone</SelectItem>
                        <SelectItem value="vscode-integration">Intégration à projet VS Code existant</SelectItem>
                        <SelectItem value="existing-project">Page pour projet web existant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnelle)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre projet..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Template Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Choisir un Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blank Template */}
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTemplate === "" ? "border-primary ring-2 ring-primary/20" : "hover:border-gray-300"
                  }`}
                  onClick={() => handleTemplateSelect("")}
                >
                  <CardContent className="p-4">
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <div className="text-4xl text-gray-400">+</div>
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Page vierge</h4>
                    <p className="text-xs text-gray-600">Commencer avec une page vide</p>
                  </CardContent>
                </Card>

                {/* Featured Templates */}
                {featuredTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedTemplate === template.id ? "border-primary ring-2 ring-primary/20" : "hover:border-gray-300"
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className={`h-32 bg-gradient-to-br ${
                        template.category === "landing" ? "from-blue-400 to-blue-600" :
                        template.category === "ecommerce" ? "from-green-400 to-green-600" :
                        "from-purple-400 to-purple-600"
                      } rounded-lg relative mb-3`}>
                        <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg"></div>
                        <div className="absolute bottom-2 left-2 text-white text-xs">
                          {template.category}
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {templates.length > 3 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" onClick={() => setLocation("/templates")}>
                    Voir tous les templates
                  </Button>
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
                disabled={createProjectMutation.isPending}
              >
                {createProjectMutation.isPending ? "Création..." : "Créer la Page"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
