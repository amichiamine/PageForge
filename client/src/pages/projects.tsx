import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import ProjectCard from "@/components/project/project-card";
import CreateProjectModal from "@/components/project/create-project-modal";
import { useState } from "react";
import { Plus, Search, Filter, FolderOpen, Grid, List, Monitor, Layers, Cloud, Upload } from "lucide-react";
import type { Project } from "@shared/schema";

const projectTypeInfo = {
  "single-page": { icon: Monitor, label: "Page Unique", color: "bg-blue-100 text-blue-700" },
  "multi-page": { icon: Layers, label: "Multi-Pages", color: "bg-green-100 text-green-700" },
  "ftp-sync": { icon: Cloud, label: "Sync FTP", color: "bg-purple-100 text-purple-700" },
  "ftp-upload": { icon: Upload, label: "Upload FTP", color: "bg-orange-100 text-orange-700" },
};

export default function Projects() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
          <CreateProjectModal
            open={showCreateModal}
            onOpenChange={setShowCreateModal}
            triggerButton={
              <Button className="button-responsive touch-friendly">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Nouveau Projet</span>
                <span className="sm:hidden">Nouveau</span>
              </Button>
            }
          />
        }
      />

      <main className="flex-1 overflow-auto bg-theme-background">
        <div className="spacing-responsive">
          {/* Search, Filter and View Controls */}
          <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-secondary w-4 h-4" />
              <Input
                placeholder="Rechercher des projets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input-responsive bg-theme-surface border-theme-border"
              />
            </div>
            
            {/* Filter and View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                  className="button-responsive-compact touch-friendly-compact"
                >
                  Tous
                </Button>
                <Button
                  variant={filterType === "single-page" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("single-page")}
                  className="button-responsive-compact touch-friendly-compact"
                >
                  <Monitor className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Page Unique</span>
                  <span className="sm:hidden">Unique</span>
                </Button>
                <Button
                  variant={filterType === "multi-page" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("multi-page")}
                  className="button-responsive-compact touch-friendly-compact"
                >
                  <Layers className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Multi-Pages</span>
                  <span className="sm:hidden">Multi</span>
                </Button>
                <Button
                  variant={filterType === "ftp-sync" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("ftp-sync")}
                  className="button-responsive-compact touch-friendly-compact tablet-up"
                >
                  <Cloud className="w-3 h-3 mr-1" />
                  <span className="hidden lg:inline">Sync FTP</span>
                  <span className="lg:hidden">FTP</span>
                </Button>
                <Button
                  variant={filterType === "ftp-upload" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("ftp-upload")}
                  className="button-responsive-compact touch-friendly-compact tablet-up"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  <span className="hidden lg:inline">Upload FTP</span>
                  <span className="lg:hidden">Upload</span>
                </Button>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex gap-1 tablet-up">
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="button-responsive-compact touch-friendly-compact"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="button-responsive-compact touch-friendly-compact"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Projects Display */}
          {isLoading ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-responsive" 
              : "space-y-3"
            }>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div 
                  key={i} 
                  className={
                    viewMode === 'grid' 
                      ? "h-48 sm:h-56 lg:h-64 bg-theme-surface rounded-xl animate-pulse" 
                      : "h-20 bg-theme-surface rounded-lg animate-pulse"
                  } 
                />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-responsive" 
                : "space-y-3"
            }>
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  viewMode={viewMode}
                  typeInfo={projectTypeInfo[project.type as keyof typeof projectTypeInfo]}
                />
              ))}
            </div>
          ) : (
            <Card className="card-responsive bg-theme-surface border-theme-border">
              <CardContent className="flex flex-col items-center justify-center spacing-responsive">
                <FolderOpen className="w-12 h-12 text-theme-text-secondary mb-4" />
                {searchQuery || filterType !== "all" ? (
                  <>
                    <h3 className="text-responsive-lg font-semibold text-theme-text mb-2">Aucun projet trouvé</h3>
                    <p className="text-theme-text-secondary text-center mb-4 text-responsive-sm">
                      Essayez de modifier vos critères de recherche ou filtres
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setFilterType("all");
                      }}
                      className="button-responsive touch-friendly"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-responsive-lg font-semibold text-theme-text mb-2">Aucun projet</h3>
                    <p className="text-theme-text-secondary text-center mb-4 text-responsive-sm">
                      Créez votre premier projet pour commencer à construire des pages web
                    </p>
                    <Button 
                      onClick={() => setShowCreateModal(true)}
                      className="button-responsive touch-friendly"
                    >
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
