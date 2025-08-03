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
  Users,
  Zap,
  Smartphone,
  Layers,
  Lightbulb,
  Keyboard,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      description: "Publication et hébergement",
      icon: Settings,
      articles: 8,
      color: "bg-orange-500"
    }
  ];

  const popularArticles = [
    {
      title: "Comment créer une page d'accueil moderne",
      category: "Design",
      type: "tutorial",
      views: "12.5k vues"
    },
    {
      title: "Optimiser ses designs pour mobile",
      category: "Responsive",
      type: "article",
      views: "8.2k vues"
    },
    {
      title: "Guide complet des composants",
      category: "Composants",
      type: "video",
      views: "15.3k vues"
    },
    {
      title: "Exporter et déployer son site",
      category: "Déploiement",
      type: "tutorial",
      views: "6.7k vues"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Centre d'Aide PageForge
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Trouvez des guides, tutoriels et ressources pour maîtriser PageForge
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher dans la documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guide">Guide d'utilisation</TabsTrigger>
            <TabsTrigger value="quick-start">Démarrage rapide</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* Guide d'utilisation complet */}
          <TabsContent value="guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Guide d'utilisation</span>
                </CardTitle>
                <CardDescription>
                  Apprenez à utiliser PageForge étape par étape
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Démarrage rapide */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-600" />
                    Démarrage rapide
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">1. Créer un nouveau projet</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Allez dans "Projets" → "Nouveau projet" → Choisissez un template ou partez de zéro
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium">2. Ajouter des composants</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Desktop :</strong> Glissez-déposez depuis la palette de gauche (52 composants disponibles)<br/>
                        <strong>Mobile/Tablette :</strong> Double-cliquez sur un composant pour l'ajouter
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-medium">3. Personnaliser</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Sélectionnez un composant et modifiez ses propriétés dans le panneau de droite avec les options dédiées à chaque type
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-medium">4. Prévisualiser et exporter</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Utilisez "Préview" pour voir le rendu final et "Export" pour télécharger ou "Déploiement" pour publier directement
                      </p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-medium">5. Déployer en ligne</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Accédez à "Déploiement" pour publier instantanément sur PageForge.app ou d'autres plateformes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interface tactile */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                    Interface tactile
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">📱 Sur mobile et tablette :</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Double-clic</strong> sur un composant pour l'ajouter au centre</li>
                      <li>• Les <strong>panneaux latéraux</strong> s'ouvrent en overlay plein écran</li>
                      <li>• <strong>Vibrations tactiles</strong> pour le feedback (si disponible)</li>
                      <li>• Boutons d'accès rapide en bas pour ouvrir/fermer les panneaux</li>
                      <li>• <strong>Clic sur fond vide</strong> pour désélectionner un composant</li>
                    </ul>
                  </div>
                </div>

                {/* Composants disponibles */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-purple-600" />
                    52 Composants disponibles (8 catégories)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-blue-50">
                        <h4 className="font-medium text-blue-600 mb-2">📝 Typography (7)</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Heading - Titres H1-H6</li>
                          <li>• Paragraph - Paragraphes</li>
                          <li>• Quote - Citations</li>
                          <li>• List - Listes à puces</li>
                          <li>• Code - Blocs de code</li>
                          <li>• Highlight - Texte surligné</li>
                          <li>• Callout - Encadrés</li>
                        </ul>
                      </div>
                      <div className="p-3 border rounded-lg bg-green-50">
                        <h4 className="font-medium text-green-600 mb-2">📐 Layout (8)</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Container - Conteneurs</li>
                          <li>• Section - Sections</li>
                          <li>• Header - En-têtes</li>
                          <li>• Footer - Pieds de page</li>
                          <li>• Sidebar - Barres latérales</li>
                          <li>• Grid - Grilles CSS</li>
                          <li>• Flex - Layouts flexibles</li>
                          <li>• Spacer - Espacement</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-purple-50">
                        <h4 className="font-medium text-purple-600 mb-2">🧭 Navigation (6)</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Navbar - Barres de navigation</li>
                          <li>• Menu - Menus déroulants</li>
                          <li>• Breadcrumb - Fil d'Ariane</li>
                          <li>• Link - Liens hypertexte</li>
                          <li>• Button Link - Boutons-liens</li>
                          <li>• Pagination - Navigation pages</li>
                        </ul>
                      </div>
                      <div className="p-3 border rounded-lg bg-indigo-50">
                        <h4 className="font-medium text-indigo-600 mb-2">🖼️ Media (7)</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Image - Images</li>
                          <li>• Gallery - Galeries</li>
                          <li>• Carousel - Carrousels</li>
                          <li>• Video - Vidéos</li>
                          <li>• Audio - Audio</li>
                          <li>• Icon - Icônes</li>
                          <li>• Avatar - Avatars</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-orange-50">
                        <h4 className="font-medium text-orange-600 mb-2">📋 Forms (6)</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Input - Champs de saisie</li>
                          <li>• Textarea - Zones de texte</li>
                          <li>• Select - Listes déroulantes</li>
                          <li>• Checkbox - Cases à cocher</li>
                          <li>• Radio - Boutons radio</li>
                          <li>• Button - Boutons</li>
                        </ul>
                      </div>
                      <div className="p-3 border rounded-lg bg-yellow-50">
                        <h4 className="font-medium text-yellow-600 mb-2">⚡ Interactive (9)</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Tabs - Onglets</li>
                          <li>• Accordion - Accordéons</li>
                          <li>• Modal - Fenêtres modales</li>
                          <li>• Dropdown - Menus déroulants</li>
                          <li>• Tooltip - Info-bulles</li>
                          <li>• Progress - Barres de progression</li>
                          <li>• Badge - Badges</li>
                          <li>• Alert - Alertes</li>
                          <li>• Card - Cartes</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-red-50">
                        <h4 className="font-medium text-red-600 mb-2">🛒 E-commerce (5)</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Product Card - Fiches produits</li>
                          <li>• Price Table - Grilles tarifaires</li>
                          <li>• Shopping Cart - Paniers</li>
                          <li>• Checkout - Commandes</li>
                          <li>• Review - Avis clients</li>
                        </ul>
                      </div>
                      <div className="p-3 border rounded-lg bg-pink-50">
                        <h4 className="font-medium text-pink-600 mb-2">📢 Marketing (4)</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• CTA - Appels à l'action</li>
                          <li>• Testimonial - Témoignages</li>
                          <li>• Stats - Statistiques</li>
                          <li>• Feature - Fonctionnalités</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">🏗️ Architecture unifiée</h4>
                    <p className="text-sm text-blue-800">
                      Tous les composants suivent une architecture standardisée avec des panneaux de configuration dédiés, des presets optimisés et une gestion unifiée via componentData pour une expérience utilisateur cohérente.
                    </p>
                  </div>
                </div>

                {/* Système de déploiement */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-indigo-600" />
                    Système de déploiement
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-medium text-indigo-800 mb-2">🚀 Déploiement en un clic</h4>
                      <p className="text-sm text-indigo-700 mb-3">
                        Publiez votre site instantanément avec le système de déploiement intégré
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <h5 className="font-medium text-indigo-800">Options disponibles :</h5>
                          <ul className="text-indigo-700 space-y-1 mt-1">
                            <li>• PageForge.app (recommandé)</li>
                            <li>• Netlify, Vercel, GitHub Pages</li>
                            <li>• Domaine personnalisé</li>
                            <li>• Serveurs FTP/cPanel</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-indigo-800">Fonctionnalités :</h5>
                          <ul className="text-indigo-700 space-y-1 mt-1">
                            <li>• URL automatique générée</li>
                            <li>• Suivi en temps réel</li>
                            <li>• Historique des déploiements</li>
                            <li>• SSL/TLS automatique</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-green-800">📋 Processus de déploiement</h4>
                      <ol className="text-sm text-green-700 mt-2 space-y-1">
                        <li>1. Allez dans "Déploiement" depuis la sidebar</li>
                        <li>2. Sélectionnez votre projet à déployer</li>
                        <li>3. Choisissez une plateforme (PageForge recommandé)</li>
                        <li>4. Cliquez "Déployer" et suivez le processus en temps réel</li>
                        <li>5. Votre site est en ligne avec une URL unique</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Conseils et astuces */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    Conseils et astuces
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h4 className="font-medium text-yellow-800">💡 Positionnement précis</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Utilisez les guides d'alignement (icône grille) pour aligner parfaitement vos composants
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-800">⚡ Sauvegarde automatique</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Activez l'auto-save dans les paramètres pour ne jamais perdre votre travail
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-green-800">📱 Mode responsive</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Testez votre design sur différentes tailles d'écran avec les boutons Desktop/Tablette/Mobile
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-medium text-purple-800">🎯 Gestion des composants</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Chaque composant a son panneau de configuration dédié avec des presets pour une personnalisation rapide
                      </p>
                    </div>
                  </div>
                </div>

                {/* Raccourcis clavier */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Keyboard className="h-5 w-5 mr-2 text-gray-600" />
                    Raccourcis clavier
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+S</kbd> Sauvegarder</p>
                        <p><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+Z</kbd> Annuler</p>
                        <p><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+Y</kbd> Refaire</p>
                      </div>
                      <div>
                        <p><kbd className="px-2 py-1 bg-gray-200 rounded">Suppr</kbd> Supprimer le composant sélectionné</p>
                        <p><kbd className="px-2 py-1 bg-gray-200 rounded">Échap</kbd> Désélectionner</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Start Tab */}
          <TabsContent value="quick-start" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guides de Démarrage Rapide</CardTitle>
                <CardDescription>
                  Commencez rapidement avec ces tutoriels essentiels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickStart.map((guide, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start space-x-4">
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
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}