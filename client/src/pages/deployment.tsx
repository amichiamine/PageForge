import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Upload, 
  Globe, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Download,
  ExternalLink,
  Copy,
  Server,
  Shield,
  Zap,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Project, Deployment } from '@shared/schema';

export default function Deployment() {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  const { data: deployments = [], isLoading: deploymentsLoading } = useQuery<Deployment[]>({
    queryKey: ['/api/deployments'],
    refetchInterval: 5000 // Actualisation toutes les 5 secondes pour voir les changements de statut
  });

  const deployMutation = useMutation({
    mutationFn: async ({ projectId, platform, customUrl }: { projectId: string; platform: string; customUrl?: string }) => {
      const projectName = projects.find(p => p.id === projectId)?.name || 'Projet';
      const response = await fetch('/api/deployments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          name: `${projectName} - ${new Date().toLocaleDateString()}`,
          platform,
          url: customUrl,
          config: customUrl ? { customDomain: customUrl } : {}
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (deployment) => {
      queryClient.invalidateQueries({ queryKey: ['/api/deployments'] });
      toast({
        title: "Déploiement démarré !",
        description: `Le déploiement vers ${deployment.url} est en cours...`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de déploiement",
        description: error.message || "Une erreur s'est produite lors du déploiement.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (deploymentId: string) => {
      const response = await fetch(`/api/deployments/${deploymentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deployments'] });
      toast({
        title: "Déploiement supprimé",
        description: "Le déploiement a été supprimé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le déploiement.",
        variant: "destructive",
      });
    }
  });

  const handleDeploy = (platform: string = 'pageforge') => {
    if (!selectedProject) return;
    
    deployMutation.mutate({ 
      projectId: selectedProject, 
      platform,
      customUrl: platform === 'custom' ? customDomain : undefined
    });
  };

  const handleDelete = (deploymentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce déploiement ?')) {
      deleteMutation.mutate(deploymentId);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiée",
      description: "L'URL a été copiée dans le presse-papiers",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'building': case 'deploying': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'building': case 'deploying': return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'En ligne';
      case 'failed': return 'Échec';
      case 'building': return 'Construction';
      case 'deploying': return 'Déploiement';
      default: return 'Inconnu';
    }
  };

  const deploymentPlatforms = [
    {
      name: "PageForge Cloud",
      description: "Hébergement optimisé pour vos sites PageForge",
      icon: Globe,
      features: ["SSL automatique", "CDN global", "Domaine .pageforge.app"],
      price: "Gratuit",
      recommended: true
    },
    {
      name: "Netlify",
      description: "Plateforme de déploiement moderne",
      icon: Zap,
      features: ["Deploy hooks", "Branch deploys", "Domaine personnalisé"],
      price: "Freemium"
    },
    {
      name: "Vercel",
      description: "Optimisé pour les frameworks modernes",
      icon: Server,
      features: ["Edge Functions", "Analytics", "Prévisualisation"],
      price: "Freemium"
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Déploiement</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Publiez vos sites web en quelques clics
        </p>
      </div>

      <Tabs defaultValue="deploy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="deploy">Déployer</TabsTrigger>
          <TabsTrigger value="platforms">Plateformes</TabsTrigger>
          <TabsTrigger value="domains">Domaines</TabsTrigger>
        </TabsList>

        <TabsContent value="deploy" className="space-y-6">
          {/* Quick Deploy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Déploiement Rapide</span>
              </CardTitle>
              <CardDescription>
                Sélectionnez un projet et déployez-le instantanément
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-select">Projet à déployer</Label>
                  <select
                    id="project-select"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un projet...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => handleDeploy('pageforge')}
                    disabled={!selectedProject || deployMutation.isPending}
                    className="w-full"
                  >
                    {deployMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Déploiement...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Déployer
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Déploiements récents pour le projet sélectionné */}
              {selectedProject && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Déploiements de ce projet</h4>
                  <div className="space-y-2">
                    {deployments
                      .filter(deployment => deployment.projectId === selectedProject)
                      .slice(0, 3)
                      .map((deployment) => (
                        <div key={deployment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(deployment.status)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{deployment.name}</p>
                              <p className="text-xs text-gray-500">{deployment.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(deployment.status)}>
                              {getStatusText(deployment.status)}
                            </Badge>
                            {deployment.status === 'success' && (
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" onClick={() => copyUrl(deployment.url)}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" asChild>
                                  <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deployment History */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des Déploiements</CardTitle>
              <CardDescription>
                Tous vos déploiements et leur statut en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deploymentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Chargement...</span>
                </div>
              ) : deployments.length === 0 ? (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun déploiement pour le moment</p>
                  <p className="text-sm text-gray-400">Commencez par déployer votre premier projet !</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deployments.map((deployment) => {
                    const project = projects.find(p => p.id === deployment.projectId);
                    return (
                      <div key={deployment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            deployment.status === 'success' ? 'bg-green-100' : 
                            deployment.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            {getStatusIcon(deployment.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{deployment.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {deployment.platform}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 break-all">{deployment.url}</p>
                            {project && (
                              <p className="text-xs text-gray-400">Projet: {project.name}</p>
                            )}
                            {deployment.buildLog && deployment.status === 'failed' && (
                              <p className="text-xs text-red-600 mt-1">{deployment.buildLog}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge className={getStatusColor(deployment.status)}>
                              {getStatusText(deployment.status)}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(deployment.createdAt).toLocaleDateString()} à {new Date(deployment.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {deployment.status === 'success' && (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => copyUrl(deployment.url)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" asChild>
                                  <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDelete(deployment.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deploymentPlatforms.map((platform, index) => (
              <Card key={index} className={`relative ${platform.recommended ? 'ring-2 ring-blue-500' : ''}`}>
                {platform.recommended && (
                  <div className="absolute -top-2 left-4">
                    <Badge className="bg-blue-500">Recommandé</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <platform.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{platform.price}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {platform.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    variant={platform.recommended ? "default" : "outline"}
                    onClick={() => handleDeploy(platform.name.toLowerCase().replace(/\s+/g, '-'))}
                    disabled={!selectedProject || deployMutation.isPending}
                  >
                    {platform.recommended ? 'Déployer' : 'Configurer'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="domains" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Gestion des Domaines</span>
              </CardTitle>
              <CardDescription>
                Configurez vos domaines personnalisés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="domain">Domaine personnalisé</Label>
                  <Input
                    id="domain"
                    placeholder="monsite.com"
                    className="mt-1"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      if (customDomain) {
                        handleDeploy('custom');
                      }
                    }}
                    disabled={!selectedProject || !customDomain || deployMutation.isPending}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Déployer avec Domaine
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Configuration DNS</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Ajoutez ces enregistrements DNS à votre domaine :
                </p>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-white p-2 rounded border">
                    <span className="text-gray-600">A</span> @ 185.199.108.153
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="text-gray-600">CNAME</span> www pageforge.app
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}