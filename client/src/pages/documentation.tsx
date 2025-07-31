import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Play, 
  Code, 
  Palette, 
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Video,
  FileText,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');

  const quickStart = [
    {
      title: "Créer votre premier projet",
      description: "Guide étape par étape pour débuter",
      duration: "5 min",
      icon: Play,
      category: "Débutant"
    },
    {
      title: "Interface de l'éditeur",
      description: "Découvrez les outils disponibles",
      duration: "8 min",
      icon: Palette,
      category: "Débutant"
    },
    {
      title: "Système de composants",
      description: "Comprendre les éléments de design",
      duration: "12 min",
      icon: Code,
      category: "Intermédiaire"
    },
    {
      title: "Déploiement et publication",
      description: "Mettre votre site en ligne",
      duration: "6 min",
      icon: Settings,
      category: "Débutant"
    }
  ];

  const categories = [
    {
      title: "Guides de Démarrage",
      description: "Tout ce qu'il faut savoir pour commencer",
      icon: BookOpen,
      articles: 12,
      color: "bg-blue-500"
    },
    {
      title: "Éditeur Visuel",
      description: "Maîtrisez l'interface de création",
      icon: Palette,
      articles: 18,
      color: "bg-green-500"
    },
    {
      title: "Composants",
      description: "Documentation des éléments disponibles",
      icon: Code,
      articles: 24,
      color: "bg-purple-500"
    },
    {
      title: "Déploiement",
      description: "Publier et gérer vos sites",
      icon: Settings,
      articles: 8,
      color: "bg-orange-500"
    },
    {
      title: "API & Intégrations",
      description: "Connecter des services externes",
      icon: ExternalLink,
      articles: 15,
      color: "bg-red-500"
    },
    {
      title: "Résolution de Problèmes",
      description: "Solutions aux problèmes courants",
      icon: HelpCircle,
      articles: 10,
      color: "bg-yellow-500"
    }
  ];

  const popularArticles = [
    {
      title: "Comment personnaliser les couleurs de votre site",
      category: "Design",
      views: "2.1k vues",
      type: "article"
    },
    {
      title: "Rendre votre site responsive sur mobile",
      category: "Responsive",
      views: "1.8k vues",
      type: "video"
    },
    {
      title: "Optimiser les performances de votre site",
      category: "Performance",
      views: "1.5k vues",
      type: "article"
    },
    {
      title: "Intégrer des formulaires de contact",
      category: "Composants",
      views: "1.3k vues",
      type: "tutorial"
    },
    {
      title: "Configurer un domaine personnalisé",
      category: "Déploiement",
      views: "1.1k vues",
      type: "article"
    }
  ];

  const filteredQuickStart = quickStart.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Documentation</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Guides, tutoriels et références pour maîtriser PageForge
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher dans la documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Démarrage Rapide</span>
          </CardTitle>
          <CardDescription>
            Les guides essentiels pour commencer avec PageForge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuickStart.map((guide, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <guide.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {guide.title}
                      </h3>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {guide.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{guide.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">{category.articles} articles</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Articles Populaires</CardTitle>
            <CardDescription>
              Les guides les plus consultés par la communauté
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                    {article.type === 'video' ? (
                      <Video className="h-4 w-4 text-gray-600" />
                    ) : article.type === 'tutorial' ? (
                      <Play className="h-4 w-4 text-gray-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                      {article.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{article.views}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support & Communauté</CardTitle>
            <CardDescription>
              Obtenez de l'aide et connectez-vous avec d'autres utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Forum Communauté</h4>
              </div>
              <p className="text-sm text-blue-800 mb-3">
                Posez vos questions et partagez vos créations avec la communauté PageForge
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Rejoindre le Forum
              </Button>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <HelpCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Support Direct</h4>
              </div>
              <p className="text-sm text-green-800 mb-3">
                Contactez notre équipe pour un support personnalisé
              </p>
              <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                Contacter le Support
              </Button>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Video className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-purple-900">Tutoriels Vidéo</h4>
              </div>
              <p className="text-sm text-purple-800 mb-3">
                Apprenez en regardant nos tutoriels vidéo détaillés
              </p>
              <Button size="sm" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                Voir les Vidéos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}