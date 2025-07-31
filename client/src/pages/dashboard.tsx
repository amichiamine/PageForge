import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Plus, 
  FolderOpen, 
  Layers, 
  Users, 
  BarChart3, 
  Clock, 
  Star,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@shared/schema';

export default function Dashboard() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  const recentProjects = projects.slice(0, 5);
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.settings?.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.settings?.status === 'draft' || !p.settings?.status).length;

  const stats = [
    {
      title: "Projets Total",
      value: totalProjects.toString(),
      description: "Tous vos projets",
      icon: FolderOpen,
      color: "bg-blue-500"
    },
    {
      title: "En Cours",
      value: inProgressProjects.toString(),
      description: "Projets actifs",
      icon: Activity,
      color: "bg-yellow-500"
    },
    {
      title: "Terminés",
      value: completedProjects.toString(),
      description: "Projets finalisés",
      icon: Star,
      color: "bg-green-500"
    },
    {
      title: "Templates",
      value: "8",
      description: "Modèles disponibles",
      icon: Layers,
      color: "bg-purple-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Gérez vos projets et suivez vos statistiques
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/templates">
            <Button variant="outline" className="w-full sm:w-auto">
              <Layers className="h-4 w-4 mr-2" />
              Parcourir Templates
            </Button>
          </Link>
          <Link href="/projects">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Projet
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Projets Récents</CardTitle>
                <CardDescription>
                  Vos derniers projets modifiés
                </CardDescription>
              </div>
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  Voir tout
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Aucun projet pour le moment</p>
                  <Link href="/projects">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer votre premier projet
                    </Button>
                  </Link>
                </div>
              ) : (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FolderOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {project.description || 'Aucune description'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {project.type}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Modifié récemment
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/editor/${project.id}`}>
                      <Button size="sm" variant="ghost">
                        Ouvrir
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>
                Raccourcis vers les fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/projects" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Projet
                </Button>
              </Link>
              <Link href="/templates" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Layers className="h-4 w-4 mr-2" />
                  Parcourir Templates
                </Button>
              </Link>
              <Link href="/deployment" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Déployer un Site
                </Button>
              </Link>
              <Link href="/documentation" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activité</CardTitle>
              <CardDescription>
                Résumé de votre activité récente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-900">Système en ligne</p>
                    <p className="text-gray-500 text-xs">Tous les services fonctionnent</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="text-gray-900">Dernière connexion</p>
                    <p className="text-gray-500 text-xs">Aujourd'hui</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <div className="text-sm">
                    <p className="text-gray-900">Performance</p>
                    <p className="text-gray-500 text-xs">Excellente</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}