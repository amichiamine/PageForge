import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import ProjectCard from "@/components/project/project-card";
import CreateProjectModal from "@/components/project/create-project-modal";
import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Plus, 
  FolderOpen, 
  Code, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Rocket,
  Plug,
  Book
} from "lucide-react";
import type { Project } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const recentProjects = projects.slice(0, 3);

  return (
    <>
      <Header 
        title="Tableau de Bord"
        subtitle="Portable & Intégrable"
        actions={
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setLocation("/templates")}>
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </Button>
            <Button onClick={() => setLocation("/projects")}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        }
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className="group cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-200"
                onClick={() => setShowCreateModal(true)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">Nouvelle Page</CardTitle>
                  <CardDescription>
                    Créer une nouvelle page web depuis zéro ou à partir d'un template
                  </CardDescription>
                </CardContent>
              </Card>

              <Card 
                className="group cursor-pointer hover:border-secondary hover:shadow-lg transition-all duration-200"
                onClick={() => setLocation("/projects")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4 group-hover:bg-secondary/20">
                    <FolderOpen className="w-6 h-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg mb-2">Importer Projet</CardTitle>
                  <CardDescription>
                    Intégrer un projet VS Code existant pour modification
                  </CardDescription>
                </CardContent>
              </Card>

              <Card 
                className="group cursor-pointer hover:border-accent hover:shadow-lg transition-all duration-200"
                onClick={() => setLocation("/documentation")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4 group-hover:bg-accent/20">
                    <Code className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg mb-2">Extension VS Code</CardTitle>
                  <CardDescription>
                    Lancer l'intégration directement dans VS Code
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Projets Récents</h2>
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/projects")}
                className="text-primary hover:text-blue-700"
              >
                Voir tout →
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet récent</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Créez votre premier projet pour commencer à construire des pages web
                  </p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un Projet
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Integration Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Intégration VS Code</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Configuré
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Extension installée et prête à utiliser dans vos projets VS Code.
                </CardDescription>
                <div className="flex space-x-3">
                  <Button className="flex-1">
                    Ouvrir VS Code
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Configurer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Déploiement cPanel</CardTitle>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Configuration requise
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Configurez vos paramètres d'hébergement pour le déploiement automatique.
                </CardDescription>
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1 bg-secondary text-white hover:bg-green-700">
                    Configurer
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Tester
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documentation & Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="group cursor-pointer hover:border-primary hover:bg-blue-50 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Download className="w-5 h-5 text-primary mr-3" />
                      <h4 className="font-medium text-gray-900">Installation</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Guide d'installation et configuration initiale
                    </p>
                  </CardContent>
                </Card>

                <Card className="group cursor-pointer hover:border-secondary hover:bg-green-50 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Plug className="w-5 h-5 text-secondary mr-3" />
                      <h4 className="font-medium text-gray-900">Intégration</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Intégrer dans projets VS Code existants
                    </p>
                  </CardContent>
                </Card>

                <Card className="group cursor-pointer hover:border-accent hover:bg-purple-50 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Rocket className="w-5 h-5 text-accent mr-3" />
                      <h4 className="font-medium text-gray-900">Déploiement</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Déployer sur hébergement cPanel
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <CreateProjectModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}
