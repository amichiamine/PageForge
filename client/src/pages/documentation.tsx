import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import { 
  Download, 
  Code, 
  Server, 
  FileText, 
  ExternalLink, 
  Copy,
  CheckCircle,
  AlertTriangle,
  Info,
  Terminal
} from "lucide-react";

export default function Documentation() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Header 
        title="Documentation"
        subtitle="Guide complet d'utilisation et d'intégration"
        actions={
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Documentation complète
          </Button>
        }
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6 max-w-6xl mx-auto">
          <Tabs defaultValue="installation" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="usage">Utilisation</TabsTrigger>
              <TabsTrigger value="vscode">VS Code</TabsTrigger>
              <TabsTrigger value="deployment">Déploiement</TabsTrigger>
              <TabsTrigger value="package">Package</TabsTrigger>
            </TabsList>

            {/* Installation */}
            <TabsContent value="installation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Installation de PageForge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Info className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">Prérequis</span>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Node.js 18+ et npm</li>
                      <li>• VS Code (pour l'intégration)</li>
                      <li>• Git (optionnel)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Installation globale</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span>npm install -g pageforge</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard("npm install -g pageforge")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Installation dans un projet</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span>npm install pageforge</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard("npm install pageforge")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>npx pageforge init</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard("npx pageforge init")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Vérification de l'installation</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span>pageforge --version</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard("pageforge --version")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Usage */}
            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Utilisation Standalone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Lancement de l'application</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span>sitejet-clone start</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard("sitejet-clone start")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Lance l'interface web sur http://localhost:5000
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Création d'un nouveau projet</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                      <li>Cliquez sur "Nouvelle Page" dans le tableau de bord</li>
                      <li>Choisissez un nom et un type de projet</li>
                      <li>Sélectionnez un template ou commencez from scratch</li>
                      <li>Cliquez sur "Créer la Page"</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Édition visuelle</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                      <li>Glissez-déposez des composants depuis la palette</li>
                      <li>Sélectionnez un élément pour modifier ses propriétés</li>
                      <li>Utilisez les outils de responsive design</li>
                      <li>Prévisualisez en temps réel</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Export du projet</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="font-medium text-green-900">Export automatique</span>
                      </div>
                      <p className="text-sm text-green-800">
                        L'export génère du code HTML/CSS/JS propre et optimisé, prêt pour la production.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* VS Code Integration */}
            <TabsContent value="vscode" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2" />
                    Intégration VS Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Installation de l'extension</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                      <li>Ouvrez VS Code</li>
                      <li>Allez dans Extensions (Ctrl+Shift+X)</li>
                      <li>Recherchez "PageForge"</li>
                      <li>Cliquez sur "Install"</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Utilisation dans un projet existant</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                        <div className="text-gray-400 mb-1"># Ouvrir l'éditeur visuel</div>
                        <div>Ctrl+Shift+P → "PageForge: Edit Page"</div>
                      </div>
                      
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                        <div className="text-gray-400 mb-1"># Ou via clic droit sur un fichier HTML</div>
                        <div>Right-click → "Edit with PageForge"</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Configuration</h3>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <pre className="text-sm"><code>{`{
  "pageforge.autoSave": true,
  "pageforge.theme": "auto",
  "pageforge.port": 5000,
  "pageforge.openInExternalBrowser": false
}`}</code></pre>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="font-medium text-yellow-900">Important</span>
                    </div>
                    <p className="text-sm text-yellow-800">
                      L'extension modifie directement vos fichiers. Assurez-vous d'avoir une sauvegarde ou d'utiliser Git.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deployment */}
            <TabsContent value="deployment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="w-5 h-5 mr-2" />
                    Déploiement cPanel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Configuration FTP/SFTP</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Serveur</label>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          ftp.votre-site.com
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Port</label>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          21 (FTP) / 22 (SFTP)
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Utilisateur</label>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          votre-username
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Dossier cible</label>
                        <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                          /public_html/
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Déploiement automatique</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                      <li>Configurez vos paramètres FTP dans les réglages</li>
                      <li>Testez la connexion</li>
                      <li>Cliquez sur "Déployer" dans l'éditeur</li>
                      <li>Les fichiers sont uploadés automatiquement</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Déploiement manuel</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-700 mb-2">1. Exportez votre projet</p>
                        <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                          pageforge export --project-id=123
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-700 mb-2">2. Uploadez les fichiers via cPanel File Manager ou FTP</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                          <li>index.html → /public_html/</li>
                          <li>styles.css → /public_html/css/</li>
                          <li>script.js → /public_html/js/</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="font-medium text-green-900">Optimisations incluses</span>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Code minifié et optimisé</li>
                      <li>• Meta tags SEO automatiques</li>
                      <li>• Structure responsive</li>
                      <li>• Performance optimisée</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Package Management */}
            <TabsContent value="package" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    Gestion des Packages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Build portable</h3>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span>npm run build-portable</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard("npm run build-portable")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Génère un exécutable portable pour Windows, macOS et Linux
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Package pour distribution</h3>
                    <div className="space-y-2">
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                        npm run package-win    # Windows .exe
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                        npm run package-mac    # macOS .dmg
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                        npm run package-linux  # Linux .AppImage
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Mise à jour</h3>
                    <div className="space-y-2">
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                        <div className="text-gray-400 mb-1"># Vérifier les mises à jour</div>
                        <div>pageforge --check-updates</div>
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                        <div className="text-gray-400 mb-1"># Mettre à jour</div>
                        <div>npm update -g pageforge</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Configuration avancée</h3>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <pre className="text-sm"><code>{`{
  "name": "pageforge",
  "version": "1.0.0",
  "portable": {
    "platform": "all",
    "architecture": "x64",
    "compression": true,
    "bundleExtensions": true
  },
  "build": {
    "target": "node18",
    "minify": true,
    "externals": ["electron"]
  }
}`}</code></pre>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Info className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">Avantages du package portable</span>
                      </div>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Aucune dépendance externe</li>
                        <li>• Installation rapide</li>
                        <li>• Compatible tous OS</li>
                        <li>• Auto-mise à jour</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Download className="w-4 h-4 text-purple-600 mr-2" />
                        <span className="font-medium text-purple-900">Distribution</span>
                      </div>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• NPM Registry</li>
                        <li>• GitHub Releases</li>
                        <li>• VS Code Marketplace</li>
                        <li>• Site web officiel</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
