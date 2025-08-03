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
      const response = await fetch(`/api/projects/${id}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log("🔍 EXPORT DATA:", data);
      console.log("📂 DATA STRUCTURE:", {
        hasFiles: !!data.files,
        filesType: typeof data.files,
        isArray: Array.isArray(data.files),
        filesLength: data.files?.length,
        allKeys: Object.keys(data)
      });
      
      // Download each file individually with proper extension
      if (data.files && Array.isArray(data.files)) {
        console.log("📁 FILES TO EXPORT:", data.files);
        data.files.forEach((file: any, index: number) => {
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
        // Fallback: try to download the data as JSON for debugging
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "export-debug.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("📥 Downloaded debug file with full data");
      }
      
      return data;
    },
    onSuccess: (data) => {
      const fileCount = data.files?.length || 0;
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