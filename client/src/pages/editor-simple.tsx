import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Settings, Save, Eye, Download } from "lucide-react";
import type { Project } from "@shared/schema";

export default function EditorSimple() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-theme-text">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-theme-text-secondary mb-4">
              Impossible de charger le projet. Il se peut qu'il n'existe pas ou qu'une erreur soit survenue.
            </p>
            <Button onClick={() => setLocation("/projects")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux projets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-theme-background">
      {/* Header */}
      <div className="border-b border-theme-border bg-theme-surface">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/projects")}
              className="text-theme-text-secondary hover:text-theme-text"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Projets
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-theme-text">{project.name}</h1>
              <p className="text-sm text-theme-text-secondary">
                Type: {project.type} • Créé le {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Component palette */}
        <div className="w-64 border-r border-theme-border bg-theme-surface overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-theme-text mb-3">Composants</h2>
            <div className="space-y-2">
              {['Titre', 'Paragraphe', 'Image', 'Bouton', 'Container'].map((component) => (
                <Card key={component} className="p-3 hover:bg-theme-surface-elevated cursor-pointer transition-colors">
                  <p className="text-sm text-theme-text">{component}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Visual editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <Card className="min-h-96 p-8 bg-white">
              <div className="text-center text-gray-500">
                <h2 className="text-2xl font-bold mb-4">Éditeur visuel</h2>
                <p className="mb-4">Votre projet "{project.name}" est prêt à être édité.</p>
                <p className="text-sm">
                  Glissez-déposez des composants depuis la palette de gauche pour commencer à construire votre site.
                </p>
                
                {/* Project info */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
                  <h3 className="font-semibold mb-2">Informations du projet</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">ID:</span> {project.id}</p>
                    <p><span className="font-medium">Type:</span> {project.type}</p>
                    <p><span className="font-medium">Description:</span> {project.description || 'Aucune description'}</p>
                    <p><span className="font-medium">Template:</span> {project.template || 'Aucun template'}</p>
                    <p><span className="font-medium">Pages:</span> {project.content?.pages?.length || 0}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right sidebar - Properties */}
        <div className="w-64 border-l border-theme-border bg-theme-surface overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-theme-text mb-3">Propriétés</h2>
            <div className="space-y-4">
              <Card className="p-3">
                <p className="text-sm text-theme-text-secondary">
                  Sélectionnez un composant pour modifier ses propriétés.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}