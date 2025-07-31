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
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@shared/schema';

export default function Deployment() {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [deploymentUrl, setDeploymentUrl] = useState<string>('');
  const [isDeploying, setIsDeploying] = useState(false);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  const handleDeploy = async (projectId: string) => {
    setIsDeploying(true);
    try {
      // Simulation de déploiement
      await new Promise(resolve => setTimeout(resolve, 3000));
      const mockUrl = `https://${Math.random().toString(36).substring(7)}.pageforge.app`;
      setDeploymentUrl(mockUrl);
      
      toast({
        title: "Déploiement réussi !",
        description: `Votre site est maintenant accessible à l'adresse : ${mockUrl}`,
      });
    } catch (error) {
      toast({
        title: "Erreur de déploiement",
        description: "Une erreur s'est produite lors du déploiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(deploymentUrl);
    toast({
      title: "URL copiée",
      description: "L'URL a été copiée dans le presse-papiers",
    });
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
                    onClick={() => selectedProject && handleDeploy(selectedProject)}
                    disabled={!selectedProject || isDeploying}
                    className="w-full"
                  >
                    {isDeploying ? (
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

              {deploymentUrl && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Déploiement réussi !</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      value={deploymentUrl}
                      readOnly
                      className="flex-1 bg-white"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={copyUrl}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" asChild>
                        <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
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
                Vos derniers déploiements et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Site Portfolio", url: "https://portfolio.pageforge.app", status: "success", date: "Il y a 2 heures" },
                  { name: "Landing Page", url: "https://landing.pageforge.app", status: "success", date: "Hier" },
                  { name: "Blog Personnel", url: "https://blog.pageforge.app", status: "building", date: "Il y a 3 jours" }
                ].map((deployment, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${deployment.status === 'success' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        {deployment.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{deployment.name}</p>
                        <p className="text-sm text-gray-500">{deployment.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={deployment.status === 'success' ? 'default' : 'secondary'}>
                        {deployment.status === 'success' ? 'En ligne' : 'En cours'}
                      </Badge>
                      <span className="text-sm text-gray-500">{deployment.date}</span>
                    </div>
                  </div>
                ))}
              </div>
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
                  <Button className="w-full mt-4" variant={platform.recommended ? "default" : "outline"}>
                    Configurer
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
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Ajouter Domaine
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