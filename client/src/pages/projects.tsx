import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/header";
import ProjectCard from "@/components/project/project-card";
import CreateProjectModal from "@/components/project/create-project-modal";
import { useState } from "react";
import { Plus, Search, Filter, FolderOpen } from "lucide-react";
import type { Project } from "@shared/schema";

export default function Projects() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || project.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <Header 
        title="Projets"
        subtitle={`${projects.length} projets au total`}
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Projet
          </Button>
        }
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher des projets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                Tous
              </Button>
              <Button
                variant={filterType === "standalone" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("standalone")}
              >
                Standalone
              </Button>
              <Button
                variant={filterType === "vscode-integration" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("vscode-integration")}
              >
                VS Code
              </Button>
              <Button
                variant={filterType === "existing-project" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("existing-project")}
              >
                Existant
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
                {searchQuery || filterType !== "all" ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet trouvé</h3>
                    <p className="text-gray-600 text-center mb-4">
                      Essayez de modifier vos critères de recherche ou filtres
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setFilterType("all");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet</h3>
                    <p className="text-gray-600 text-center mb-4">
                      Créez votre premier projet pour commencer à construire des pages web
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un Projet
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <CreateProjectModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}
