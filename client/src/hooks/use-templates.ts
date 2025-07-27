import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Template, InsertTemplate } from "@shared/schema";

export function useTemplates() {
  return useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });
}

export function useTemplate(id: string | undefined) {
  return useQuery<Template>({
    queryKey: ["/api/templates", id],
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTemplate) => {
      const response = await apiRequest("POST", "/api/templates", data);
      return response.json();
    },
    onSuccess: (template: Template) => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Template créé",
        description: `Le template "${template.name}" a été créé avec succès.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le template.",
        variant: "destructive",
      });
    },
  });
}

export function useTemplatesByCategory(category?: string) {
  const { data: templates = [] } = useTemplates();
  
  if (!category || category === "all") {
    return templates;
  }
  
  return templates.filter(template => template.category === category);
}

export function useBuiltInTemplates() {
  const { data: templates = [] } = useTemplates();
  return templates.filter(template => template.isBuiltIn);
}

export function useFeaturedTemplates(limit = 3) {
  const builtInTemplates = useBuiltInTemplates();
  return builtInTemplates.slice(0, limit);
}

export function useSearchTemplates(query: string) {
  const { data: templates = [] } = useTemplates();
  
  if (!query.trim()) {
    return templates;
  }
  
  const searchQuery = query.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery) ||
    template.description?.toLowerCase().includes(searchQuery) ||
    template.category.toLowerCase().includes(searchQuery) ||
    template.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
  );
}
