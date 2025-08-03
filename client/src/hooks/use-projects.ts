import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project, InsertProject, UpdateProject } from "@shared/schema";

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
}

export function useProject(id: string | undefined) {
  return useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertProject) => {
      return apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projet créé",
        description: "Le projet a été créé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateProject & { id: string }): Promise<any> => {
      return apiRequest("PATCH", `/api/projects/${id}`, data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", data?.id] });
      toast({
        title: "Projet mis à jour",
        description: "Les modifications ont été sauvegardées.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le projet.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le projet.",
        variant: "destructive",
      });
    },
  });
}

export function useExportProject() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response: any = await apiRequest("POST", `/api/projects/${id}/export`);
      
      console.log("🔍 EXPORT RESPONSE:", response);
      console.log("📂 RESPONSE STRUCTURE:", {
        hasFiles: !!response.files,
        filesType: typeof response.files,
        isArray: Array.isArray(response.files),
        filesLength: response.files?.length,
        allKeys: Object.keys(response)
      });
      
      // Download each file individually with proper extension
      if (response.files && Array.isArray(response.files)) {
        console.log("📁 FILES TO EXPORT:", response.files);
        response.files.forEach((file: any, index: number) => {
          console.log(`📄 PROCESSING FILE ${index}:`, { path: file.path, hasContent: !!file.content, contentLength: file.content?.length });
          if (file.path && file.content) {
            // Determine MIME type based on file extension
            let mimeType = "text/plain";
            const extension = file.path.split('.').pop()?.toLowerCase();
            
            switch (extension) {
              case 'html':
                mimeType = "text/html";
                break;
              case 'css':
                mimeType = "text/css";
                break;
              case 'js':
                mimeType = "application/javascript";
                break;
              case 'json':
                mimeType = "application/json";
                break;
              case 'md':
                mimeType = "text/markdown";
                break;
              default:
                mimeType = "text/plain";
            }
            
            // Create blob with appropriate MIME type
            const blob = new Blob([file.content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.path;
            
            // Add small delay between downloads to avoid browser blocking
            setTimeout(() => {
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              console.log(`✅ DOWNLOADED FILE ${index}: ${file.path}`);
            }, index * 200);
          } else {
            console.log(`❌ SKIPPED FILE ${index}: Missing path or content`, file);
          }
        });
      } else {
        console.log("❌ NO FILES FOUND OR INVALID STRUCTURE");
        // Fallback: try to download the response as JSON for debugging
        const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "export-debug.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("📥 Downloaded debug file with full response");
      }
      
      return response;
    },
    onSuccess: (response) => {
      const fileCount = response.files?.length || 0;
      toast({
        title: "Export réussi",
        description: `${fileCount} fichier(s) téléchargé(s) individuellement.`,
      });
    },
    onError: () => {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le projet.",
        variant: "destructive",
      });
    },
  });
}