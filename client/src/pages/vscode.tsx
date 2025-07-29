import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Download, FileText, Settings, ExternalLink } from "lucide-react";

export default function VSCode() {
  return (
    <>
      <Header 
        title="Intégration VS Code"
        subtitle="Configuration et utilisation dans VS Code"
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Installation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Installation
                </CardTitle>
                <CardDescription>
                  Intégrez PageForge dans votre environnement VS Code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">1. Cloner le projet</h4>
                  <code className="text-sm bg-black text-green-400 p-2 rounded block">
                    git clone https://github.com/votre-repo/pageforge.git
                  </code>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">2. Installer les dépendances</h4>
                  <code className="text-sm bg-black text-green-400 p-2 rounded block">
                    cd pageforge<br/>
                    npm install
                  </code>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">3. Lancer en mode développement</h4>
                  <code className="text-sm bg-black text-green-400 p-2 rounded block">
                    npm run dev
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Configurez PageForge pour votre projet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Variables d'environnement</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Créez un fichier <code>.env</code> à la racine du projet :
                  </p>
                  <div className="bg-black text-green-400 p-3 rounded text-sm font-mono">
                    <div>DATABASE_URL=postgresql://user:password@localhost:5432/dbname</div>
                    <div>NODE_ENV=development</div>
                    <div>PORT=5000</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Structure recommandée</h4>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    <div>mon-projet/</div>
                    <div>├── pageforge/          # Ce dossier</div>
                    <div>├── src/                   # Votre code source</div>
                    <div>├── public/               # Assets statiques</div>
                    <div>└── pages/                # Pages générées</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extensions VS Code recommandées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Extensions VS Code recommandées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Auto Rename Tag</h4>
                    <p className="text-sm text-gray-600">Renommage automatique des balises HTML</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Prettier</h4>
                    <p className="text-sm text-gray-600">Formatage automatique du code</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">ES7+ React/Redux</h4>
                    <p className="text-sm text-gray-600">Snippets pour React et TypeScript</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold">Live Server</h4>
                    <p className="text-sm text-gray-600">Serveur de développement intégré</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Workflow de développement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Créer/Modifier des pages</h4>
                      <p className="text-sm text-gray-600">Utilisez l'éditeur visuel pour créer vos pages</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Exporter le code</h4>
                      <p className="text-sm text-gray-600">Exportez les fichiers HTML/CSS/JS générés</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Intégrer dans votre projet</h4>
                      <p className="text-sm text-gray-600">Copiez les fichiers dans votre projet VS Code</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Documentation complète
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Télécharger les exemples
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}